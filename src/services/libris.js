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
  const params = { q };

  if (author) {
    params["instanceOf.contribution.agent.@id"] = author["@id"];
  }

  if (title) {
    params["hasTitle.mainTitle"] = title;
  }

  if (genreform) {
    params["instanceOf.genreForm.@id"] = genreform;
  }

  if (yearStart) {
    params["min-publication.year"] = yearStart;
  }

  if (yearEnd) {
    params["max-publication.year"] = yearEnd;
  }

  params["@reverse.itemOf.heldBy.@id"] = "https://libris.kb.se/library/QLIT";
  if (sort) {
    params["_sort"] = sort;
  }
  params["_offset"] = offset;
  params["_limit"] = 20;

  console.log("params", params);

  // Iteratively do local filtering and page until the limit is reached.
  const result = {
    total: Infinity,
    items: [],
  };
  while (result.items.length < 20 && offset <= result.total) {
    const response = await xlFindBooks({ ...params, _offset: offset });
    result.total = response.totalItems;
    const items = response.items.filter((item) => responseFilter(item, terms));
    if (items.length) {
      console.log(`Found ${items.length} new items on offset ${offset}`);
    }
    result.items.push(...items);
    offset += 20;
  }
  // Remove tail in case the last reponse surpassed the limit.
  result.items.splice(20);

  return result;
}

export async function get(id) {
  const result = await search();
  return result.items.find((item) => item.id === id);
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
    .get("https://libris-qa.kb.se/find", { params })
    .then((response) => response.data);
}

function processXlItem(item) {
  // Enrich with custom data.
  const localItem = BOOKS.find(
    (book) =>
      item["@id"] === `https://libris-qa.kb.se/${book.id}#it` ||
      (item.sameAs &&
        item.sameAs.some(
          (sameAs) =>
            sameAs["@id"] === `http://libris.kb.se/resource/bib/${book.id}`
        ))
  );
  const processed = { ...localItem, _item: item };

  if (item.meta.sameAs) {
    processed.librisUrl = item.meta.sameAs
      .map((x) => x["@id"])
      .find((id) => /http:\/\/libris.kb.se\/bib\//.test(id));
  }

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

  return processed;
}

function responseFilter(item, terms = []) {
  return terms.every(
    (term) =>
      item.terms &&
      (item.terms.includes(term.id) || item.terms.includes(term.prefLabel))
  );
}

export async function searchPerson(nameQuery) {
  // Add wildcard at end of each word
  const q = nameQuery.replaceAll(/\S+/g, "$&*");
  const params = { "@type": "Person", q, _limit: 20 };
  console.log("params person", params);
  const data = await xlFind(params);
  console.log("searchPerson", data.items);
  return data.items.map((item) => ({
    firstname: item.givenName,
    lastname: item.familyName,
    _item: item,
  }));
}

export async function searchGenreform(query) {
  const q = query.replaceAll(/\S+/g, "$&*");
  const params = { "@type": "GenreForm", prefLabel: q, _limit: 20 };
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
