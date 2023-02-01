import { useStore } from "vuex";
import works from "@/assets/local-works.yaml";
import useQuery from "./query.composable";
import cloneDeep from "lodash/cloneDeep";

Object.values(works).forEach((work) => {
  work.genreform = [];
  work.classification = [];
  work.terms.forEach((term) => {
    term._label = term.prefLabel;
  });
});

export default function useLocalWorks() {
  const { query } = useQuery();
  const { commit } = useStore();

  function searchLocal() {
    // TODO Apply query
    commit("setLocalResults", cloneDeep(works));
  }

  return {
    searchLocal,
    works,
  };
}
