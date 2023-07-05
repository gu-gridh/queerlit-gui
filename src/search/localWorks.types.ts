export type LocalWork = {
  id: string;
  title: string;
  creators: { name: string; lifeSpan: string }[];
  motivation?: string;
  date: {
    label: string;
    min: number;
    max: number;
  };
  terms: LocalTerm[];
  genreform: LocalTerm[];
  librisUrl?: string;
};

export type LocalWorkRaw = Readonly<
  Omit<LocalWork, "id" | "date" | "terms" | "genreform"> & {
    date:
      | {
          label?: string;
          min: number;
          max: number;
        }
      | number;
    terms?: Record<string, string>;
    genreform?: Record<string, string>;
  }
>;

export type LocalTerm = {
  "@id": string;
  prefLabel: string;
  _label: string;
  inScheme: {
    "@id": string;
  };
};
