import axios from "axios";
import type {
  QlitCollection,
  QlitName,
  QlitTerm,
  TermLike,
} from "./qlit.types";
import type { Term } from "@/types/work";

const QLIT_BASE =
  import.meta.env.VITE_QLIT_BASE || "https://queerlit.dh.gu.se/qlit/v1/api/";

/** Get a single term. */
async function qlitGet<T = any>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> {
  const response = await axios.get(QLIT_BASE + endpoint, { params });
  return response.data;
}

/** Get multiple terms and sort alphabetically. */
async function qlitList<T extends TermLike = QlitTerm>(
  endpoint: string,
  params?: Record<string, any>
) {
  const data: T[] = await qlitGet(endpoint, params);
  const terms = data.map(processTerm);
  return terms;
}

export async function getTerm(name: QlitName) {
  const data = await qlitGet<QlitTerm>("term/" + name);
  return processTerm(data);
}

export async function getParents(child: QlitName) {
  return qlitList("parents", { child });
}

export async function getChildren(parent: QlitName) {
  return qlitList("children", { parent });
}

export async function getRelated(other: QlitName) {
  return qlitList("related", { other });
}

export async function getRoots() {
  return qlitList("roots");
}

// TODO: Re-use Libris Concept search instead.
export async function searchTerms(s: string) {
  return qlitList("autocomplete", { s });
}

export function getCollections(): Promise<Term[]> {
  return qlitList<QlitCollection>("collections").then((collections) =>
    collections.map((collection) => ({
      ...collection,
      label: collection.label.replace("Tema: ", "").replace(" (HBTQI)", ""),
    }))
  );
}

export function getCollection(name: QlitName) {
  return qlitList("collections/" + name);
}

export async function getLabels() {
  return await qlitGet<Readonly<Record<QlitName, string>>>("labels");
}

function processTerm(term: TermLike): Term {
  return {
    id: term.uri,
    label: term.prefLabel,
    scheme: "https://queerlit.dh.gu.se/qlit/v1",
  };
}
