import sharp from "sharp";
import path from "node:path";

const src = path.resolve("public/images/logo.jpg");
const out = path.resolve("public/images/logo.png");
const preview = path.resolve("public/images/logo-on-dark.png");

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const iat = (x, y) => (y * width + x) * channels;

function rgb(x, y) {
  const x2 = Math.max(0, Math.min(width - 1, x));
  const y2 = Math.max(0, Math.min(height - 1, y));
  const i = iat(x2, y2);
  return [data[i], data[i + 1], data[i + 2]];
}

function satLum([r, g, b]) {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1) || 1);
  return { s, l, chroma: d };
}

function contrast(x, y) {
  let min = 1;
  let max = 0;
  for (let oy = -2; oy <= 2; oy++) {
    for (let ox = -2; ox <= 2; ox++) {
      const { l } = satLum(rgb(x + ox, y + oy));
      if (l < min) min = l;
      if (l > max) max = l;
    }
  }
  return max - min;
}

const core = new Uint8Array(width * height);
let minX = width;
let minY = height;
let maxX = 0;
let maxY = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const { s, chroma, l } = satLum(rgb(x, y));
    const colorHit = s > 0.17 || chroma > 0.13;
    const darkMetal = l < 0.38 && contrast(x, y) > 0.08;
    if (!colorHit && !darkMetal) continue;
    core[y * width + x] = 1;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
}

const keep = new Uint8Array(width * height);
const dilate = 7;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (!core[y * width + x]) continue;
    for (let oy = -dilate; oy <= dilate; oy++) {
      for (let ox = -dilate; ox <= dilate; ox++) {
        if (ox * ox + oy * oy > dilate * dilate) continue;
        const nx = x + ox;
        const ny = y + oy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        keep[ny * width + nx] = 1;
      }
    }
  }
}

// Recover silver subtitle under the purple word: high local contrast, low chroma, in a band
const bandTop = maxY;
const bandBottom = Math.min(height - 1, maxY + Math.round((maxY - minY) * 0.55));
const bandLeft = Math.max(0, minX - 20);
const bandRight = Math.min(width - 1, maxX + 20);
for (let y = bandTop; y <= bandBottom; y++) {
  for (let x = bandLeft; x <= bandRight; x++) {
    const { s, l } = satLum(rgb(x, y));
    const c = contrast(x, y);
    if (s < 0.16 && l > 0.28 && l < 0.9 && c > 0.07) keep[y * width + x] = 1;
  }
}

// Second small dilate for anti-alias
const keep2 = keep.slice();
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    if (keep[y * width + x]) continue;
    let n = 0;
    for (let oy = -2; oy <= 2; oy++) {
      for (let ox = -2; ox <= 2; ox++) {
        n += keep[(y + oy) * width + (x + ox)];
      }
    }
    if (n >= 8) keep2[y * width + x] = 1;
  }
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = y * width + x;
    if (!keep2[p]) continue;
    const { s, l } = satLum(rgb(x, y));
    const c = contrast(x, y);
    const leftoverDark = l < 0.22 && s < 0.1;
    const leftoverMarble = l > 0.72 && s < 0.1 && c < 0.05;
    if (leftoverDark || leftoverMarble) keep2[p] = 0;
  }
}

const outBuf = Buffer.from(data);
let opaque = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = y * width + x;
    const i = p * 4;
    if (keep2[p]) {
      opaque += 1;
      continue;
    }
    let edge = 0;
    for (let oy = -2; oy <= 2; oy++) {
      for (let ox = -2; ox <= 2; ox++) {
        const nx = x + ox;
        const ny = y + oy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        if (keep2[ny * width + nx]) edge += 1;
      }
    }
    const alpha = Math.min(255, Math.round((edge / 8) * 220));
    if (alpha < 10) {
      outBuf[i] = 0;
      outBuf[i + 1] = 0;
      outBuf[i + 2] = 0;
      outBuf[i + 3] = 0;
    } else {
      outBuf[i + 3] = alpha;
    }
  }
}

await sharp(outBuf, { raw: { width, height, channels: 4 } })
  .trim({ threshold: 6 })
  .png({ compressionLevel: 9 })
  .toFile(out);

const meta = await sharp(out).metadata();
await sharp(out)
  .flatten({ background: { r: 14, g: 6, b: 20 } })
  .png()
  .toFile(preview);

console.log({ opaque, pct: +(opaque / (width * height) * 100).toFixed(1), trim: [meta.width, meta.height] });
