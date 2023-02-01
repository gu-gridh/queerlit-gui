import { useStore } from "vuex";
import works from "@/assets/local-works.yaml";
import useQuery from "./query.composable";
import cloneDeep from "lodash/cloneDeep";

Object.keys(works).forEach((id) => {
  const work = works[id];
  work.id = id;
  work.genreform = [];
  work.classification = [];
  work.terms.forEach((term) => {
    term._label = term.prefLabel;
  });
});

export default function useLocalWorks() {
  const { text } = useQuery();
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
