import { watch } from "vue";
import { useUrlSearchParams, type UrlParams } from "@vueuse/core";
import useQuery from "./query.composable";
import { useRoute } from "vue-router";

// All strings. Just declare whether multiple or not.
type Params = UrlParams & {
  text: string;
  yearStart: string;
  yearEnd: string;
};

// TODO After switching to Pinia, rewrite to make the store use `useUrlSearchParams` directly.
export default function useParamsSearch() {
  const { text, yearStart, yearEnd, serializedQuery, setQuery } = useQuery();
  const route = useRoute();
  const params = useUrlSearchParams<Params>("history", {
    removeFalsyValues: true,
  });

  const syncStoreToUrl = () => {
    Object.assign(params, {
      text: text.value,
      yearStart: String(yearStart.value || ""),
      yearEnd: String(yearEnd.value || ""),
    });
    console.log("syncing store to url, params:", { ...params });
  };

  function syncUrlToStore() {
    console.log("syncing url to store");
    setQuery({
      text: params.text as string | undefined,
      yearStart: Number(params.yearStart) || null,
      yearEnd: Number(params.yearEnd) || null,
    });
  }

  // Call this only once, app-wide.
  function activateParamsSearch() {
    // Sync from store to url
    watch(serializedQuery, () => {
      console.log("watch store");
      syncStoreToUrl();
    });
    // watch(route, () => {
    //   console.log("watch route", route.path);
    //   if (route.path == "/") setTimeout(syncStoreToUrl, 1000);
    // });

    // TODO When we do `router.push("/")` we lose the params.
    watch(
      params,
      () => {
        console.log("watch params", { ...params });
        syncUrlToStore();
      },
      { deep: true, immediate: true },
    );
  }

  return {
    syncStoreToUrl,
    syncUrlToStore,
    activateParamsSearch,
  };
}
