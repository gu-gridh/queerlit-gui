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
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default function useTerms() {
  const router = useRouter();
  const store = useStore();
  const { terms, setQuery } = useQuery();
  const suggestions = ref([]);

  function add(term) {
    if (!terms.value.find((term2) => term2["@id"] == term["@id"]))
      setQuery({ terms: [...terms.value, term] });
  }

  function remove(term) {
    setQuery({
      terms: terms.value.filter((term2) => term2["@id"] != term["@id"]),
    });
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
    store.dispatch("search");
    router.push("/");
  }

  function gotoTerm(term) {
    router.push(`/subjects/${term.name}`);
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
    add,
    remove,
    sortTerms,
    searchByTerm,
    gotoTerm,
  };
}
