// ใส่ ?v=<hash> ให้ CSS/JS ใน assets/ ที่ถูกอ้างใน *.html ระดับ root
// hash มาจากเนื้อหาไฟล์ — เปลี่ยนเฉพาะไฟล์ที่ถูกแก้ ไฟล์อื่นยังใช้แคชเดิมได้
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pattern = /(href|src)="(assets\/[^"?#]+\.(?:css|js))(?:\?v=[^"]*)?"/g;
const hashes = new Map();

function hashOf(path) {
  if (!hashes.has(path)) {
    const buf = readFileSync(join(root, path));
    hashes.set(path, createHash("md5").update(buf).digest("hex").slice(0, 8));
  }
  return hashes.get(path);
}

for (const file of readdirSync(root).filter((f) => f.endsWith(".html"))) {
  const src = readFileSync(join(root, file), "utf8");
  const out = src.replace(pattern, (match, attr, path) => {
    if (!existsSync(join(root, path))) {
      console.warn(`! ${file}: ไม่พบ ${path} — ข้าม`);
      return match;
    }
    return `${attr}="${path}?v=${hashOf(path)}"`;
  });
  if (out !== src) {
    writeFileSync(join(root, file), out);
    console.log(`✓ ${file}`);
  }
}

for (const [path, hash] of hashes) console.log(`  ${path}?v=${hash}`);
