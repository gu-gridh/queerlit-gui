import type { URI } from "@/types/util";
import type { Term } from "@/types/work";

export type QlitTermRaw = {
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

export type QlitTerm = Term & {
  name: QlitName;
  altLabels: string[];
  hiddenLabels: string[];
  scopeNote: string;
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

export type QlitCollectionRaw = {
  name: QlitName;
  prefLabel: string;
  uri: URI;
};

export type QlitCollection = Term & {
  name: QlitName;
  uri: URI;
};

export type QlitName = string;

export type HasUri = {
  uri: URI;
};
