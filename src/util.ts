import type { MaybeArray } from "./types/util";
import realSlugify from "slugify";

export function compareEmptyLast(a: any, b: any): number {
  return !a ? 1 : !b ? -1 : String(a).localeCompare(b, "sv");
}

export const urlBasename = (url: string) =>
  decodeURIComponent(url.split("/").pop()!);

export const enarray = <T>(x: MaybeArray<T>) => (Array.isArray(x) ? x : [x]);
export const unarray = <T>(x: MaybeArray<T>) => (Array.isArray(x) ? x[0] : x);

export function ellipsis(text: string, limit = 200, suffix = "…") {
  if (!text || text.length < limit) return text;
  // 1. Truncate; 2. Strip possibly incomplete trailing word; 3. Add ellipsis
  return text
    .substring(0, limit)
    .replace(/\p{L}+$/u, "")
    .replace(/\P{L}$/u, suffix);
}

// Slugify docs: https://github.com/simov/slugify
realSlugify.extend({
  "&": "och",
});
export function slugify(label: string): string {
  const shortLabel = ellipsis(label, 60, "");
  return realSlugify(shortLabel, { lower: true, strict: true });
}

/** Expand an app path to a full url */
export function pathUrl(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return window.location.origin + base + path;
}
