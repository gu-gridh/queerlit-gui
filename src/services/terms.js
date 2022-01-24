export function autocomplete(input) {
  if (!input) return [];
  const match = (label, s) =>
    label.toLowerCase().indexOf(s.toLowerCase()) === 0;
  return Object.values(termData).filter(
    (term) =>
      match(term.label, input) ||
      (term.alt && term.alt.some((alt) => match(alt, input)))
  );
}

export function getChildren(parent) {
  return Object.values(termData).filter(
    (child) => child.parents && child.parents.includes(parent.id)
  );
}

export function getRoots() {
  return Object.values(termData).filter(
    (term) => !term.parents || !term.parents.length
  );
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
