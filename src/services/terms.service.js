import axios from "axios";

const QLIT_BASE =
  import.meta.env.VITE_QLIT_BASE || "https://queerlit.dh.gu.se/qlit/v1/api/";

/** Get a single term. */
async function qlitGet(endpoint, params) {
  const response = await axios.get(QLIT_BASE + endpoint, { params });
  return response.data;
}

/** Get multiple terms and sort alphabetically. */
async function qlitList(endpoint, params) {
  const data = await qlitGet(endpoint, params);
  const terms = data.map(fakeXlTerm);
  return terms;
}

export async function getTerm(name) {
  const data = await qlitGet("term/" + name);
  return fakeXlTerm(data);
}

export async function getParents(child) {
  return qlitList("parents", { child });
}

export async function getChildren(parent) {
  return qlitList("children", { parent });
}

export async function getRelated(other) {
  return qlitList("related", { other });
}

export async function getRoots() {
  return qlitList("roots");
}

// TODO: Re-use Libris Concept search instead.
export async function searchTerms(s) {
  return qlitList("autocomplete", { s });
}

export function getCollections() {
  return qlitList("collections").then((terms) =>
    terms.map((term) => ({
      ...term,
      _label: term._label.replace("Tema: ", "").replace(" (HBTQI)", ""),
    }))
  );
}

export async function getLabels() {
  return await qlitGet("labels");
}

/** Reshape a queerlit-terms object like an XL object */
function fakeXlTerm(term) {
  return {
    "@id": term.uri,
    _label: term.prefLabel,
    inScheme: { "@id": "https://queerlit.dh.gu.se/qlit/v1" },
    ...term,
  };
}
