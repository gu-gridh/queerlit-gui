import type { Term } from "@/types/work";
import useTerms from "./terms.composable";

export type TermOption = (term: Term) => {
  label: string;
  to?: string;
  action: () => void;
  isApplicable: boolean;
};

export default function useTermOptions() {
  const {
    gotoTerm,
    searchByTerm,
    searchByTermSecondary,
    termIsQlit,
    getTermPagePath,
  } = useTerms();

  const goto: TermOption = (term) => ({
    label: `Om ämnesordet <em>${term.label}</em>`,
    to: getTermPagePath(term),
    action: () => gotoTerm(term),
    // The Term view only works with QLIT terms.
    isApplicable: termIsQlit(term),
  });

  const search: TermOption = (term) => ({
    label: `Sök på <em>${term.label}</em>`,
    action: () => searchByTerm(term),
    isApplicable: !!term.id,
  });

  const searchSecondary: TermOption = (term) => ({
    label: `Sök perifert på <em>${term.label}</em>`,
    action: () => searchByTermSecondary(term),
    isApplicable: !!term.id,
  });

  return {
    goto,
    search,
    searchSecondary,
  };
}
