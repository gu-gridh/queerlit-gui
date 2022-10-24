import { compareEmptyLast } from "@/util";
import axios from "axios";

export async function search(
  text,
  terms = [],
  title,
  author,
  yearStart,
  yearEnd,
  genreform,
  sort,
  offset = 0
) {
  // "q" is the free text parameter
  const q = text || "*";
  const params = new URLSearchParams();
  params.set("q", q);

  (terms || []).forEach((term) =>
    params.append("matches-instanceOf.subject.@id", term["@id"])
  );

  if (author) {
    params.set("instanceOf.contribution.agent.@id", author["@id"]);
  }

  if (title) {
    params.set("hasTitle.mainTitle", title);
  }

  if (genreform) {
    params.set("instanceOf.genreForm.@id", genreform.id);
  }

  if (yearStart) {
    params.set("min-publication.year", yearStart);
  }

  if (yearEnd) {
    params.set("max-publication.year", yearEnd);
  }

  params.set("@reverse.itemOf.heldBy.@id", "https://libris.kb.se/library/QLIT");
  if (sort) {
    params.set("_sort", sort);
  }
  params.set("_offset", offset);
  params.set("_limit", 20);

  console.log("params", [...params.entries()]);

  const response = await xlFindBooks(params);

  return {
    total: response.totalItems,
    items: response.items,
  };
}

export async function get(id) {
  const fullId = `https://libris.kb.se/${id}#it`;
  const result = await xlFindBooks({ "@id": fullId });
  if (result.items.length != 1) {
    console.error("get(id) result length should be 1", result);
    throw RangeError("get(id) result length should be 1");
  }
  return result.items[0];
}

export async function xlFindBooks(params) {
  return xlFind(params).then(({ items, totalItems }) => ({
    items: items.map(processXlItem),
    totalItems,
  }));
}

/**
 * Query the /find API
 *
 * @see https://github.com/libris/librisxl/blob/develop/rest/API.md */
export async function xlFind(params) {
  return axios
    .get("https://libris.kb.se/find", { params })
    .then((response) => response.data);
}

function processXlItem(item) {
  const processed = { _item: item };

  if (item.meta.controlNumber)
    processed.librisUrl = `https://libris.kb.se/bib/${item.meta.controlNumber}`;

  // Find terms
  processed.terms = item.instanceOf?.subject || [];

  // Normalize some values.
  const hasTitle =
    item.hasTitle && item.hasTitle.find((hasTitle) => hasTitle.mainTitle);
  if (hasTitle) {
    processed.title = hasTitle.mainTitle;
  }
  processed.creators = item.instanceOf?.contribution
    ?.map((c) =>
      ["givenName", "familyName", "name", "label"]
        .map((p) => c.agent?.[p]?.trim())
        .filter(Boolean)
        .join(" ")
    )
    .filter(Boolean);
  const publication = item.publication?.find((publication) => publication.year);
  processed.date = publication?.year;
  processed.id = item["@id"].split("/").pop().split("#").shift();
  // The summary can be in the Instance or the Text record, and it can be one or multiple values.
  processed.summary = (item.summary || item.instanceOf?.summary)?.[0].label;
  if (Array.isArray(processed.summary)) {
    processed.summary = processed.summary[0];
  }

  processed.libraries = item["@reverse"]?.itemOf?.map((l) => l.heldBy["@id"]);

  processed.extent = item.extent?.map((e) => e.label).join(", ");
  processed.note = item.hasNote?.map((n) => n.label).join(", ");
  processed.identifiedBy = item.identifiedBy?.map(
    (i) =>
      (i["@type"] ? `${i["@type"]}: ` : "") +
      i.value +
      (i.qualifier ? ` (${i.qualifier.join(", ")})` : "")
  );

  return processed;
}

export async function searchPerson(nameQuery) {
  // Add wildcard at end of each word
  const q = nameQuery.replaceAll(/\S+/g, "$&*");
  const params = { "@type": "Person", q, _limit: 10 };
  console.log("params person", params);
  const data = await xlFind(params);
  console.log("searchPerson", data.items);
  return data.items.filter((author) => author.givenName || author.familyName);
}

export async function searchConcept(conceptQuery, schemeIds = []) {
  const q = conceptQuery + "*";
  const params = new URLSearchParams({
    "@type": "Concept",
    q,
    _limit: 10,
  });
  // Filter by any of the given schemes
  if (schemeIds.length) {
    schemeIds.forEach((schemeId) => params.append("inScheme.@id", schemeId));
  }
  const data = await xlFind(params);
  return data.items;
}

export async function searchConceptSao(conceptQuery) {
  return await searchConcept(conceptQuery, [ConceptScheme.Sao]);
}

export async function searchConceptBarn(conceptQuery) {
  return await searchConcept(conceptQuery, [ConceptScheme.Barn]);
}

export async function searchConceptQlit(conceptQuery) {
  return await searchConcept(conceptQuery, [ConceptScheme.Qlit]);
}

export async function searchGenreform(query) {
  // Add an asterisk after each word (`\S+` is any word, `$&` is that matched word)
  const q = query.replaceAll(/\S+/g, "$&*");
  const params = new URLSearchParams({
    "@type": "GenreForm",
    prefLabel: q,
    _limit: 10,
  });
  params.append("inScheme.@id", ConceptScheme.BarnGf);
  params.append("inScheme.@id", ConceptScheme.SaoGF);
  console.log("params genreform", params);
  const data = await xlFind(params);
  console.log("searchGenreform", data.items);
  return data.items.map((item) => ({
    id: item["@id"],
    label: item.prefLabel,
    scheme: item.inScheme.code,
    _item: item,
  }));
}

/** Constants for uris. */
export class ConceptScheme {
  static get Qlit() {
    return "https://queerlit.dh.gu.se/qlit/v1";
  }
  static get Sao() {
    return "https://id.kb.se/term/sao";
  }
  static get Barn() {
    return "https://id.kb.se/term/barn";
  }
  static get SaoGf() {
    return "https://id.kb.se/term/saogf";
  }
  static get BarnGf() {
    return "https://id.kb.se/term/barngf";
  }
}
