import type { URI } from "@/types/util";

export type QlitTerm = {
  name: QlitName;
  prefLabel: string;
  altLabels: string[];
  hiddenLabels: string[];
  scopeNote: string;
  uri: URI;
  broader: QlitName[];
  narrower: QlitName[];
  related: QlitName[];
  exactMatch: QlitExternalTerm[];
  closeMatch: QlitExternalTerm[];
};

export type QlitExternalTerm = {
  prefLabel: string;
  altLabels: string[];
  uri: URI;
};

export type QlitCollection = {
  name: QlitName;
  prefLabel: string;
  uri: URI;
};

export type TermLike = Record<string, any> & {
  uri: URI;
  prefLabel: string;
};

export type QlitName = string;

export type HasUri = {
  uri: URI;
};
