import { useStore } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";
import intersectionBy from "lodash/intersectionBy";
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
  const { text, terms, title, yearStart, yearEnd } = useQuery();
  const { commit } = useStore();

  function searchLocal() {
    const results = cloneDeep(Object.values(works));

    const matchText = (v, s) =>
      v.toLowerCase().includes(s.trim().toLowerCase());

    if (text.value) {
      remove(results, (work) => {
        const workText = [
          work.title,
          work.motivation,
          ...work.creators.map((c) => `${c.name} ${c.lifeSpan}`),
          ...work.terms.map((term) => term.prefLabel),
          ...work.date,
        ].join(" ");
        return !matchText(workText, text.value);
      });
    }

    if (terms.value.length) {
      remove(
        results,
        (work) => !intersectionBy(work.terms, terms.value, "@id").length
      );
    }

    if (title.value) {
      remove(results, (work) => !matchText(work.title, title.value));
    }

    if (yearStart.value) {
      remove(results, (work) => work.date[1] < yearStart.value);
    }

    if (yearEnd.value) {
      remove(results, (work) => work.date[0] > yearEnd.value);
    }

    commit("setLocalResults", results);
  }

  return {
    searchLocal,
    works,
  };
}
