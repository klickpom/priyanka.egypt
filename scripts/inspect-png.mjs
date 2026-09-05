import fs from "node:fs";

const path = process.argv[2];
const b = fs.readFileSync(path);
console.log("magic", [...b.subarray(0, 16)]);
console.log("ascii", b.subarray(0, 16).toString("latin1"));
console.log("size", b.length);

if (b.toString("latin1", 0, 8) === "\u0089PNG\r\n\u001a\n") {
  let offset = 8;
  while (offset + 8 < b.length && offset < 200) {
    const len = b.readUInt32BE(offset);
    const type = b.toString("latin1", offset + 4, offset + 8);
    console.log("chunk", type, "len", len, "at", offset);
    if (type === "IHDR") {
      console.log({
        w: b.readUInt32BE(offset + 8),
        h: b.readUInt32BE(offset + 12),
        bitDepth: b[offset + 16],
        colorType: b[offset + 17],
      });
    }
    offset += 12 + len;
  }
}
