import { ref } from "vue";
import useQuery from "@/search/query.composable";
import {
  getTerm,
  getParents,
  getChildren,
  getRelated,
  getRoots,
  searchTerms,
} from "@/services/terms.service";
import negate from "lodash/negate";
import { useRouter } from "vue-router";
import { urlBasename } from "@/util";
import useSearch from "@/search/search.composable";
import type { Term } from "@/types/work";
import type { LibrisTerm } from "@/services/libris.types";
import type { QlitTerm } from "@/services/qlit.types";

export default function useTerms() {
  const router = useRouter();
  const { terms, termsSecondary, hierarchical } = useQuery();
  const suggestions = ref([]);
  const { setQuery } = useSearch();

  function add(term: Term) {
    if (!terms.value.find((term2) => term2["@id"] == term["@id"]))
      setQuery({ terms: [...terms.value, term] });
  }

  function remove(term: Term) {
    setQuery({
      terms: terms.value.filter((term2) => term2["@id"] != term["@id"]),
    });
  }

  function addSecondary(term: Term) {
    if (!termsSecondary.value.find((term2) => term2["@id"] == term["@id"]))
      setQuery({ termsSecondary: [...termsSecondary.value, term] });
  }

  function removeSecondary(term: Term) {
    setQuery({
      termsSecondary: termsSecondary.value.filter(
        (term2) => term2["@id"] != term["@id"]
      ),
    });
  }

  function toggleHierarchical(value?: boolean) {
    // If no arg, toggle to opposite value.
    if (value === undefined) value = !hierarchical.value;
    setQuery({ hierarchical: value });
  }

  async function hasChildren(term: string) {
    return (await getChildren(term)).length;
  }

  function termIsQlit(term: LibrisTerm) {
    return (
      term.inScheme?.["@id"] == "https://queerlit.dh.gu.se/qlit/v1" ||
      term["@id"]?.indexOf("https://queerlit.dh.gu.se/qlit/v1/") === 0
    );
  }

  function sortTerms(terms: LibrisTerm[]) {
    return (
      terms && {
        qlit: terms
          .filter(termIsQlit)
          // Add the `name` prop so we can use them more like the ones from the thesaurus backend.
          .map((term) => ({ name: term["@id"].split("/").pop(), ...term })),
        other: terms.filter(negate(termIsQlit)),
      }
    );
  }

  function searchByTerm(term: Term) {
    add(term);
    router.push("/");
  }

  function searchByTermSecondary(term: Term) {
    addSecondary(term);
    router.push("/");
  }

  function gotoTerm(term: QlitTerm | LibrisTerm) {
    const name = "name" in term ? term.name : urlBasename(term["@id"]);
    router.push(`/subjects/${name}`);
  }

  return {
    getTerm,
    getParents,
    getChildren,
    hasChildren,
    getRelated,
    getRoots,
    searchTerms,
    suggestions,
    terms,
    termsSecondary,
    hierarchical,
    add,
    remove,
    addSecondary,
    removeSecondary,
    toggleHierarchical,
    sortTerms,
    searchByTerm,
    searchByTermSecondary,
    gotoTerm,
    termIsQlit,
  };
}
