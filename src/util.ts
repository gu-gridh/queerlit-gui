import type { MaybeArray } from "./types/util";

export function compareEmptyLast(a: any, b: any): number {
  return !a ? 1 : !b ? -1 : String(a).localeCompare(b, "sv");
}

export const urlBasename = (url: string) =>
  decodeURIComponent(url.split("/").pop()!);

export const enarray = <T>(x: MaybeArray<T>) => (Array.isArray(x) ? x : [x]);
export const unarray = <T>(x: MaybeArray<T>) => (Array.isArray(x) ? x[0] : x);

export function ellipsis(text: string, limit: number) {
  if (!text || text.length < limit) return text;
  // 1. Truncate; 2. Strip possibly incomplete trailing word; 3. Add ellipsis
  return text
    .substring(0, 200)
    .replace(/\p{L}+$/u, "")
    .replace(/\P{L}$/u, "…");
}
