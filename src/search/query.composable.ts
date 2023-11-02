import useQueryStore from "@/stores/query.store";
import type { Person } from "@/services/libris.types";
import type { GenreForm } from "@/types/work";
import { storeToRefs } from "pinia";

export default function useQuery() {
  const queryStore = useQueryStore();

  const getPersonLabel = (item: Person) =>
    [item.givenName, item.familyName, item.name].filter(Boolean).join(" ") +
    (item.lifeSpan ? ` (${item.lifeSpan})` : "");

  const getGenreformLabel = (item: GenreForm) =>
    item.primary ? item.label : `${item.label} (${item.schemeCode})`;

  return {
    ...storeToRefs(queryStore),
    getPersonLabel,
    getGenreformLabel,
  };
}
