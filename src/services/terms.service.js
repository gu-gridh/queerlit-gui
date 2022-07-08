import axios from "axios";

const QLIT_BASE =
  import.meta.env.VITE_QLIT_BASE || "https://queerlit.dh.gu.se/qlit/v1/api/";

async function qlitGet(endpoint, params) {
  const response = await axios.get(QLIT_BASE + endpoint, { params });
  return response.data;
}

async function qlitList(endpoint, params) {
  const data = await qlitGet(endpoint, params);
  return data.sort((a, b) => a.prefLabel.localeCompare(b.prefLabel, "sv"));
}

export async function getTerm(name) {
  return qlitGet("term/" + name);
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