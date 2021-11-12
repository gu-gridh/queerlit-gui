import axios from "axios";

export async function search(text = "", terms = []) {
  const queerlitCond = BOOKS.map((item) => `bibid:${item.id}`).join(" OR ");
  const textCond =
    text && ["TIT", "FÖRF", "AMNE"].map((f) => `${f}:(${text}*)`).join(" OR ");
  const query = [queerlitCond, textCond]
    .filter((x) => x)
    .map((x) => `(${x})`)
    .join(" AND ");
  const results = await xsearch({ query });
  const list = results.list.filter((item) =>
    terms.every((term) => item.terms && item.terms.includes(term))
  );
  return { ...results, list };
}

export async function get(bibid) {
  const result = await xsearch({ query: `bibid:${bibid}` });
  return result.list[0];
}

async function xsearch(params) {
  params = {
    ...params,
    format: "json",
    n: 50,
  };
  return (
    axios
      .get("https://libris.kb.se/xsearch", { params })
      .then((response) => response.data.xsearch)
      // Decorate with custom data.
      .then((xsearch) => ({
        ...xsearch,
        list: xsearch.list.map(processLibrisItem),
      }))
  );
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

function processLibrisItem(item) {
  // Enrich with custom data.
  const localItem = BOOKS.find(
    (item2) => item.identifier === `http://libris.kb.se/bib/${item2.id}`
  );
  item = { ...localItem, ...item };

  // Normalize some values.
  item.creator = item.creator
    .split(", ")
    .filter((s) => !/^[\d\s-]*$/.test(s))
    .join(", ");
  const dearray = (x) => (Array.isArray(x) ? x[0] : x);
  item.date = dearray(item.date);
  item.publisher = dearray(item.publisher);

  // Add bibid.
  item.bibid = item.identifier.split("/").pop();

  return item;
}

const BOOKS = [
  {
    // title: "Clownen Jac",
    id: "904603",
    terms: ["Bögar", "Garderobsbögar"],
  },
  {
    // title: "Vålnaden",
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
    id: "16439900",
    terms: ["Bilderbok", "Föräldrar (HBTQI)", "HBTQI-familjer"],
  },
  {
    // title: "Iggy 4-ever",
    id: "17047889",
    terms: ["Transmän", "Unga transpersoner"],
  },
  {
    // title: "Trånga jeans : [en homosexroman]",
    id: "8227005",
    terms: [],
  },
  {
    // title: "Chain reaction",
    id: "19597056",
    terms: [],
  },
  {
    // title: "Bodil eller hattasken : två pjäser i en",
    id: "1311105",
    terms: [],
  },
  {
    // title: "En dåres försvarstal / översättning från det franska originalet av John Landquist",
    id: "3094916",
    terms: ["Lesbiska", "Bisexualitet"],
  },
  {
    // title: "Den svenske stortjufven Lasse-Majas äfventyr ifrån hans födelse till dess han blef frigifven från Carlstens fästning år 1838",
    id: "2190489",
    terms: ["Transkvinnor", "Bögar", "Lesbiska"],
  },
  {
    // title: "Fåglarna sover i luften / Eva-Stina Byggmästar",
    id: "8k71tf87643l6qlx",
  },
  {
    // title: "Lena : en bok om fruntimmer / af René",
    id: "1625680",
    terms: ["Lesbiska"],
  },
];
