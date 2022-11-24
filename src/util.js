export function compareEmptyLast(a, b) {
  return !a ? 1 : !b ? -1 : String(a).localeCompare(b, "sv");
}

export const urlBasename = (url) => decodeURIComponent(url.split("/").pop());

export const enarray = (x) => (Array.isArray(x) ? x : [x]);
export const unarray = (x) => (Array.isArray(x) ? x[0] : x);
