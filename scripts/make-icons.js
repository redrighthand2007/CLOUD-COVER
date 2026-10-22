// Generates the PNG app icons (frontend/icons/icon-192.png, icon-512.png)
// to match icons/icon.svg, with no extra packages. Run: node scripts/make-icons.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BG = [0x1f, 0x4e, 0x79];
const FG = [0xff, 0xff, 0xff];
// Same shapes as icon.svg, on a 512 grid
const circles = [[200, 270, 78], [300, 235, 98], [370, 300, 58], [150, 315, 48]];
const rect = [150, 300, 370, 363];

function inCloud(x, y) {
    if (x >= rect[0] && x <= rect[2] && y >= rect[1] && y <= rect[3]) return true;
    return circles.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r);
}

function crc32(buf) {
    let c, crc = 0xffffffff;
    for (let n = 0; n < buf.length; n++) {
        c = (crc ^ buf[n]) & 0xff;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        crc = (crc >>> 8) ^ c;
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
}

function png(size) {
    const SS = 4; // supersampling for smooth edges
    const raw = Buffer.alloc((size * 3 + 1) * size);
    for (let y = 0; y < size; y++) {
        raw[y * (size * 3 + 1)] = 0;
        for (let x = 0; x < size; x++) {
            let hits = 0;
            for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
                if (inCloud(((x + (sx + 0.5) / SS) * 512) / size, ((y + (sy + 0.5) / SS) * 512) / size)) hits++;
            }
            const t = hits / (SS * SS);
            const o = y * (size * 3 + 1) + 1 + x * 3;
            for (let c = 0; c < 3; c++) raw[o + c] = Math.round(BG[c] + (FG[c] - BG[c]) * t);
        }
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
    ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk('IHDR', ihdr),
        chunk('IDAT', zlib.deflateSync(raw)),
        chunk('IEND', Buffer.alloc(0)),
    ]);
}

const outDir = path.join(__dirname, '../frontend/icons');
for (const size of [192, 512]) {
    fs.writeFileSync(path.join(outDir, `icon-${size}.png`), png(size));
    console.log(`wrote icon-${size}.png`);
}
