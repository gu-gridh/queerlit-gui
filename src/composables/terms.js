import { ref } from "@vue/reactivity";
import useQuery from "@/composables/query";
import {
  autocomplete,
  getTerm,
  getParents,
  getChildren,
  getRelated,
  getRoots,
} from "@/services/terms";

export default function useTerms() {
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

  return {
    autocomplete,
    getTerm,
    getParents,
    getChildren,
    hasChildren,
    getRelated,
    getRoots,
    suggestions,
    terms,
    add,
    remove,
  };
}
