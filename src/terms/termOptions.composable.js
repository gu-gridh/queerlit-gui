import useTerms from "./terms.composable";

export default function useTermOptions() {
  const { gotoTerm, searchByTerm, searchByTermSecondary, termIsQlit } =
    useTerms();

  const goto = (term) => ({
    label: `Om ämnesordet <em>${term._label}</em>`,
    action: () => gotoTerm(term),
    // The Term view only works with QLIT terms.
    isApplicable: termIsQlit(term),
  });

  const search = (term) => ({
    label: `Sök på <em>${term._label}</em>`,
    action: () => searchByTerm(term),
    isApplicable: !!term["@id"],
  });

  const searchSecondary = (term) => ({
    label: `Sök perifert på <em>${term._label}</em>`,
    action: () => searchByTermSecondary(term),
    isApplicable: !!term["@id"],
  });

  return {
    goto,
    search,
    searchSecondary,
  };
}
