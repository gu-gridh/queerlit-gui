import works from "@/assets/local-works.yaml";

Object.values(works).forEach((work) => {
  work.genreform = [];
  work.classification = [];
  work.terms.forEach((term) => {
    term._label = term.prefLabel;
  });
});

export default function useLocalWorks() {
  return {
    works,
  };
}
