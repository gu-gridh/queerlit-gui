<script setup lang="ts">
import { ref, watchEffect, type PropType } from "vue";
import { compareEmptyLast, urlBasename } from "@/util";
import { getLcshLabel } from "@/services/lcsh.service";
import type { HasUri } from "./terms.types";

const props = defineProps({
  terms: {
    type: Array as PropType<HasUri[]>,
    required: true,
    validator: (terms: any[]) => terms.every((term) => term.uri),
  },
});

type EnrichedTerm = HasUri & { scheme?: string; prefLabel?: string };

const termsEnriched = ref<EnrichedTerm[]>([]);

watchEffect(async () => {
  termsEnriched.value = (await Promise.all(props.terms.map(enrichTerm)))
    .sort((a, b) => String(a.prefLabel).localeCompare(String(b.prefLabel)))
    .sort((a, b) => compareEmptyLast(a.scheme, b.scheme));
});

async function enrichTerm(term: HasUri) {
  const enriched: EnrichedTerm = { ...term };

  if (term.uri.indexOf("https://homosaurus.org/") == 0)
    enriched.scheme = "Homosaurus";

  if (term.uri.indexOf("https://id.kb.se/term/sao/") == 0) {
    enriched.scheme = "SAO";
    enriched.prefLabel = urlBasename(term.uri);
  }

  if (term.uri.indexOf("https://id.kb.se/term/barn/") == 0) {
    enriched.scheme = "Barnämnesord";
    enriched.prefLabel = urlBasename(term.uri);
  }

  if (term.uri.indexOf("http://id.loc.gov/authorities/subjects/") == 0) {
    enriched.scheme = "LCSH";
    enriched.prefLabel =
      (await getLcshLabel(term.uri)) || urlBasename(term.uri);
  }

  return enriched;
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
