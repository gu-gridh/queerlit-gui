import type { MaybeArray, URI } from "@/types/util";

export type FindParams = Record<string, string> | URLSearchParams;

export type Id = string;

// Generated with help from https://quicktype.io/typescript

export type HasId = {
  "@id": URI;
};

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
  meta: InstanceMeta;
};

export type Item = {
  "@type": "Item";
  "@id": string;
  itemOf: HasId;
  heldBy: BibliographyLibrary;
  subject?: Subject[];
  summary?: Labels[];
};

export type BibliographyLibrary = {
  "@id": string;
  sigel?: string;
};

export type Labels = {
  // TODO Document what @types can occur
  // Seen @types: Place, Agent
  label: MaybeArray<string>;
};

export type ByLang = {
  en?: string;
  sv?: string;
};

export type Title = {
  "@type": "Title";
  mainTitle: string;
  subtitle?: string;
  hasPart?: TitlePart[];
};

export type TitlePart = {
  "@type": "TitlePart";
  partNumber: string[];
  partName: string[];
};

export type Identifier = IdentifierISBN | IdentifierOther;

export type IdentifierISBN = {
  "@type": "ISBN";
  value: string;
  qualifier?: MaybeArray<string>; // e.g. "inb.", "danskt band"
};

export type IdentifierOther = {
  "@type": "Identifier";
  value: string;
  typeNote?: string;
};

export type Text = {
  "@type": "Text";
  contribution: Contribution[];
  language: Language[];
  genreForm: GenreFormAny[];
  classification: ClassificationAny[];
  subject: Subject[];
  intendedAudience?: AudienceType[];
  contentType?: ContentType[];
  illustrativeContent?: IllustrationsType;
};

export type ClassificationAny = Classification | ClassificationDdc;

export type ClassificationDdc = {
  "@type": "ClassificationDdc";
  code?: string;
};

export type Classification = {
  "@type": "Classification";
  inScheme?: ConceptScheme;
  code?: string;
};

export type ConceptScheme = {
  "@type": "ConceptScheme";
  code: string;
};

export type Contribution = {
  "@type": "PrimaryContribution" | "Contribution";
  agent: MaybeArray<Organization | Person>;
  role: MaybeArray<Role>;
};

export type Organization = {
  "@type": "Organization";
  name: string;
};

export type Person = {
  "@id"?: string;
  "@type": "Person";
  familyName?: string;
  givenName?: string;
  lifeSpan?: string;
  name?: string;
  "marc:numeration"?: string; // e.g. "XII"
};

export type Role = {
  "@id"?: URI;
  prefLabelByLang?: ByLang;
  code: string;
};

export type Language = {
  "@type": "Language";
  "@id": URI;
  prefLabelByLang: ByLang;
  code: string;
};

export type GenreFormAny = GenreForm | GenreFormMarc;

export type GenreForm = {
  "@id"?: string;
  "@type": "GenreForm";
  prefLabel: string;
  inScheme?: HasId | TopicScheme;
};

export type GenreFormMarc = {
  "@type": `marc:${string}` | `marc:${string}`[];
  prefLabelByLang: ByLang;
  code: string;
};

export type Subject = Person | Topic | Temporal | ComplexSubject;

export type Topic = {
  "@type": "Topic";
  prefLabel: string;
  inScheme: HasId | TopicScheme;
};

export type Temporal = {
  "@type": "Temporal";
  prefLabel: string;
  inScheme: HasId | TopicScheme;
};

export type TopicScheme = {
  "@id": URI;
  "@type": "TopicScheme";
  titleByLang: ByLang;
  code: string;
};

export type ComplexSubject = {
  "@type": "ComplexSubject";
  prefLabel?: string;
  inScheme: HasId | TopicScheme;
  termComponentList: TermComponent[];
};

export type TermComponent = Topic | Person | TermComponentOther;

export type TermComponentOther = {
  // Seen @types: GenreSubdivision, Geographic, GeographicSubdivision, Person, TemporalSubdivision, Topic, TopicSubdivision
  prefLabel?: string;
  "@id"?: string;
  inScheme?: TopicScheme;
};

export type Concept = GenreFormAny | Subject;

export type AudienceType = {
  "@type": "marc:AudienceType";
  prefLabelByLang: ByLang;
  inScheme: HasId;
  code: string;
};

export type ContentType = {
  "@type": "ContentType";
  "@id": URI;
  label: string;
  prefLabelByLang: ByLang;
};

export type IllustrationsType = {
  "@type": "marc:BooksIllustrationsType";
  "@id": URI;
  prefLabelByLang: ByLang;
  code: string;
};

export type Manufacture = {
  "@type": "Manufacture";
  agent?: Agent;
  date?: MaybeArray<string>; // TODO check
  place?: MaybeArray<Labels>;
  year?: string;
};

export type Publication = {
  "@type": "PrimaryPublication" | "Publication";
  year: string;
  country?: MaybeArray<Country>;
  place?: MaybeArray<Labels>;
  agent?: Agent;
  date?: MaybeArray<string>;
  hasPart?: Publication[];
};

export type Agent = Labels & {
  "@type": "Agent";
};

export type Country = {
  "@id": URI;
  "@type": "Country";
  code: string;
  prefLabelByLang: ByLang;
};

export type SeriesMembership = {
  "@type": "SeriesMembership";
  seriesStatement: string[];
  seriesEnumeration?: string;
};

type InstanceMeta = {
  controlNumber: string;
};

export type Stats = {
  sliceByDimension?: Record<string, StatsSlice>;
};

export type StatsSlice = {
  observation: StatsObservation[];
};

export type StatsObservation = {
  object: { label: string };
  totalItems: number;
};
