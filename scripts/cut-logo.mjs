import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/cut-logo.mjs <source.jpg>");
  process.exit(1);
}

const pngOut = "public/images/logo.png";
const jpgOut = "public/images/logo.jpg";
const webpOut = "public/images/logo.webp";

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width, height } = info;

function idx(x, y) {
  return (y * width + x) * 4;
}

function sample(x, y) {
  const i = idx(x, y);
  return [data[i], data[i + 1], data[i + 2]];
}

const corners = [
  sample(0, 0),
  sample(width - 1, 0),
  sample(0, height - 1),
  sample(width - 1, height - 1),
];
const cornerLuma =
  corners.reduce((sum, [r, g, b]) => sum + Math.max(r, g, b), 0) / corners.length;
const darkBg = cornerLuma < 80;

function chroma(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function bgAmount(r, g, b) {
  if (chroma(r, g, b) > 32) return -1;
  if (darkBg) {
    const mx = Math.max(r, g, b);
    return mx <= 36 ? 36 - mx : -1;
  }
  const mn = Math.min(r, g, b);
  return mn >= 218 ? mn - 217 : -1;
}

const visited = new Uint8Array(width * height);
const queue = [];

function enqueue(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  const i = idx(x, y);
  if (bgAmount(data[i], data[i + 1], data[i + 2]) < 0) return;
  visited[p] = 1;
  queue.push(x, y);
}

for (let x = 0; x < width; x += 1) {
  enqueue(x, 0);
  enqueue(x, height - 1);
}
for (let y = 0; y < height; y += 1) {
  enqueue(0, y);
  enqueue(width - 1, y);
}

for (let n = 0; n < queue.length; n += 2) {
  enqueue(queue[n] + 1, queue[n + 1]);
  enqueue(queue[n] - 1, queue[n + 1]);
  enqueue(queue[n], queue[n + 1] + 1);
  enqueue(queue[n], queue[n + 1] - 1);
}

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    enqueue(x, y);
  }
}

let cleared = 0;
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const p = y * width + x;
    if (!visited[p]) continue;
    const i = idx(x, y);
    const amount = bgAmount(data[i], data[i + 1], data[i + 2]);
    if (amount < 0) continue;
    let alpha = 255;
    if (darkBg) {
      const mx = Math.max(data[i], data[i + 1], data[i + 2]);
      if (mx <= 8) alpha = 0;
      else if (mx <= 36) alpha = Math.round(((mx - 8) / 28) * 255);
    } else {
      const score = Math.min(data[i], data[i + 1], data[i + 2]);
      if (score >= 247) alpha = 0;
      else if (score >= 218) alpha = Math.round(((247 - score) / 29) * 255);
    }
    data[i + 3] = Math.min(data[i + 3], alpha);
    if (alpha < 16) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      cleared += 1;
    }
  }
}

let png = sharp(data, { raw: { width, height, channels: 4 } });
try {
  png = png.trim({ threshold: 12 });
} catch {
  /* keep full frame */
}

await png
  .resize({ width: 1600, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(pngOut);

await sharp(pngOut)
  .webp({ quality: 88, alphaQuality: 100, effort: 6 })
  .toFile(webpOut);

const meta = await sharp(pngOut).metadata();
const side = Math.max(meta.width || 1200, meta.height || 1200, 1200);
await sharp({
  create: {
    width: side,
    height: side,
    channels: 3,
    background: { r: 247, g: 241, b: 232 },
  },
})
  .composite([{ input: pngOut, gravity: "centre" }])
  .jpeg({ quality: 90 })
  .toFile(jpgOut);

const outMeta = await sharp(pngOut).metadata();
console.log(`mode ${darkBg ? "dark" : "light"}`);
console.log(`cleared ${cleared} px`);
console.log(`png ${outMeta.width}x${outMeta.height}`);
console.log(`wrote ${pngOut}, ${webpOut} and ${jpgOut}`);
