<template>
  <router-link :to="`/verk/${work.id}`" class="block">
    <article
      class="
        border-b border-dashed border-black
        p-4
        transition-color
        flex
        items-baseline
        hover:bg-smoke-100
      "
    >
      <div
        class="tabular-nums w-6 mr-2 font-thin text-2xl"
        :class="{ 'w-8': i > 80, 'w-10': i > 980 }"
      >
        {{ i }}.
      </div>
      <div class="flex-1">
        <div class="flex flex-wrap items-baseline gap-x-6 mb-2">
          <h3 class="w-64 flex-grow mb-1 text-xl group-hover:underline">
            {{ work.title }}
          </h3>

          <div class="w-48 flex-grow">
            <div class="flex flex-wrap">
              <div v-for="creator in work.creators" :key="creator" class="mr-4">
                {{ creator }}
              </div>
            </div>
            {{ work.date }}
          </div>
        </div>

        <div v-if="terms.qlit.length" class="mt-2">
          <Term
            v-for="term in terms.qlit"
            :key="term"
            :data="term"
            class="mr-1 mb-2"
            :options="[
              {
                label: `Sök på <em>${term._label}</em>`,
                action: () => filterTerm(term),
              },
              {
                label: `Om ämnesordet <em>${term._label}</em>`,
                action: () => gotoTerm(term),
              },
            ]"
          />
        </div>

        <div v-if="terms.other.length" class="mb-2 text-sm">
          <Term
            v-for="term in terms.other"
            :key="term"
            :data="term"
            class="mr-1 mb-2"
            :options="
              term['@id'] && [
                {
                  label: `Sök på <em>${term._label}</em>`,
                  action: () => filterTerm(term),
                },
              ]
            "
          />
        </div>

        <div v-if="work.summary" class="my-2 text-sm">
          {{ ellipsis(work.summary, 80) }}
        </div>
      </div>
    </article>
  </router-link>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import Term from "@/terms/Term.vue";
import useTerms from "@/terms/terms.composable";
import { useRouter } from "vue-router";

const props = defineProps({
  work: { type: Object, required: true },
  i: { type: Number, required: true },
});

const { add, sortTerms } = useTerms();
const store = useStore();
const router = useRouter();

function ellipsis(text, limit) {
  if (text.length < limit) return text;
  // 1. Truncate; 2. Strip possibly incomplete trailing word; 3. Add ellipsis
  return text
    .substring(0, 200)
    .replace(/\p{L}+$/u, "")
    .replace(/\P{L}$/u, "…");
}

const terms = computed(() => sortTerms(props.work.terms));

function filterTerm(term) {
  add(term);
  store.dispatch("search");
}

function gotoTerm(term) {
  router.push(`/${term.name}`);
}
</script>

<style></style>
