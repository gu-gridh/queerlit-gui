<script setup>
import { ref, watchEffect } from "vue";
import { compareEmptyLast, urlBasename } from "@/util";
import { getLcshLabel } from "@/services/lcsh.service";

const props = defineProps({
  terms: {
    type: Array,
    required: true,
    validator: (terms) => terms.every((term) => term.uri),
  },
});

const termsEnriched = ref(null);

watchEffect(async () => {
  termsEnriched.value = (await Promise.all(props.terms.map(enrichTerm)))
    .sort((a, b) => String(a.prefLabel).localeCompare(b.prefLabel))
    .sort((a, b) => compareEmptyLast(a.scheme, b.scheme));
});

async function enrichTerm(term) {
  term = { ...term };

  if (term.uri.indexOf("https://homosaurus.org/") == 0)
    term.scheme = "Homosaurus";

  if (term.uri.indexOf("https://id.kb.se/term/sao/") == 0) {
    term.scheme = "SAO";
    term.prefLabel = urlBasename(term.uri);
  }

  if (term.uri.indexOf("https://id.kb.se/term/barn/") == 0) {
    term.scheme = "Barnämnesord";
    term.prefLabel = urlBasename(term.uri);
  }

  if (term.uri.indexOf("http://id.loc.gov/authorities/subjects/") == 0) {
    term.scheme = "LCSH";
    term.prefLabel = await getLcshLabel(term.uri);
  }

  return term;
}
</script>

<template>
  <ul>
    <li v-for="term in termsEnriched" :key="term.uri">
      <a :href="term.uri" target="_blank">
        <template v-if="term.scheme && term.prefLabel">
          {{ term.scheme }}: {{ term.prefLabel }}
        </template>
        <span v-else class="break-all">
          {{ term.uri }}
        </span>
      </a>
    </li>
  </ul>
</template>
