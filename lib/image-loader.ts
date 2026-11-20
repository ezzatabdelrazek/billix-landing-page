import spec from "../image-variants.json";

type LoaderArgs = { src: string; width: number; quality?: number };

/*
 * Images in /public are pre-rendered as WebP width variants in /public/_img by
 * scripts/image-variants.mjs (runs before every build), so Vercel's image optimizer is never used.
 * The widths match deviceSizes + imageSizes in next.config, so every srcset step has its own file.
 */
const WIDTHS = [...spec.widths].sort((a, b) => a - b);
const RASTER = /\.(jpe?g|png|webp|avif)$/i;

export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("https://images.unsplash.com/")) {
    // Unsplash resizes on its own CDN; quality is held at or above the pre-rendered files.
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(Math.max(quality ?? 0, spec.quality)));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }
  const [path] = src.split(/[?#]/);
  if (path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/_img/") && RASTER.test(path)) {
    const step = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1];
    return `/_img${path.replace(RASTER, "")}-${step}.webp?v=${spec.version}`;
  }
  // Anything else (SVG, GIF, other hosts) is served as it is.
  return src;
}
