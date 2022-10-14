import axios from "axios";

export async function getLcshLabel(url) {
  const response = await axios.get(url);
  const graph = response.data;
  const term = graph.find((i) => i["@id"] == url);
  return term["http://www.w3.org/2004/02/skos/core#prefLabel"][0]["@value"];
}
