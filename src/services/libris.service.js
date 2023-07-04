import { enarray, unarray, urlBasename } from "@/util";
import axios from "axios";
import { getLabels } from "./terms.service";

// Labels are sometimes missing in the Libris response, so keep a local copy of all labels as fetched from the QLIT backend.
const qlitLabels = {
  // [name]: label
};
/** Load QLIT term labels and cache them locally. */
async function loadQlitLabels() {
  if (Object.keys(qlitLabels).length == 0) {
    Object.assign(qlitLabels, await getLabels());
  }
}
const qlitLabelsPromise = loadQlitLabels();

export async function search(options) {
  const defaults = {
    text: "",
    terms: [],
    termsSecondary: [],
    hierarchical: true,
    title: "",
    offset: 0,
    // the rest: undefined
  };

  const {
    text,
    terms,
    termsSecondary,
    hierarchical,
    title,
    author,
    yearStart,
    yearEnd,
    genreform,
    sort,
    offset,
  } = { ...defaults, ...options };

  // "q" is the free text parameter
  const q = text || "*";
  const params = new URLSearchParams();
  params.set("q", q);

  const subjectCondPrefix = hierarchical ? "and-matches-" : "and-";

  (terms || []).forEach((term) =>
    params.append(subjectCondPrefix + "instanceOf.subject.@id", term["@id"])
  );

  (termsSecondary || []).forEach((term) =>
    params.append(
      subjectCondPrefix + "@reverse.itemOf.subject.@id",
      term["@id"]
    )
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
    // Libris cannot handle a date value under 1000.
    // There are no such old titles in Libris anyway, so coercing to 1000 doesn't affect result.
    params.set("min-publication.year", Math.max(yearStart, 1000));
  }

  if (yearEnd) {
    params.set("max-publication.year", Math.max(yearEnd, 1000));
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
  instance.motivation = unarray(unarray(item.summary)?.label);
  instance.termsSecondary =
    item.subject?.map(processXlTerm).filter((term) => term._label) || [];
  return instance;
}

export async function xlFindBooks(params) {
  // The QLIT labels will be needed in processXlItem, so await them while sending the Libris request.
  const [findResponse] = await Promise.all([xlFind(params), qlitLabelsPromise]);

  const { items, totalItems, stats } = findResponse;
  const processedItems = items.map(processXlItem);
  return { items: processedItems, totalItems, stats };
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

  // Get the Queerlit item post
  const queerlitItem = item["@reverse"]?.itemOf?.find(
    (l) => l.heldBy["@id"] == "https://libris.kb.se/library/QLIT"
  );
  processed.motivation = unarray(unarray(queerlitItem.summary)?.label);

  // For the subject terms nested here, Libris only gives the @id.
  // The QLIT terms are important enough that we will load labels from the QLIT backend.
  // However, other terms are filtered away here because we cannot show a suitable label.
  // TODO If any labels are filtered away here, we could indicate that with something like "More...".
  processed.termsSecondary = queerlitItem.subject?.map(processXlTerm) || [];

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
  const guess = term["@id"] ? termDataFromId(term["@id"]) : {};
  const processed = { ...guess, ...term };
  processed._label = getLabel(processed);
  return processed;
}

/** Guess scheme and label from the id uri. */
function termDataFromId(id) {
  const data = {};

  const scheme = [
    ConceptScheme.Qlit,
    ConceptScheme.BarnGf,
    ConceptScheme.Barn,
    ConceptScheme.SaoGf,
    ConceptScheme.Sao,
  ].find((scheme) => id.indexOf(scheme) === 0);
  if (scheme) data.inScheme = scheme;

  if (scheme == ConceptScheme.Qlit) {
    data.prefLabel = qlitLabels[urlBasename(id)];
  } else if (scheme) {
    data.prefLabel = decodeURIComponent(urlBasename(id));
  }

  return data;
}

/** Build a string of the label of an object. */
export function getLabel(object) {
  if (!object) return undefined;
  if (object["@type"] == "ComplexSubject")
    return object.termComponentList.map(getLabel).filter(Boolean).join(" – ");
  if (["Person", "Organization"].includes(object["@type"]))
    return getPersonName(object);
  if (object.prefLabelByLang) return object.prefLabelByLang.sv;
  if (object.prefLabel) return object.prefLabel;
  if (object.name) return object.name;
  // E.g. Légion étrangère https://libris.kb.se/hftx3pt10h7p7c3#it
  if (object["marc:subordinateUnit"])
    return enarray(object["marc:subordinateUnit"]).join(" ");
  console.warn("No label found", object);
}

function getHistogram(stats) {
  if (!stats) return {};
  /** @type {Array} */
  const obs = stats?.sliceByDimension?.["publication.year"]?.observation;
  if (!obs) {
    return {};
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
  return ["givenName", "familyName", "name", "label", "marc:numeration"]
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
