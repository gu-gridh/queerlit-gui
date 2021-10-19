import axios from "axios";

export function search() {
  const query = BOOKS.map((item) => `bibid:${item.id}`).join(" OR ");
  return xsearch({ query });
}

async function xsearch(params) {
  params = {
    ...params,
    format: "json",
  };
  return (
    axios
      .get("https://libris.kb.se/xsearch", { params })
      .then((response) => response.data.xsearch)
      // Decorate with custom data.
      .then((xsearch) => ({
        ...xsearch,
        list: xsearch.list.map(enrichLibrisItem),
      }))
  );
}

function enrichLibrisItem(item) {
  const localItem = BOOKS.find(
    (item2) => item.identifier === `http://libris.kb.se/bib/${item2.id}`
  );
  return { ...localItem, ...item };
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
    terms: ["Dramatik"],
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
    author: { lastname: "Byggmästar", firstname: "Eva-Stina" },
  },
  {
    // title: "Lena : en bok om fruntimmer / af René",
    id: "1625680",
    terms: ["Lesbiska"],
  },
];
