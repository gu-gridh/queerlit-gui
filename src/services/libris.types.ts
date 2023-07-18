import type { MaybeArray, URI } from "@/types/util";

export type LibrisFindParams = Record<string, string> | URLSearchParams;

export type LibrisInstance = HasId & {
  meta: { controlNumber?: string };
  instanceOf: LibrisWork;
  hasTitle: {
    mainTitle?: string;
    hasPart?: { partName: string; partNumber?: string }[];
  }[];
  publication?: {
    year?: string;
    agent?: LibrisAgent;
    country?: MaybeArray<Labeled>;
    place?: MaybeArray<Labeled>;
  }[];
  summary?: { label: MaybeArray<string> }[];
  extent?: { label: string }[];
  hasNote?: { label: string }[];
  identifiedBy?: {
    value: string;
    "@type"?: string;
    qualifier?: MaybeArray<string>;
  }[];
  "@reverse": {
    itemOf: LibrisItem[];
  };
};

export type LibrisWork = {
  subject?: LibrisTerm[];
  genreForm?: LibrisTerm[];
  contribution?: { agent?: LibrisAgent; role?: MaybeArray<Labeled> }[];
  summary?: { label: MaybeArray<string> }[];
  language: Labeled[];
  contentType?: Labeled[];
  classification?: {
    "@type"?: string;
    code?: string;
    inScheme?: { code?: string };
  }[];
  intendedAudience?: Labeled[];
};

export type LibrisItem = {
  "@id": string;
  heldBy: HasId;
  summary?: MaybeArray<{ label: MaybeArray<string> }>;
  subject?: LibrisTerm[];
};

export type LibrisAgent = HasId & {
  lifeSpan?: string;
};

export type LibrisPerson = LibrisAgent & {
  givenName?: MaybeArray<string>;
  familyName?: MaybeArray<string>;
  name?: MaybeArray<string>;
  label?: MaybeArray<string>;
  "marc:numeration"?: MaybeArray<string>;
};

export type LibrisTerm = HasId &
  Labeled & {
    inScheme?: Partial<HasId>;
    "@type": string;
    termComponentList: Labeled[];
  };

export type LibrisGenreForm = LibrisTerm & {
  inScheme: HasId & {
    code: string;
  };
};

export type LibrisStats = {
  sliceByDimension?: Record<
    string,
    {
      observation: {
        object: { label: string };
        totalItems: number;
      }[];
    }
  >;
};

// e.g. m5z6nv6z15bc53g
export type LibrisId = string;

export type HasId = { "@id": URI };
export type Labeled = Partial<{
  prefLabel: string;
  prefLabelByLang: { sv: string };
  label: MaybeArray<string>;
  name: string;
  "marc:subordinateUnit": MaybeArray<string>;
}>;
