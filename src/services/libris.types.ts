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
  subject?: Subject[];
  summary?: Labels[];
};

type BibliographyLibrary = {
  "@id": string;
  sigel?: string;
};

type HasId = {
  "@id": URI;
};

type Labels = {
  // TODO Document what @types can occur
  // Seen @types: Place
  label: MaybeArray<string>;
};

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
  qualifier?: MaybeArray<string>; // e.g. "inb.", "danskt band"
};

type IdentifierOther = {
  "@type": "Identifier";
  value: string;
  typeNote?: string;
};

type Text = {
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

type ClassificationAny = Classification | ClassificationDdc;

type ClassificationDdc = {
  "@type": "ClassificationDdc";
  code?: string;
};

type Classification = {
  "@type": "Classification";
  inScheme?: ConceptScheme;
};

type ConceptScheme = {
  "@type": "ConceptScheme";
  code: string;
};

type Contribution = {
  "@type": "PrimaryContribution" | "Contribution";
  agent: Agent;
  role: MaybeArray<Role>;
};

type Agent = Organization | Person;

type Organization = {
  "@type": "Organization";
  name: string;
};

type Person = {
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

type Language = {
  "@type": "Language";
  "@id": URI;
  prefLabelByLang: ByLang;
  code: string;
};

type GenreFormAny = GenreForm | GenreFormMarc;

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

type Subject = Person | Topic | Temporal | ComplexSubject;

type Topic = {
  "@type": "Topic";
  prefLabel: string;
};

type Temporal = {
  "@type": "Temporal";
  prefLabel: string;
  inScheme: HasId | TopicScheme;
};

type TopicScheme = {
  "@id": URI;
  "@type": "TopicScheme";
  titleByLang: ByLang;
  code: string;
};

type ComplexSubject = {
  "@type": "ComplexSubject";
  prefLabel?: string;
  inScheme: HasId | TopicScheme;
  termComponentList: TermComponent[];
};

type TermComponent = Topic | Person | TermComponentOther;

type TermComponentOther = {
  // Seen @types: GenreSubdivision, Geographic, GeographicSubdivision, Person, TemporalSubdivision, Topic, TopicSubdivision
  prefLabel?: string;
  "@id"?: string;
  inScheme?: TopicScheme;
};

type AudienceType = {
  "@type": "marc:AudienceType";
  prefLabelByLang: ByLang;
  inScheme: HasId;
  code: string;
};

type ContentType = {
  "@type": "ContentType";
  "@id": URI;
  label: string;
  prefLabelByLang: ByLang;
};

type IllustrationsType = {
  "@type": "marc:BooksIllustrationsType";
  "@id": URI;
  prefLabelByLang: ByLang;
  code: string;
};

type Manufacture = {
  "@type": "Manufacture";
  agent?: Labels;
  date?: MaybeArray<string>; // TODO check
  place?: MaybeArray<Labels>;
  year?: string;
};

type Publication = {
  "@type": "PrimaryPublication" | "Publication";
  year: string;
  country?: Country;
  place?: MaybeArray<Labels>;
  agent?: Labels;
  date?: MaybeArray<string>;
  hasPart?: Publication[];
};

type Country = {
  "@id": URI;
  "@type": "Country";
  code: string;
  prefLabelByLang: ByLang;
};

type SeriesMembership = {
  "@type": "SeriesMembership";
  seriesStatement: string[];
  seriesEnumeration?: string;
};
