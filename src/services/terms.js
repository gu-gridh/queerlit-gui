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

export async function getTerm(id) {
  return termData[id];
}

export async function getChildren(parent) {
  return Object.values(termData)
    .filter((child) => child.broader && child.broader.includes(parent.id))
    .map((term) => ({ term }));
}

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
  lesbiska: {
    prefLabel: "Lesbiska",
    altLabel: ["Homosexuella kvinnor", "Lesbiska kvinnor", "Lesbianer"],
    broader: ["kvinnor", "homosexuella"],
  },
  föräldrarHBTQI: {
    prefLabel: "Föräldrar (HBTQI)",
    broader: ["familjemedlemmar", "HBTQIFamiljer"],
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
