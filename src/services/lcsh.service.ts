import axios from "axios";

export async function getLcshLabel(url: string): Promise<string | undefined> {
  // LCSH gives some 3xx responses: http:X -> https:X -> https:X.json
  // Skip these for performance.
  const jsonUrl = url.replace(/http:(.*)/, "https:$1.json");
  const response = await axios.get(jsonUrl);
  const graph: LcshTerm[] = response.data;
  const term = graph.find((i) => i["@id"] == url);
  return term?.["http://www.w3.org/2004/02/skos/core#prefLabel"]?.[0]["@value"];
}

type LcshTerm = Record<string, any> & {
  "@id": string;
  "http://www.w3.org/2004/02/skos/core#prefLabel": {
    "@value": string;
  }[];
};
