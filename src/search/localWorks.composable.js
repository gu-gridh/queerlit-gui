import { useStore } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";
import intersectionBy from "lodash/intersectionBy";
import useQuery from "./query.composable";
import worksRaw from "@/assets/local-works.yaml";

// Harmonize local entries.
const works = Object.keys(worksRaw).map((id) => {
  const work = worksRaw[id];

  const date = Number.isInteger(work.date)
    ? { label: String(work.date), min: work.date, max: work.date }
    : work.date;
  date.label = date.label || `${date.min}–${date.max}`;

  const inflateTerm = ([uri, prefLabel]) => ({
    "@id": uri,
    prefLabel,
    _label: prefLabel,
    // Works as long as term uri = scheme uri + a name
    inScheme: { "@id": uri.replace(/\/[^/]*$/, "") },
  });

  const terms = Object.entries(work.terms || {}).map(inflateTerm);
  const genreform = Object.entries(work.genreform || {}).map(inflateTerm);

  return {
    id,
    ...work,
    creators: work.creators || [],
    date,
    classification: [],
    terms,
    genreform,
  };
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
    ...work.genreform.map((genreform) => genreform.prefLabel),
    ...Object.values(work.date),
  ].join(" ");

export default function useLocalWorks() {
  const {
    text,
    terms,
    termsSecondary,
    title,
    yearStart,
    yearEnd,
    author,
    genreform,
  } = useQuery();
  const { commit, state } = useStore();

  function searchLocal() {
    const results = cloneDeep(Object.values(works));

    const filter = (isMatch) => remove(results, (work) => !isMatch(work));

    // Match free-text filter against any field.
    if (text.value) {
      // We don't handle special characters.
      // Since we don't match whole words anyway, stripping wildcards solves some of the cases.
      const textValue = text.value.replaceAll(/[*?]/g, "");
      filter((work) => matchText(getWorkText(work), textValue));
    }

    // All terms must match.
    if (terms.value.length) {
      filter(
        (work) =>
          intersectionBy(work.terms, terms.value, "@id").length ==
          terms.value.length
      );
    }
    if (termsSecondary.value.length) {
      filter(() => false);
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

    // Sort by title if specified, otherwise date.
    if (state.sort.includes("sortKeyByLang.sv")) {
      results.sort((a, b) => a.title.localeCompare(b.title, "sv"));
    } else {
      results.sort((a, b) => a.date.min - b.date.min);
    }

    // Ascending/descending
    if (!state.sort || state.sort.indexOf("-") === 0) {
      results.reverse();
    }

    commit("setLocalResults", results);
    commit("patchHistogram", createHistogram(results));
  }

  function createHistogram(results) {
    const histogram = {};
    for (const work of results) {
      histogram[work.date.min] = (histogram[work.date.min] || 0) + 1;
    }
    return histogram;
  }

  const getLocal = (id) => works.find((work) => work.id == id);

  return {
    searchLocal,
    works,
    getLocal,
  };
}
