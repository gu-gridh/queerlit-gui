import type { LibrisInstance } from "@/services/libris.types";
import type { URI } from "@/types/util";

export type Work = {
  id: string;
  title: string;
  creators: {
    name: string;
    lifeSpan?: string;
    roles?: string[];
  }[];
  date?: string;
  terms: Term[];
  termsSecondary: Term[];
  summary?: string;
  motivation?: string;
  genreform: Term[];
  languages?: string[];
  contentType?: string[];
  extent?: string;
  note?: string;
  identifiedBy?: string[];
  classification?: { type?: string; code?: string }[];
  publication?: string[];
  intendedAudience?: string[];
};

export type WorkFromLibris = Work & {
  _item: LibrisInstance;
  librisUrl?: string;
};

export type Term = {
  "@id": URI;
  _label: string;
  inScheme?: URI;
  prefLabel?: string;
};