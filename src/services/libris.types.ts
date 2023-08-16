import type { MaybeArray, URI } from "@/types/util";

export type LibrisFindParams = Record<string, string> | URLSearchParams;

// Generated with help from https://quicktype.io/typescript

export type Instance = {
  "@type": "Instance" | "Print";
  "@id": string;
  "@reverse": {
    itemOf: Item[];
  };
  identifiedBy?: Identifier[];
  hasTitle: Title[];
  instanceOf: Text;
  responsibilityStatement?: string;
  publication: Publication[];
  manufacture?: Manufacture[];
  extent?: Labels[];
  hasDimensions?: Labels;
  hasNote?: Labels[];
  physicalDetailsNote?: string;
  seriesMembership?: SeriesMembership[];
  editionStatement?: string;
  summary?: Labels[];
};

type Item = {
  "@type": "Item";
  "@id": string;
  itemOf: HasId;
  heldBy: BibliographyLibrary;
  subject?: ItemSubject[];
  summary?: Labels[];
};

type BibliographyLibrary = {
  "@id": string;
  sigel?: string;
};

type HasId = {
  "@id": string;
};

type ItemSubject = {
  "@id"?: URI;
  "@type"?: string;
  label?: string;
  prefLabel?: string;
};

type SubjectType =
  | "Topic"
  | "ComplexSubject"
  | "Geographic"
  | "Temporal"
  | "Person";

type Labels = {
  "@type": string;
  label: string[];
};

type CarrierType = {
  "@id": string;
  "@type": CarrierTypeType;
  prefLabelByLang: ByLang;
  label?: string[] | string;
  code?: CarrierTypeCode;
  inScheme?: HasId;
};

type CarrierTypeType =
  | "CarrierType"
  | "ContentType"
  | "Role"
  | "marc:BooksIllustrationsType"
  | "marc:AudienceType"
  | "Language"
  | "MediaType"
  | "marc:CatFormType";

type CarrierTypeCode = "ill" | "aut" | "a" | "j" | "swe";

type ByLang = {
  en?: string;
  sv?: string;
};

type Title = {
  "@type": "Title";
  mainTitle: string;
  subtitle?: string;
};

type Identifier = IdentifierISBN | IdentifierOther;

type IdentifierISBN = {
  "@type": "ISBN";
  value: string;
};

type IdentifierOther = {
  "@type": string;
  value: string;
  qualifier?: string[];
};

type Text = {
  "@type": "Text";
  contribution: Contribution[];
  language: CarrierType[];
  genreForm: GenreFormAny[];
  classification: Classification[];
  subject: TextSubject[];
  intendedAudience?: CarrierType[];
  contentType?: CarrierType[];
  illustrativeContent?: CarrierType;
};

type Classification = {
  "@type": ClassificationType;
  inScheme?: ClassificationInScheme;
  code: string;
};

type ClassificationDdc = {
  "@type": "ClassificationDdc";
  code?: string;
};

type ClassificationType = "Classification" | "ClassificationDdc";

type ClassificationInScheme = {
  "@type": "ConceptScheme";
  code: "kssb";
};

type Contribution = {
  "@type": "PrimaryContribution" | "Contribution";
  agent: Agent;
  role: MaybeArray<Role>;
};

type Agent = AgentOrganization | AgentPerson;

type AgentOrganization = {
  "@type": "Organization";
  name: string;
};

type AgentPerson = {
  "@id"?: string;
  "@type": "Person";
  familyName: string;
  givenName: string;
  lifeSpan: string;
};

type Role = {
  "@id"?: URI;
  prefLabelByLang?: ByLang;
  code: string;
};

type GenreFormAny = GenreForm | MarcGenreForm;

type GenreForm = {
  "@id"?: string;
  "@type": "GenreForm";
  prefLabel: string;
  inScheme?: HasId;
};

type GenreFormMarc = {
  "@type": `marc:${string}` | `marc:${string}`[];
  prefLabelByLang: ByLang;
  code: string;
};

type TextSubject = {
  "@id"?: string;
  "@type": SubjectType;
  prefLabel?: string;
  inScheme?: SubjectInScheme;
  termComponentList?: TermComponentList[];
  familyName?: string;
  givenName?: string;
  "marc:titlesAndOtherWordsAssociatedWithAName"?: string;
  lifeSpan?: string;
};

type SubjectInScheme = {
  "@id": string;
  "@type"?: CountryType;
  titleByLang?: ByLang;
  code?: FluffyCode;
  title?: string;
};

type CountryType = "TopicScheme" | "Country";

type FluffyCode = "barn" | "ncjt" | "sao";

type TermComponentList = {
  "@type": TermComponentListType;
  prefLabel: string;
  "@id"?: string;
  inScheme?: Country;
};

type TermComponentListType =
  | "Geographic"
  | "GeographicSubdivision"
  | "Topic"
  | "TopicSubdivision";

type Country = {
  "@id": string;
  "@type": CountryType;
  titleByLang?: TitleByLang;
  code: CountryCode;
  prefLabelByLang?: ByLang;
};

type CountryCode = "sao" | "sw";

type TitleByLang = {
  sv: string;
};

type Manufacture = {
  "@type": ManufactureType;
  place?: Labels[];
  agent?: Labels;
};

type ManufactureType = "Manufacture" | "Publication";

type Publication = {
  "@type": "PrimaryPublication";
  country: Country;
  place?: Labels[];
  agent?: Labels;
  year: string;
  date?: string;
  hasPart?: Manufacture[];
};

type SeriesMembership = {
  "@type": "SeriesMembership";
  seriesStatement: string[];
  seriesEnumeration?: string;
};
