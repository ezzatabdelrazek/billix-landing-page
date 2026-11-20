/*
 * Pre-renders every raster image in public/ as WebP width variants in public/_img/,
 * so next/image never needs Vercel's paid image optimizer (see src/lib/image-loader.ts).
 *
 * Quality first: Lanczos down from the original, never upscaled, WebP at the quality in
 * image-variants.json (well above Next's default 75) with sharp YUV so fine edges and colour
 * detail survive. PNGs and images with transparency are encoded near-lossless.
 *
 * Runs before every build and dev start. Rendered files live in .next/cache/image-variants
 * (Vercel keeps that folder between builds), so only new or changed images are rendered;
 * public/_img is rebuilt from that cache each time and is not committed.
 * Run by hand: node scripts/image-variants.mjs   (add --force to render everything again)
 */
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const spec = JSON.parse(fs.readFileSync(path.join(ROOT, "image-variants.json"), "utf8"));
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "_img");
const CACHE = path.join(ROOT, ".next", "cache", "image-variants");
const MANIFEST = path.join(CACHE, "manifest.json");
const FORCE = process.argv.includes("--force");
const EXT = /\.(jpe?g|png|webp|avif)$/i;
const SKIP_DIRS = new Set(["_img", ...(spec.skipDirs ?? [])]);
// The render settings are part of each file's key, so changing them renders everything again.
const SETTINGS = JSON.stringify([spec.widths, spec.quality, 5]);

function walk(dir, rel = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (!rel && SKIP_DIRS.has(e.name)) continue;
      out.push(...walk(path.join(dir, e.name), r));
    } else if (EXT.test(e.name)) out.push(r);
  }
  return out;
}

const variant = (dir, rel, w) => path.join(dir, `${rel.replace(EXT, "")}-${w}.webp`);

async function main() {
  const manifest = !FORCE && fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
  const files = walk(PUBLIC);
  const todo = [];
  const next = {};
  for (const rel of files) {
    const h = createHash("sha1").update(SETTINGS).update(fs.readFileSync(path.join(PUBLIC, rel))).digest("hex");
    next[rel] = h;
    const complete = spec.widths.every((w) => fs.existsSync(variant(CACHE, rel, w)));
    if (manifest[rel] !== h || !complete) todo.push(rel);
  }
  if (todo.length) {
    const sharp = loadSharp();
    sharp.concurrency(1);
    let i = 0;
    const worker = async () => {
      while (i < todo.length) await render(sharp, todo[i++]);
    };
    await Promise.all(Array.from({ length: Math.max(1, os.cpus().length) }, worker));
  }
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(next, null, 1));

  // Rebuild public/_img from the cache (hard links where possible, copies otherwise).
  fs.rmSync(OUT, { recursive: true, force: true });
  for (const rel of files) {
    for (const w of spec.widths) {
      const from = variant(CACHE, rel, w);
      const to = variant(OUT, rel, w);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      try {
        fs.linkSync(from, to);
      } catch {
        fs.copyFileSync(from, to);
      }
    }
  }
  console.log(`image-variants: ${files.length} images, ${todo.length} rendered, ${files.length * spec.widths.length} files in public/_img`);
}

// sharp ships with Next as an optional dependency; resolve it through Next so no extra package is needed.
function loadSharp() {
  const here = createRequire(import.meta.url);
  try {
    return createRequire(here.resolve("next/package.json"))("sharp");
  } catch {
    return here("sharp");
  }
}

async function render(sharp, rel) {
  const src = path.join(PUBLIC, rel);
  const meta = await sharp(src, { failOn: "none" }).metadata();
  // PNGs (UI, logos, cut-outs) and anything with transparency stay near-lossless, so edges and text never blur.
  const nearLossless = Boolean(meta.hasAlpha) || /\.png$/i.test(rel);
  // EXIF orientation is applied below, so use the displayed width.
  const srcW = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
  let full = null;
  for (const w of [...spec.widths].sort((a, b) => a - b)) {
    const out = variant(CACHE, rel, w);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    if (full) {
      fs.copyFileSync(full, out); // never upscale: steps wider than the original reuse the full-size file
      continue;
    }
    // At full size nothing is gained by resizing, so the original is not compressed a second time:
    // up to 1 MP it stays pixel-exact (lossless WebP), up to 2.5 MP near-lossless (grain and fine texture kept).
    const px = srcW * ((meta.orientation ?? 1) >= 5 ? meta.width : meta.height);
    const exact = w >= srcW && px <= 1_000_000;
    const fine = w >= srcW && px <= 2_500_000;
    await sharp(src, { failOn: "none" })
      .rotate()
      .resize({ width: Math.min(w, srcW), kernel: "lanczos3" })
      .webp(
        exact
          ? { lossless: true, effort: 4 }
          : nearLossless || fine
            ? { nearLossless: true, quality: nearLossless ? 90 : 60, alphaQuality: 100, effort: 4 }
            : { quality: spec.quality, alphaQuality: 100, smartSubsample: true, effort: 4 },
      )
      .toFile(out);
    if (w >= srcW) full = out;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
