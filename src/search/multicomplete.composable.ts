import mapValues from "lodash/mapValues";
import { computed, ref } from "vue";

export type Autocompleter<T = any> = (s: string) => Promise<T[]>;

export default function useMulticomplete(
  autocompleters: Record<string, Autocompleter>
) {
  const lenses = mapValues(autocompleters, (autocomplete) => ({
    suggestions: ref<any[]>([]),
    autocomplete,
  }));

  const suggestions = computed(() =>
    mapValues(lenses, (lense) => lense.suggestions.value)
  );

  function autocomplete(s: string) {
    Object.values(lenses).forEach(({ autocomplete, suggestions }) =>
      autocomplete(s).then((items) => (suggestions.value = items))
    );
  }

  function clear() {
    Object.values(lenses).forEach(
      ({ suggestions }) => (suggestions.value = [])
    );
  }

  const hasSuggestions = computed(() =>
    Object.values(lenses).some(({ suggestions }) => suggestions.value.length)
  );

  return {
    autocomplete,
    suggestions,
    hasSuggestions,
    clear,
  };
}
