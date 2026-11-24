uniform vec3 uCameraPos;
uniform vec3 uCameraTarget;
uniform float uDiskTilt;
uniform vec2 uZoom;
uniform float uTime;
uniform float uScrollVelocity;
uniform float uTurbulence;
uniform float uColorTemp;
uniform float uDissolve;
uniform float uRingPulse;
uniform float uDiskEmission;

varying vec2 vScreen;

// Units set the critical impact parameter to one: b_crit = sqrt(27) M.
const float MASS = 0.19245009;
const float PI = 3.14159265;
const float DISK_INNER = 1.18;
const float DISK_OUTER = 4.75;
const vec3 VOID = vec3(0.00091, 0.00091, 0.00152);
const vec3 WHITE_GOLD = vec3(1.0, 0.905, 0.715);
const vec3 GOLD = vec3(0.807, 0.328, 0.072);
const vec3 AMBER = vec3(0.552, 0.107, 0.018);
const vec3 EMBER = vec3(0.047, 0.007, 0.0024);

float hash(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float noise(vec3 p) {
  vec3 cell = floor(p);
  vec3 t = fract(p);
  t *= t * (3.0 - 2.0 * t);
  vec4 a = vec4(hash(cell), hash(cell + vec3(1, 0, 0)),
                hash(cell + vec3(0, 1, 0)), hash(cell + vec3(1, 1, 0)));
  cell.z += 1.0;
  vec4 b = vec4(hash(cell), hash(cell + vec3(1, 0, 0)),
                hash(cell + vec3(0, 1, 0)), hash(cell + vec3(1, 1, 0)));
  vec4 layer = mix(a, b, t.z);
  return mix(mix(layer.x, layer.y, t.x), mix(layer.z, layer.w, t.x), t.y);
}

vec4 disk(float radius, vec3 radial, vec3 normal, vec3 toCamera) {
  if (radius < DISK_INNER || radius > DISK_OUTER) return vec4(0.0);

  vec3 tangent = cross(normal, radial);
  float orbitalSpeed = sqrt(MASS / (radius - 2.0 * MASS));
  float approaching = dot(tangent, toCamera);
  float doppler = sqrt(1.0 - orbitalSpeed * orbitalSpeed) / (1.0 - orbitalSpeed * approaching);
  float azimuth = atan(dot(radial, cross(normal, vec3(1, 0, 0))), radial.x);
  float phase = azimuth - uTime * 0.43 / (radius * sqrt(radius));
  vec3 p = vec3(radius * 19.0, cos(phase) * 2.5, sin(phase) * 2.5);
  p.x += clamp(uScrollVelocity, -30.0, 30.0) * 0.035 * sin(azimuth * 3.0);
  float eddies = noise(p * 0.36);
  p.x += eddies * 3.0;
  float fbm = noise(p) * 0.56 + noise(p * 2.03) * 0.29 + noise(p * 4.11) * 0.15;
  float filament = pow(clamp(fbm * 1.18, 0.0, 1.0), 3.0);
  float inner = smoothstep(DISK_INNER, DISK_INNER + 0.13, radius);
  float outer = 1.0 - smoothstep(3.45, DISK_OUTER, radius + (eddies - 0.5) * 0.55);
  float heat = exp(-0.68 * (radius - DISK_INNER));
  float hotSide = clamp(0.20 + 0.68 * approaching + uColorTemp, 0.0, 1.0);
  vec3 color = mix(EMBER, mix(AMBER, GOLD, hotSide), heat);
  color = mix(color, WHITE_GOLD, heat * heat * hotSide * (0.48 + 0.52 * filament));
  float emission = heat * doppler * doppler * doppler * (0.16 + mix(0.32, 2.3 * filament, uTurbulence));
  return vec4(color * emission, inner * outer * (0.77 + 0.23 * fbm));
}

float stars(vec3 ray) {
  vec3 grid = ray * 151.0;
  vec3 cell = floor(grid + 0.5);
  float seed = hash(cell);
  float core = exp(-dot(grid - cell, grid - cell) * 48.0);
  return core * smoothstep(0.978, 1.0, seed) * 0.12;
}

void main() {
  vec3 forward = normalize(uCameraTarget - uCameraPos);
  vec3 right = normalize(cross(forward, vec3(0, 1, 0)));
  vec3 up = cross(right, forward);
  vec3 ray = normalize(forward + vScreen.x * uZoom.x * right + vScreen.y * uZoom.y * up);
  vec3 normal = vec3(0, cos(uDiskTilt), sin(uDiskTilt));
  float invRadius = 1.0 / length(uCameraPos);
  vec3 radial = uCameraPos * invRadius;
  vec3 transverse = ray - radial * dot(ray, radial);
  float sine = length(transverse);
  float impact = sine / (invRadius * sqrt(1.0 - 2.0 * MASS * invRadius));
  float pixel = max(fwidth(impact), 0.0001);
  vec3 skyRay = ray;
  vec3 light = vec3(0.0);
  float transmission = 1.0;
  bool captured = impact < 1.0;
  vec3 closest = (radial - ray * dot(ray, radial)) / invRadius;
  float diskBand = abs(dot(ray, normal)) * DISK_OUTER + 0.35;
  bool nearDisk = impact < 2.7 || abs(dot(closest, normal)) < diskBand;

  // Rays beyond the disk take the weak deflection approximation.
  if (nearDisk && impact < DISK_OUTER + 0.7 && sine > 0.00001) {
    vec3 tangent = transverse / sine;
    float angle = 0.0;
    float plane = mod(atan(-dot(radial, normal), dot(tangent, normal)), PI);
    float u = invRadius;
    float du = -dot(ray, radial) / impact;

    for (int step = 0; step < 88; step++) {
      // Inverse radius along a Schwarzschild null geodesic: u'' = -u + 3 M u².
      float h = mix(0.22, 0.046, smoothstep(0.30, 1.55, u));
      float midU = u + 0.5 * h * du;
      float midDu = du + 0.5 * h * u * (3.0 * MASS * u - 1.0);
      float nextU = u + h * midDu;
      if (angle + h >= plane) {
        float hitU = mix(u, nextU, (plane - angle) / h);
        if (hitU > 0.0) {
          vec3 hit = radial * cos(plane) + tangent * sin(plane);
          vec4 sampleColor = disk(1.0 / hitU, hit, normal, radial);
          sampleColor.a *= uDiskEmission;
          light += transmission * sampleColor.rgb * sampleColor.a;
          transmission *= 1.0 - sampleColor.a;
        }
        plane += PI;
      }
      du += h * midU * (3.0 * MASS * midU - 1.0);
      u = nextU;
      angle += h;
      if (u > 1.0 / (2.0 * MASS) || transmission < 0.025) break;
      if (u <= 0.0) {
        float escape = angle - h + h * clamp(1.0 - u / (h * midDu), 0.0, 1.0);
        skyRay = radial * cos(escape) + tangent * sin(escape);
        break;
      }
    }
  } else if (impact > 1.0) {
    vec3 towardCenter = normalize(radial - ray * dot(radial, ray));
    skyRay = normalize(ray - towardCenter * (4.0 * MASS / impact));
  }

  float ringWidth = 0.010 + 0.5 * pixel;
  float edge = (impact - 1.009) / ringWidth;
  float ring = exp(-edge * edge) * smoothstep(1.0 - pixel, 1.0 + pixel, impact);
  float beaming = 0.67 + 0.33 * smoothstep(-0.85, 0.75, -vScreen.x / max(uZoom.y, 0.05));
  light += transmission * WHITE_GOLD * ring * beaming * (2.0 + 0.55 * uRingPulse);
  light *= 1.0 - uDissolve;
  float sky = captured ? 0.0 : stars(skyRay) * transmission;
  if (uDissolve > 0.0) sky = mix(sky, stars(ray), uDissolve);
  light += vec3(0.78, 0.78, 0.83) * sky;

  gl_FragColor = vec4(VOID + light, 1.0);
}
