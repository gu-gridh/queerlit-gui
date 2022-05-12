import axios from "axios";

const QLIT_BASE = "https://queerlit.dh.gu.se/qlit/v1/api/";

// TODO Libris: use `q`
export async function autocomplete(s) {
  // Do not sort alphabetically.
  const data = await qlitGet("autocomplete", { s });
  return data.slice(0, 10);
}

async function qlitGet(endpoint, params) {
  const response = await axios.get(QLIT_BASE + endpoint, { params });
  return response.data;
}

async function qlitList(endpoint, params) {
  const data = await qlitGet(endpoint, params);
  return data.sort((a, b) => a.prefLabel.localeCompare(b.prefLabel, "sv"));
}

export async function getTerm(name) {
  return qlitGet("term/" + name);
}

export async function getParents(child) {
  return qlitList("parents", { child });
}

export async function getChildren(parent) {
  return qlitList("children", { parent });
}

export async function getRelated(other) {
  return qlitList("related", { other });
}

export async function getRoots() {
  return qlitList("roots");
}

const termData = {
  bisexualitet: {
    prefLabel: "Bisexualitet",
    broader: ["sexuellLäggning"],
    related: ["homosexualitet", "bisexuella", "polysexualitet"],
  },
  bögar: {
    prefLabel: "Bögar",
    broader: ["män", "homosexuella"],
  },
  garderobsbögar: {
    prefLabel: "Garderobsbögar",
    altLabel: ["Smygbögar"],
    broader: ["bögar"],
  },
  homosexuella: {
    prefLabel: "Homosexuella",
    scopeNote:
      "Används för skildringar av personer som identifierar sig som, eller av andra identifieras som, homosexuella.",
    broader: ["HBTQIPersoner"],
    related: ["homosexualitet", "homofobi", "homosexuellaGemenskaper"],
  },
  homosexualitet: {
    prefLabel: "Homosexualitet",
    scopeNote:
      "Används för skildringar av förmågan att huvudsakligen bli kär i och/eller attraherad av personer av samma kön som en själv.",
    altLabel: ["Lesbianism"],
    broader: ["sexuellLäggning"],
    related: ["homosexuella", "heterosexualitet", "bisexualitet"],
  },
  lesbiska: {
    prefLabel: "Lesbiska",
    altLabel: ["Homosexuella kvinnor", "Lesbiska kvinnor", "Lesbianer"],
    broader: ["kvinnor", "homosexuella"],
  },
  föräldrarHBTQI: {
    prefLabel: "Föräldrar (HBTQI)",
    broader: ["familjemedlemmar", "HBTQIFamiljer"],
  },
  HBTQIBarn: {
    prefLabel: "HBTQI-barn",
    scopeNote:
      "Används för skildringar av personer under 15 år som beskrivs som homosexuella, bisexuella, transpersoner, queera och/eller intersexpersoner. Kan användas mer relativt för skildringar av personer som ej genomgått puberteten.",
    broader: ["barn", "HBTQIPersoner"],
    related: ["föräldrarHBTQI"],
  },
  HBTQIFamiljer: {
    prefLabel: "HBTQI-familjer",
  },
  ungaTranspersoner: {
    prefLabel: "Unga transpersoner",
    altLabel: ["Transungdomar", "Transtonåringar"],
    broader: ["HBTQIUngdomar", "transpersoner"],
  },
  äldreTranspersoner: {
    prefLabel: "Äldre transpersoner",
    broader: ["äldreHBTQIPersoner", "transpersoner"],
  },
  äldreHBTQIPersoner: {
    prefLabel: "Äldre HBTQI-personer",
    broader: ["HBTQIPersoner"],
  },
  HBTQIPersoner: {
    prefLabel: "HBTQI-personer",
    scopeNote:
      "Används för skildringar av personer som identifierar sig som, eller av andra identifieras som, homosexuella, bisexuella, transpersoner, queera och/eller intersexpersoner.",
    altLabel: ["HBT-personer", "HBTQ-personer", "Sexuella minoriteter"],
  },
  transpersoner: {
    prefLabel: "Transpersoner",
    altLabel: ["Trans", "Trans*"],
    broader: ["HBTQIPersoner", "könsidentitet"],
  },
  könsidentitet: {
    prefLabel: "Könsidentitet",
    broader: ["kön"],
  },
  kön: {
    prefLabel: "Kön",
    related: [
      "passeraKön",
      "genderbending",
      "könsbekräftandeBehandling",
      "könsmångfald",
      "könsförhållanden",
      "genusvetenskap",
    ],
  },
  transbarn: {
    prefLabel: "Transbarn",
    scopeNote:
      "Används för skildringar av transpersoner under 15 år. Kan användas mer relativt för skildringar av personer som ej genomgått puberteten.",
    broader: ["HBTQIBarn", "transpersoner"],
    related: ["föräldrarTillTranspersoner"],
  },
  transbarnPerifert: {
    prefLabel: "Transbarn – perifert",
    scopeNote:
      "Används för skildringar där transpersoner under 15 år har en perifer betydelse för verket. Kan användas mer relativt för skildringar av personer som ej genomgått puberteten.'",
    broader: ["transbarn", "HBTQIBarnPerifert", "transpersonerPerifert"],
  },
  transkvinnor: {
    prefLabel: "Transkvinnor",
    altLabel: ["Trans-kvinnor"],
    broader: ["kvinnor", "transpersoner"],
  },
  transmän: {
    prefLabel: "Transmän",
    altLabel: ["Trans-män"],
    broader: ["män", "transpersoner"],
  },
};

Object.keys(termData).forEach((id) => (termData[id].id = id));
