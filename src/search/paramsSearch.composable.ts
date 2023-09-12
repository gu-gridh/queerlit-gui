import { watch } from "vue";
import { useUrlSearchParams } from "@vueuse/core";
import useQuery from "./query.composable";

export default function useParamsSearch() {
  const { text, yearStart, yearEnd, serializedQuery } = useQuery();

  const params = useUrlSearchParams("history", { removeFalsyValues: true });

  // Sync from store to url
  watch(
    serializedQuery,
    () => {
      Object.assign(params, {
        text: text.value,
        yearStart: String(yearStart.value || ""),
        yearEnd: String(yearEnd.value || ""),
      });
    },
    { deep: true },
  );
}
