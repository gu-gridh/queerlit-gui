// TODO Libris: use `q`
export async function autocomplete(input) {
  if (!input) return [];
  const match = (label) =>
    label
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.indexOf(input.toLowerCase()) === 0);
  return Object.values(termData).reduce((results, term) => {
    const altMatch = term.altLabel && term.altLabel.find(match);
    if (!match(term.prefLabel) && !altMatch) return results;
    results.push({ term, altMatch });
    return results;
  }, []);
}

// TODO Libris: the term id is its url, fetch that or do `find?@id=<url>`
export async function getTerm(id) {
  return termData[id];
}

export async function getParents(child) {
  return Object.values(termData)
    .filter((parent) => child.broader && child.broader.includes(parent.id))
    .map((term) => ({ term }));
}

// TODO Libris: `find?@type=Concept&broader.@id=<uri>`, encodeURLComponent needed, perhaps twice
export async function getChildren(parent) {
  return Object.values(termData)
    .filter((child) => child.broader && child.broader.includes(parent.id))
    .map((term) => ({ term }));
}

export async function getRelated(termA) {
  return Object.values(termData)
    .filter(
      (termB) =>
        (termA.related && termA.related.includes(termB.id)) ||
        (termB.related && termB.related.includes(termA.id))
    )
    .map((term) => ({ term }));
}

// TODO Libris: `find?@type=Concept&exists-broader=false`
export async function getRoots() {
  return Object.values(termData)
    .filter((term) => !term.broader || !term.broader.length)
    .map((term) => ({ term }));
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
