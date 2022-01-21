import axios from "axios";

export async function search(
  text,
  terms = [],
  title,
  author,
  yearStart,
  yearEnd,
  genreform
) {
  // "q" is the free text parameter
  const q = text || "*";
  const params = { q };

  if (author) {
    ["givenName", "familyName", "name", "label"].forEach(
      (prop) => (params["or-instanceOf.contribution.agent." + prop] = author)
    );
  }

  if (title) {
    params["hasTitle.mainTitle"] = title;
  }

  if (genreform) {
    params["instanceOf.genreForm.prefLabelByLang.sv"] = genreform;
  }

  if (yearStart) {
    params["min-publication.year"] = yearStart;
  }

  if (yearEnd) {
    params["max-publication.year"] = yearEnd;
  }

  console.log("params", params);

  const params1 = new URLSearchParams(params);
  const params2 = new URLSearchParams(params);

  BOOKS.forEach((book) => {
    book.id.match(/[a-z]/)
      ? params2.append("meta.@id", `https://libris-qa.kb.se/${book.id}`)
      : params1.append(
          "sameAs.@id",
          `http://libris.kb.se/resource/bib/${book.id}`
        );
  });

  const [response1, response2] = await Promise.all([
    xlFindBooks(params1),
    xlFindBooks(params2),
  ]);

  const response = {
    total: response1.totalItems + response2.totalItems,
    items: [...response1.items, ...response2.items],
  };

  // Do filtering that the API cannot do.
  response.items = response.items.filter((item) => responseFilter(item, terms));

  return response;
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

export function getTerms() {
  return BOOKS.reduce(
    (terms, item, i) => [
      ...terms,
      ...(item.terms || []).filter((term) => !terms.includes(term)),
    ],
    []
  );
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
  return terms.every((term) => item.terms && item.terms.includes(term));
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
];
