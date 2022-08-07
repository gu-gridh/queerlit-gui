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
  // Enrich with custom data.
  const localItem = BOOKS.find(
    (book) =>
      item["@id"] === `https://libris.kb.se/${book.id}#it` ||
      (item.sameAs &&
        item.sameAs.some(
          (sameAs) =>
            sameAs["@id"] === `http://libris.kb.se/resource/bib/${book.id}`
        ))
  );
  const processed = { terms: [], ...localItem, _item: item };
  if (processed.terms) {
    processed.terms = processed.terms.map((label) => ({
      "@id": "https://queerlit.dh.gu.se/qlit/v1/dummy-" + label,
      inScheme: { "@id": "https://queerlit.dh.gu.se/qlit/v1" },
      prefLabel: label,
    }));
  }

  if (item.meta.controlNumber)
    processed.librisUrl = `https://libris.kb.se/bib/${item.meta.controlNumber}`;

  // Find terms
  processed.terms.push(...(item.instanceOf?.subject || []));

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

  return processed;
}

export async function searchTitle(titleQuery) {
  const params = {
    "@type": "Instance",
    "@reverse.itemOf.heldBy.@id": "https://libris.kb.se/library/QLIT",
    "hasTitle.mainTitle": titleQuery + "*",
    _sort: "hasTitle.mainTitle",
  };
  console.log("searchTitle", params);
  const data = await xlFind(params);
  const titles = data.items.map((item) => item.hasTitle?.[0]?.mainTitle);
  return titles.filter((t, i) => titles.indexOf(t) == i);
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
  return await searchConcept(conceptQuery, [ConceptScheme.SAO]);
}

export async function searchConceptQlit(conceptQuery) {
  return await searchConcept(conceptQuery, [ConceptScheme.QLIT]);
}

export async function searchGenreform(query) {
  // Add an asterisk after each word (`\S+` is any word, `$&` is that matched word)
  const q = query.replaceAll(/\S+/g, "$&*");
  const params = new URLSearchParams({
    "@type": "GenreForm",
    prefLabel: q,
    _limit: 10,
  });
  params.append("inScheme.@id", ConceptScheme.BarnGF);
  params.append("inScheme.@id", ConceptScheme.SAOGF);
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

const librariesCache = [];
export async function getLibraries() {
  if (!librariesCache.length) {
    const data = await xlFind({ "@type": "Library", _limit: 2000 });
    data.items.sort((a, b) => compareEmptyLast(a.name, b.name));
    librariesCache.push(...data.items);
  }
  return librariesCache;
}

/** Constants for uris. */
export class ConceptScheme {
  static get QLIT() {
    return "https://queerlit.dh.gu.se/qlit/v1";
  }
  static get SAO() {
    return "https://id.kb.se/term/sao";
  }
  static get Barn() {
    return "https://id.kb.se/term/barn";
  }
  static get SAOGF() {
    return "https://id.kb.se/term/saogf";
  }
  static get BarnGF() {
    return "https://id.kb.se/term/barngf";
  }
}

const BOOKS = [
  {
    // title: "Clownen Jac",
    // id: "3ld06xjf1rf7f02",
    id: "904603",
    terms: ["Bögar", "Garderobsbögar"],
  },
  {
    // title: "Vålnaden",
    // id: "gzrg9t1s44fp615",
    id: "3106134",
    terms: [],
  },
  {
    // title: "Vox amoris",
    id: "p2v00txrmcz719z5",
    terms: ["Lesbiska"],
  },
  {
    // title: "Sovdags för Lydia",
    // id: "bvnvlj6n21145p0",
    id: "16439900",
    terms: ["Bilderbok", "Föräldrar (HBTQI)", "HBTQI-familjer"],
  },
  {
    // title: "Iggy 4-ever",
    // id: "m5z6nc1z33nz4js",
    id: "17047889",
    terms: ["Transmän", "Unga transpersoner"],
  },
  {
    // title: "Trånga jeans : [en homosexroman]",
    // id: "5ngc96lh4106n2n",
    id: "8227005",
    terms: [],
  },
  {
    // title: "Chain reaction",
    // id: "vd6j10p61xk6m91",
    id: "19597056",
    terms: [],
  },
  {
    // title: "Bodil eller hattasken : två pjäser i en",
    // id: "5ng3r18h3c562fh",
    id: "1311105",
    terms: [],
  },
  {
    // title: "En dåres försvarstal / översättning från det franska originalet av John Landquist",
    // id: "j1tjbgmv070r7ql",
    id: "3094916",
    terms: ["Lesbiska", "Bisexualitet"],
  },
  {
    // title: "Den svenske stortjufven Lasse-Majas äfventyr ifrån hans födelse till dess han blef frigifven från Carlstens fästning år 1838",
    // id: "zg8xnd593pnc8wp",
    id: "2190489",
    terms: ["Transkvinnor", "Bögar", "Lesbiska"],
  },
  {
    // title: "Fåglarna sover i luften / Eva-Stina Byggmästar",
    id: "8k71tf87643l6qlx",
  },
  {
    // title: "Lena : en bok om fruntimmer / af René",
    // id: "0h9x0jmb46nbjr9",
    id: "1625680",
    terms: ["Lesbiska"],
  },
  {
    // Nästan i mål! En komisk transition av Olivia Skoglund(2020)
    id: "9l11nlkh7jnwp14m",
    terms: [
      "bröst",
      "censur",
      "dejtingsidor",
      "polistrakasserier",
      "dragqueens",
      "bögar",
      "homofobi",
      "Hormonbehandling (kön)",
      "Hårborttagning",
      "Id-kort",
      "Namnändring",
      "Juridiskt namn",
      "Komma ut",
      "Könsbekräftande behandling",
      "Könsdysfori",
      "Könsidentitet",
      "Könsorgan",
      "Könsroller",
      "Misogyni",
      "Passera (kön)",
      "Sexuella trakasserier",
      "Transbarn",
      "Transitionering",
      "Transkvinnor",
      "Unga transpersoner",
      "Homofobi",
    ],
  },
];
