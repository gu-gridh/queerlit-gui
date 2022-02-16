export function autocomplete(input) {
  if (!input) return [];
  const match = (label) =>
    label
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.indexOf(input.toLowerCase()) === 0);
  return Object.values(termData).reduce((results, term) => {
    const altMatch = term.alt && term.alt.find(match);
    if (!match(term.label) && !altMatch) return results;
    results.push({ term, altMatch });
    return results;
  }, []);
}

export function getTerm(id) {
  return termData[id];
}

export function getChildren(parent) {
  return Object.values(termData)
    .filter((child) => child.parents && child.parents.includes(parent.id))
    .map((term) => ({ term }));
}

export function getRoots() {
  return Object.values(termData)
    .filter((term) => !term.parents || !term.parents.length)
    .map((term) => ({ term }));
}

const termData = {
  bisexualitet: {
    label: "Bisexualitet",
    parents: ["sexuellLäggning"],
    related: ["homosexualitet", "bisexuella", "polysexualitet"],
  },
  bögar: {
    label: "Bögar",
    parents: ["män", "homosexuella"],
  },
  garderobsbögar: {
    label: "Garderobsbögar",
    alt: ["Smygbögar"],
    parents: ["bögar"],
  },
  homosexuella: {
    label: "Homosexuella",
    scopeNote:
      "Används för skildringar av personer som identifierar sig som, eller av andra identifieras som, homosexuella.",
    parents: ["HBTQIPersoner"],
    related: ["homosexualitet", "homofobi", "homosexuellaGemenskaper"],
  },
  lesbiska: {
    label: "Lesbiska",
    alt: ["Homosexuella kvinnor", "Lesbiska kvinnor", "Lesbianer"],
    parents: ["kvinnor", "homosexuella"],
  },
  föräldrarHBTQI: {
    label: "Föräldrar (HBTQI)",
    parents: ["familjemedlemmar", "HBTQIFamiljer"],
  },
  HBTQIFamiljer: {
    label: "HBTQI-familjer",
  },
  ungaTranspersoner: {
    label: "Unga transpersoner",
    alt: ["Transungdomar", "Transtonåringar"],
    parents: ["HBTQIUngdomar", "transpersoner"],
  },
  äldreTranspersoner: {
    label: "Äldre transpersoner",
    parents: ["äldreHBTQIPersoner", "transpersoner"],
  },
  äldreHBTQIPersoner: {
    label: "Äldre HBTQI-personer",
    parents: ["HBTQIPersoner"],
  },
  HBTQIPersoner: {
    label: "HBTQI-personer",
    scopeNote:
      "Används för skildringar av personer som identifierar sig som, eller av andra identifieras som, homosexuella, bisexuella, transpersoner, queera och/eller intersexpersoner.",
    alt: ["HBT-personer", "HBTQ-personer", "Sexuella minoriteter"],
  },
  transpersoner: {
    label: "Transpersoner",
    alt: ["Trans", "Trans*"],
    parents: ["HBTQIPersoner", "könsidentitet"],
  },
  könsidentitet: {
    label: "Könsidentitet",
    parents: ["kön"],
  },
  kön: {
    label: "Kön",
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
    label: "Transkvinnor",
    alt: ["Trans-kvinnor"],
    parents: ["kvinnor", "transpersoner"],
  },
  transmän: {
    label: "Transmän",
    alt: ["Trans-män"],
    parents: ["män", "transpersoner"],
  },
};

Object.keys(termData).forEach((id) => (termData[id].id = id));
