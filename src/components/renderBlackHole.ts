const width = 50;
const height = 20;
const shades = " .,:;irsXA253hMHGS#9B&@";

export function renderBlackHole(time: number) {
  const lines: string[] = [];

  for (let row = 0; row < height; row++) {
    let line = "";
    for (let column = 0; column < width; column++) {
      const x = (column - (width - 1) / 2) / 11;
      // Monospace characters are roughly twice as tall as they are wide.
      const y = (row - (height - 1) / 2) / 5.5;
      const radius = Math.hypot(x, y);
      const angle = Math.atan2(y, x);
      const disk = Math.hypot(x, (y - 0.08) * 5.5);
      const stream = 0.65 + 0.35 * Math.sin(disk * 13 - time * 2.4 + angle * 3);
      const ring = Math.exp(-(((radius - 0.64) / 0.065) ** 2));
      const halo = Math.exp(-(((radius - 0.72) / 0.22) ** 2)) * 0.16;
      const accretion = Math.exp(-(((disk - 1.15) / 0.6) ** 2)) * stream;
      const lens = 0.65 + 0.35 * Math.sin(angle * 5 + time * 0.7);
      let light = ring * lens + halo + accretion;

      // The event horizon stays empty while the surrounding matter moves.
      if (radius < 0.57) light = 0;
      const shade = Math.min(shades.length - 1, Math.floor(light * (shades.length - 1)));
      line += shades[shade];
    }
    lines.push(line);
  }

  return lines.join("\n");
}
