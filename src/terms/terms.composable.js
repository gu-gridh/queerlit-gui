import { ref } from "@vue/reactivity";
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

export default function useTerms() {
  const router = useRouter();
  const { terms, termsSecondary, hierarchical } = useQuery();
  const suggestions = ref([]);
  const { doSearch, setQuery } = useSearch();

  function add(term) {
    if (!terms.value.find((term2) => term2["@id"] == term["@id"]))
      setQuery({ terms: [...terms.value, term] });
  }

  function remove(term) {
    setQuery({
      terms: terms.value.filter((term2) => term2["@id"] != term["@id"]),
    });
  }

  function addSecondary(term) {
    if (!termsSecondary.value.find((term2) => term2["@id"] == term["@id"]))
      setQuery({ termsSecondary: [...termsSecondary.value, term] });
  }

  function removeSecondary(term) {
    setQuery({
      termsSecondary: termsSecondary.value.filter(
        (term2) => term2["@id"] != term["@id"]
      ),
    });
  }

  function toggleHierarchical(value) {
    // If no arg, toggle to opposite value.
    if (value === undefined) value = !hierarchical.value;
    setQuery({ hierarchical: value });
  }

  async function hasChildren(term) {
    return (await getChildren(term)).length;
  }

  function termIsQlit(term) {
    return term.inScheme?.["@id"] == "https://queerlit.dh.gu.se/qlit/v1";
  }

  function sortTerms(terms) {
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

  function searchByTerm(term) {
    add(term);
    doSearch();
    router.push("/");
  }

  function gotoTerm(term) {
    const name = term.name || urlBasename(term.uri || term["@id"]);
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
    gotoTerm,
    termIsQlit,
  };
}
