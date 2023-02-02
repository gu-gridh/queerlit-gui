import { useStore } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";
import intersectionBy from "lodash/intersectionBy";
import useQuery from "./query.composable";
import works from "@/assets/local-works.yaml";

// Harmonize local entries.
Object.keys(works).forEach((id) => {
  const work = works[id];
  work.id = id;
  work.date = Number.isInteger(work.date)
    ? { label: String(work.date), min: work.date, max: work.date }
    : work.date;
  work.date.label = work.date.label || `${work.date.min}–${work.date.max}`;
  work.genreform = [];
  work.classification = [];
  work.terms = (work.terms || []).map((term) => ({
    _label: term.prefLabel,
    inScheme: { "@id": "https://queerlit.dh.gu.se/qlit/v1" },
    ...term,
  }));
});

/** Simple algorithm matching a search string against a text value. */
const matchText = (v, s) => v.toLowerCase().includes(s.trim().toLowerCase());

/** Extract text values from a local work entry into one string. */
const getWorkText = (work) =>
  [
    work.title,
    work.motivation,
    ...work.creators.map((c) => `${c.name} ${c.lifeSpan}`),
    ...work.terms.map((term) => term.prefLabel),
    ...Object.values(work.date),
  ].join(" ");

export default function useLocalWorks() {
  const { text, terms, title, yearStart, yearEnd, author, genreform } =
    useQuery();
  const { commit } = useStore();

  function searchLocal() {
    const results = cloneDeep(Object.values(works));

    const filter = (isMatch) => remove(results, (work) => !isMatch(work));

    // Match free-text filter against any field.
    if (text.value) {
      filter((work) => matchText(getWorkText(work), text.value));
    }

    // At least one term must match.
    if (terms.value.length) {
      filter((work) => intersectionBy(work.terms, terms.value, "@id").length);
    }

    if (title.value) {
      filter((work) => matchText(work.title, title.value));
    }

    // Work end year cannot be less than the filter start year.
    if (yearStart.value) {
      filter((work) => work.date.max >= yearStart.value);
    }

    // Work start year cannot be more than the filter end year.
    if (yearEnd.value) {
      filter((work) => work.date.min <= yearEnd.value);
    }

    // We cannot really handle these filters, so return no results.
    if (author.value || genreform.value) {
      filter(() => false);
    }

    commit("setLocalResults", results);
  }

  return {
    searchLocal,
    works,
  };
}
