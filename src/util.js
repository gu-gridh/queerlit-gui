export function compareEmptyLast(a, b) {
  return !a ? 1 : !b ? -1 : String(a).localeCompare(b, "sv");
}

export const urlBasename = (url) => decodeURIComponent(url.split("/").pop());

export const enarray = (x) => (Array.isArray(x) ? x : [x]);
export const unarray = (x) => (Array.isArray(x) ? x[0] : x);

export function ellipsis(text, limit) {
  if (!text || text.length < limit) return text;
  // 1. Truncate; 2. Strip possibly incomplete trailing word; 3. Add ellipsis
  return text
    .substring(0, 200)
    .replace(/\p{L}+$/u, "")
    .replace(/\P{L}$/u, "…");
}
