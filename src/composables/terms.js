import { ref } from "@vue/reactivity";
import useQuery from "@/composables/query";
import { autocomplete } from "@/services/terms";

export default function useTerms() {
  const { terms, setQuery } = useQuery();
  const suggestions = ref([]);

  function add(term) {
    if (!terms.value.find((term2) => term2.id == term.id))
      setQuery({ terms: [...terms.value, term] });
  }

  function remove(term) {
    setQuery({ terms: terms.value.filter((term2) => term2.id == term.id) });
  }

  return {
    autocomplete,
    suggestions,
    terms,
    add,
    remove,
  };
}
