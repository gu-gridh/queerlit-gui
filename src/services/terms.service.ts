import axios from "axios";
import type {
  QlitCollection,
  QlitCollectionRaw,
  QlitName,
  QlitTerm,
  QlitTermRaw,
} from "./qlit.types";

const QLIT_BASE =
  import.meta.env.VITE_QLIT_BASE || "https://queerlit.dh.gu.se/qlit/v1/api/";

/** Get a single term. */
async function qlitGet<T = any>(
  endpoint: string,
  params?: Record<string, any>,
): Promise<T> {
  const response = await axios.get(QLIT_BASE + endpoint, { params });
  return response.data;
}

/** Get multiple terms and sort alphabetically. */
async function qlitList(endpoint: string, params?: Record<string, any>) {
  const data: QlitTermRaw[] = await qlitGet(endpoint, params);
  const terms = data.map(processTerm);
  return terms;
}

export async function getTerm(name: QlitName) {
  const data = await qlitGet<QlitTermRaw>("term/" + name);
  return processTerm(data);
}

export async function getParents(narrower: QlitName) {
  return qlitList("broader", { narrower });
}

export async function getChildren(broader: QlitName) {
  return qlitList("narrower", { broader });
}

export async function getRelated(other: QlitName) {
  return qlitList("related", { other });
}

export async function getRoots() {
  return qlitList("roots");
}

export async function searchTerms(s: string) {
  return qlitList("search", { s });
}

export async function getCollections(): Promise<QlitCollection[]> {
  const collections = await qlitGet<QlitCollectionRaw[]>("collections");
  return collections.map((collection) => ({
    ...collection,
    id: collection.uri,
    label: collection.prefLabel.replace("Tema: ", "").replace(" (HBTQI)", ""),
  }));
}

export function getCollection(name: QlitName) {
  return qlitList("collections/" + name);
}

export async function getLabels() {
  return await qlitGet<Readonly<Record<QlitName, string>>>("labels");
}

function processTerm(term: QlitTermRaw): QlitTerm {
  return {
    id: term.uri,
    label: term.prefLabel,
    scheme: "https://queerlit.dh.gu.se/qlit/v1",
    name: term.name,
    altLabels: term.altLabels,
    hiddenLabels: term.hiddenLabels,
    scopeNote: term.scopeNote,
    broader: term.broader,
    narrower: term.narrower,
    related: term.related,
    exactMatch: term.exactMatch,
    closeMatch: term.closeMatch,
  };
}
