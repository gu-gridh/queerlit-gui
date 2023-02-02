import { enarray, unarray, urlBasename } from "@/util";
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

  const response = await xlFindBooks(params);

  return {
    total: response.totalItems,
    items: response.items,
    histogram: getHistogram(response.stats),
  };
}

export async function get(id) {
  const fullId = `https://libris.kb.se/${id}#it`;
  const result = await xlFindBooks({ "@id": fullId });
  if (result.items.length != 1) {
    console.error("get(id) result length should be 1", result);
    throw RangeError("get(id) result length should be 1");
  }
  const instance = result.items[0];

  // Get the Item record (QLIT's "copy" of the book)
  const itemShort = instance._item["@reverse"].itemOf.find(
    (i) => i.heldBy["@id"] == "https://libris.kb.se/library/QLIT"
  );
  const item = await xlFind({ "@id": itemShort["@id"] }).then(
    (data) => data.items[0]
  );
  instance.motivation = unarray(item.summary)?.label;
  instance.termsSecondary =
    item.subject?.map(processXlTerm).filter((term) => term._label) || [];
  return instance;
}

export async function xlFindBooks(params) {
  return xlFind(params).then(({ items, totalItems, stats }) => ({
    items: items.map(processXlItem),
    totalItems,
    stats,
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
  processed.terms =
    item.instanceOf?.subject
      ?.map(processXlTerm)
      .filter((term) => term._label) || [];

  processed.genreform = (item.instanceOf?.genreForm || [])
    .map(processXlTerm)
    .filter((term) => term._label)
    .filter((term) => term.inScheme?.["@id"] !== "https://id.kb.se/marc");

  // Normalize some values.
  const hasTitle = item.hasTitle?.find((hasTitle) => hasTitle.mainTitle);
  if (hasTitle) {
    processed.title = hasTitle.mainTitle;
    const part = hasTitle.hasPart?.[0];
    if (part?.partName) {
      processed.title = part.partName;
      processed.title += part?.partNumber
        ? ` (${hasTitle.mainTitle} #${part.partNumber})`
        : ` (${hasTitle.mainTitle})`;
    }
  }
  processed.creators = item.instanceOf?.contribution
    ?.map((c) => ({
      name: getPersonName(unarray(c.agent)),
      lifeSpan: unarray(c.agent).lifeSpan,
      roles: c.role && enarray(c.role).map(getLabel),
    }))
    .filter((c) => c.name);
  const publication = item.publication?.find((publication) => publication.year);
  processed.date = publication?.year;
  processed.id = item["@id"].split("/").pop().split("#").shift();
  // The summary can be in the Instance or the Text record, and it can be one or multiple values.
  processed.summary = (item.summary || item.instanceOf?.summary)?.[0].label;
  processed.summary = unarray(processed.summary);
  processed.languages = item.instanceOf?.language.map(getLabel);
  processed.contentType = item.instanceOf?.contentType?.map(getLabel);
  processed.libraries = item["@reverse"]?.itemOf?.map((l) => l.heldBy["@id"]);

  processed.extent = item.extent?.map((e) => e.label).join(", ");
  processed.note = item.hasNote?.map((n) => n.label).join(", ");
  processed.identifiedBy = item.identifiedBy?.map(
    (i) =>
      (i["@type"] ? `${i["@type"]}: ` : "") +
      i.value +
      (i.qualifier ? ` (${unarray(i.qualifier)})` : "")
  );

  processed.classification = (item.instanceOf?.classification || [])
    .map((c) =>
      c["@type"] == "ClassificationDdc"
        ? { type: "DDC", code: c.code }
        : c.inScheme
        ? { type: c.inScheme.code?.replace("kssb", "SAB"), code: c.code }
        : null
    )
    .filter(Boolean);

  processed.publication = item.publication?.map((p) =>
    [
      getPersonName(p.agent),
      p.year,
      getLabel(unarray(p.country)),
      getPersonName(unarray(p.place)),
    ]
      .filter(Boolean)
      .join(", ")
  );

  processed.intendedAudience = item.instanceOf?.intendedAudience?.map(getLabel);

  return processed;
}

export async function searchPerson(nameQuery) {
  // Add wildcard at end of each word
  const q = nameQuery.replaceAll(/\S+/g, "$&*");
  const params = { "@type": "Person", q, _limit: 10 };
  const data = await xlFind(params);
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
  return data.items.map(processXlTerm).filter((term) => term._label);
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
  params.append("inScheme.@id", ConceptScheme.SaoGf);
  const data = await xlFind(params);
  return data.items.map((item) => ({
    id: item["@id"],
    label: item.prefLabel,
    scheme: item.inScheme.code,
    _item: item,
  }));
}

function processXlTerm(term) {
  const processed = { ...term };
  processed._label = getLabel(term);
  return processed;
}

/** Build a string of the label of an object. */
export function getLabel(object) {
  if (!object) return undefined;
  if (object["@type"] == "ComplexSubject")
    return object.termComponentList.map(getLabel).filter(Boolean).join("–");
  if (["Person", "Organization"].includes(object["@type"]))
    return getPersonName(object);
  if (object.prefLabelByLang) return object.prefLabelByLang.sv;
  if (object.prefLabel) return object.prefLabel;
  console.log("No label found", object);
}

function getHistogram(stats) {
  if (!stats) return {};
  /** @type {Array} */
  const obs = stats?.sliceByDimension?.["publication.year"]?.observation;
  if (!obs) {
    console.error("No publication year stats", { stats });
    return;
  }
  return obs.reduce((acc, ob) => {
    const year = urlBasename(ob?.object?.label);
    if (/^\d{4}$/.test(year)) {
      acc[year] = ob.totalItems;
    }
    return acc;
  }, {});
}

/** Build a string of a person's name. */
export function getPersonName(person) {
  // Sometimes the name is split in two, sometimes not.
  return ["givenName", "familyName", "name", "label"]
    .map((prop) => unarray(person?.[prop])?.trim())
    .filter(Boolean)
    .join(" ");
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
