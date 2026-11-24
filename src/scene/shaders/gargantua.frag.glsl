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
uniform vec2 uResolution;
uniform highp sampler3D uNoise;

varying vec2 vScreen;

// Units set the critical impact parameter to one: b_crit = sqrt(27) M.
const float MASS = 0.19245009;
const float PI = 3.14159265;
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
  return texture(uNoise, p / 32.0).r;
}

float filaments(float radius, float azimuth, float omega, float age, float epoch) {
  float phase = azimuth - omega * age;
  float warp = clamp(uScrollVelocity, -30.0, 30.0) * 0.028 * sin(3.0 * azimuth);
  vec3 p = vec3(radius * 29.0 + warp, 2.7 * cos(phase), 2.7 * sin(phase));
  p += vec3(0.0, epoch * 7.13, epoch * 5.83);
  p.x += (noise(p * 0.32) - 0.5) * 5.0;
  return 0.43 * noise(p) + 0.25 * noise(p * 2.03)
       + 0.16 * noise(p * 4.09) + 0.10 * noise(p * 8.21) + 0.06 * noise(p * 16.47);
}

vec4 disk(vec3 point, vec3 normal, vec3 toCamera) {
  float radius = length(point);
  if (radius < DISK_INNER || radius > DISK_OUTER) return vec4(0.0);

  vec3 radial = point / radius;
  vec3 tangent = normalize(cross(normal, radial));
  float orbitalSpeed = sqrt(MASS / (radius - 2.0 * MASS));
  float approaching = dot(tangent, toCamera);
  float doppler = sqrt(1.0 - orbitalSpeed * orbitalSpeed) / (1.0 - orbitalSpeed * approaching);
  float azimuth = atan(dot(radial, cross(normal, vec3(1, 0, 0))), radial.x);
  float omega = DISK_ROTATION / (radius * sqrt(radius));
  float epoch = floor(uTime / 7.0);
  float phase = fract(uTime / 7.0);
  float fbm = mix(
    filaments(radius, azimuth, omega, (phase + 1.0) * 7.0, epoch - 1.0),
    filaments(radius, azimuth, omega, phase * 7.0, epoch),
    smoothstep(0.0, 1.0, phase)
  );
  float filament = pow(clamp(fbm * 1.18, 0.0, 1.0), 3.0);
  float inner = smoothstep(DISK_INNER, DISK_INNER + 0.13, radius);
  float outer = 1.0 - smoothstep(3.45, DISK_OUTER, radius + (fbm - 0.5) * 0.35);
  float radialDelay = 0.06875 + 0.4125 * (DISK_OUTER - radius) / (DISK_OUTER - DISK_INNER);
  outer *= 1.0 - smoothstep(radialDelay, radialDelay + 0.45, uDissolve / 0.65);
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
  vec2 pixelIndex = floor((vScreen * 0.5 + 0.5) * uResolution);
  float jitter = fract(52.9829189 * fract(dot(pixelIndex, vec2(0.06711056, 0.00583715))));
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
      float h = mix(0.19, 0.040, smoothstep(0.30, 1.55, u));
      if (step == 0) h *= 0.5 + jitter * 0.5;
      float midU = u + 0.5 * h * du;
      float midDu = du + 0.5 * h * u * (3.0 * MASS * u - 1.0);
      float nextU = u + h * midDu;
      if (angle + h >= plane) {
        float endAngle = angle + h;
        if (nextU <= 0.0) endAngle = mix(angle, endAngle, (u - 0.0001) / (u - nextU));
        if (endAngle >= plane) {
          vec3 prevP = (radial * cos(angle) + tangent * sin(angle)) / u;
          vec3 p = (radial * cos(endAngle) + tangent * sin(endAngle)) / max(nextU, 0.0001);
          float prevHeight = dot(prevP, normal);
          float height = dot(p, normal);
          float span = abs(prevHeight) + abs(height);
          if (prevHeight * height <= 0.0 && span > 0.000001) {
            vec3 hitPos = mix(prevP, p, abs(prevHeight) / span);
            vec4 sampleColor = disk(hitPos, normal, normalize(uCameraPos - hitPos));
            sampleColor.a *= uDiskEmission;
            light += transmission * sampleColor.rgb * sampleColor.a;
            transmission *= 1.0 - sampleColor.a;
          }
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

  float ringWidth = sqrt(0.004 * 0.004 + 0.28 * pixel * pixel);
  float edge = (impact - 1.004) / ringWidth;
  float ring = exp(-edge * edge) * smoothstep(1.0 - pixel, 1.0 + pixel, impact);
  vec3 ringRadial = transverse - normal * dot(transverse, normal);
  vec3 velDir = normalize(cross(normal, ringRadial) + vec3(0.00001, 0, 0));
  float beaming = pow(1.0 + 0.55 * dot(velDir, -ray), 2.5);
  float ringErosion = smoothstep(0.73, 1.0, uDissolve);
  light += transmission * WHITE_GOLD * ring * beaming * (1.6 + 0.45 * uRingPulse) * (1.0 - ringErosion);
  float sky = captured ? 0.0 : stars(skyRay) * transmission;
  if (ringErosion > 0.0) sky = mix(sky, stars(ray), ringErosion);
  light += vec3(0.78, 0.78, 0.83) * sky;

  float shadow = 1.0 - smoothstep(1.0 - pixel * 1.5, 1.0, impact);
  float visibility = 1.0 - shadow * transmission * (1.0 - ringErosion);
  gl_FragColor = vec4(VOID + light, visibility);
}
