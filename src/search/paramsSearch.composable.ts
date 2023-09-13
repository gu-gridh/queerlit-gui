import { watch } from "vue";
import { useUrlSearchParams, type UrlParams } from "@vueuse/core";
import useQuery from "./query.composable";

// All strings. Just declare whether multiple or not.
type Params = UrlParams & {
  text: string;
  yearStart: string;
  yearEnd: string;
};

// TODO After switching to Pinia, rewrite to make the store use `useUrlSearchParams` directly.
export default function useParamsSearch() {
  const { text, yearStart, yearEnd, serializedQuery, setQuery } = useQuery();
  const params = useUrlSearchParams<Params>("history", {
    removeFalsyValues: true,
  });

  // Sync from store to url
  watch(
    serializedQuery,
    (to, from) => {
      console.log("watch store", to);
      if (to == from) {
        console.warn(to, from);
        return;
      }
      Object.assign(params, {
        text: text.value,
        yearStart: String(yearStart.value || ""),
        yearEnd: String(yearEnd.value || ""),
      });
    },
    { deep: true },
  );

  // TODO When we do `router.push("/")` we lose the params.
  watch(
    params,
    () => {
      console.log("watch params", { ...params });
      setQuery({
        text: params.text as string | undefined,
        yearStart: Number(params.yearStart) || null,
        yearEnd: Number(params.yearEnd) || null,
      });
    },
    { deep: true, immediate: true },
  );
}
