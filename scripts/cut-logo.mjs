import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/cut-logo.mjs <source.jpg>");
  process.exit(1);
}

const pngOut = "public/images/logo.png";
const jpgOut = "public/images/logo.jpg";

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width, height } = info;
const visited = new Uint8Array(width * height);
const queue = [];

function idx(x, y) {
  return (y * width + x) * 4;
}

function bgScore(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  if (max - min > 34) return -1;
  return min;
}

function enqueue(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  const i = idx(x, y);
  if (bgScore(data[i], data[i + 1], data[i + 2]) < 218) return;
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
  const x = queue[n];
  const y = queue[n + 1];
  enqueue(x + 1, y);
  enqueue(x - 1, y);
  enqueue(x, y + 1);
  enqueue(x, y - 1);
}

let cleared = 0;
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const p = y * width + x;
    if (!visited[p]) continue;
    const i = idx(x, y);
    const score = bgScore(data[i], data[i + 1], data[i + 2]);
    let alpha = 255;
    if (score >= 247) alpha = 0;
    else if (score >= 218) alpha = Math.round(((247 - score) / 29) * 255);
    data[i + 3] = Math.min(data[i + 3], alpha);
    if (alpha < 16) cleared += 1;
  }
}

let png = sharp(data, { raw: { width, height, channels: 4 } });
try {
  png = png.trim({ threshold: 10 });
} catch {
  /* keep full frame */
}

await png
  .resize({ width: 1600, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(pngOut);

const cut = sharp(pngOut);
const meta = await cut.metadata();
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
console.log(`cleared ${cleared} px`);
console.log(`png ${outMeta.width}x${outMeta.height}`);
console.log(`wrote ${pngOut} and ${jpgOut}`);
