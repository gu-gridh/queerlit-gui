import { useStore } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";
import intersectionBy from "lodash/intersectionBy";
import { enarray } from "@/util";
import useQuery from "./query.composable";
import works from "@/assets/local-works.yaml";

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
  const { text, terms } = useQuery();
  const { commit } = useStore();

  function searchLocal() {
    const results = cloneDeep(Object.values(works));

    function filterResults(props, f) {
      remove(results, (work) => !enarray(props).some((prop) => f(work[prop])));
    }

    // TODO Apply query
    if (text.value) {
      filterResults(["title", "motivation"], (v) =>
        v.toLowerCase().includes(text.value.trim().toLowerCase())
      );
    }

    if (terms.value.length) {
      filterResults(
        "terms",
        (workTerms) => intersectionBy(terms.value, workTerms, "@id").length
      );
    }

    commit("setLocalResults", results);
  }

  return {
    searchLocal,
    works,
  };
}
