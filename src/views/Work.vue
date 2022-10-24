<template>
  <div class="p-6">
    <router-link to="/" class="flex items-center">
      <icon icon="arrow-left" size="xs" class="mr-1" />
      Tillbaka till sökning
    </router-link>
  </div>
  <div v-if="work" class="container xl:max-w-screen-xl">
    <h2 class="text-3xl">{{ work.title }}</h2>
    <div class="flex justify-between my-4">
      <Labeled label="Författare" class="pr-4">
        {{ work.creators.join(", ") }}
      </Labeled>
      <Labeled label="typ" class="pr-4"> {{ typeLabel }} </Labeled>
      <Labeled label="Utgivningsår" class="pr-4"> {{ work.date }} </Labeled>
    </div>
    <Labeled label="Ämnesord" class="my-4 text-lg">
      <div class="mt-1">
        <Term
          v-for="term in terms.qlit"
          :key="term"
          :data="term"
          class="mr-1 mb-1"
          :options="[
            {
              label: `Sök på <em>${term.prefLabel}</em>`,
              action: () => filterTerm(term),
            },
            {
              label: `Om ämnesordet <em>${term.prefLabel}</em>`,
              action: () => gotoTerm(term),
            },
          ]"
        >
        </Term>
      </div>
      <div class="text-base mt-2">
        <Term
          v-for="term in terms.other"
          :key="term"
          :data="term"
          class="mr-1 mb-1"
          :options="[
            {
              label: `Sök på <em>${term.prefLabel}</em>`,
              action: () => filterTerm(term),
            },
          ]"
        />
      </div>
    </Labeled>
    <Labeled v-if="work.summary" label="Beskrivning" class="my-4">
      {{ work.summary }}
    </Labeled>
    <div v-if="work.librisUrl" class="my-4">
      <a :href="work.librisUrl" class="text-blue-700 underline">
        Mer info i LIBRIS
      </a>
    </div>
    <div class="flex my-4">
      <div class="flex-1 mr-4 border p-4">
        <Labeled label="Mer om titeln">
          <div class="mt-2">• Wikipedia</div>
          <div>
            •
            <a
              href="https://digitaltperspektiv.firebaseapp.com/fokus/drottningens-juvelsmycke/hem"
              >Digitalt perspektiv</a
            >
          </div>
          <div>
            •
            <span class="italic"
              >Drottningens juvelsmycke, en kärlekens fuga</span
            >, artikel av Eva Borgström
          </div>
          <div>• Recension av Lennart Bromander</div>
          <div>• Litteraturbanken</div>
        </Labeled>
      </div>
      <div class="flex-1 mr-4 border p-4">
        <Labeled label="Mer om författaren">
          <div class="mt-2">• Fler verk</div>
          <div>• Wikipedia</div>
        </Labeled>
      </div>
      <div class="flex-1 border p-4">
        <Labeled label="Finns på">
          <ul class="mt-2">
            <li v-for="library in workLibraries" :key="library['@id']">
              {{ library.name }}
            </li>
          </ul>
        </Labeled>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { get, getLibraries } from "@/services/libris.service";
import { useRoute, useRouter } from "vue-router";
import { watch } from "@vue/runtime-core";
import useTerms from "@/terms/terms.composable";
import Labeled from "@/components/Labeled.vue";
import Term from "@/terms/Term.vue";
import useTitle from "./title.composable";
import use404 from "./404.composable";

const TYPE_LABELS = {
  book: "Bok",
};

const store = useStore();
const router = useRouter();
const route = useRoute();
const { add, sortTerms } = useTerms();
const { flag404 } = use404();

const work = ref();
const allLibraries = ref([]);
const typeLabel = computed(() => work.value && TYPE_LABELS[work.value.type]);
const terms = computed(() => sortTerms(work.value?.terms));
const workLibraries = computed(() =>
  allLibraries.value.filter((library) =>
    work.value?.libraries?.includes(library["@id"])
  )
);
useTitle(computed(() => work.value && work.value.title));

get(route.params.id)
  .then((work_) => (work.value = work_))
  .catch(flag404);
getLibraries().then((libraries) => (allLibraries.value = libraries));

// Expose full data to developer console.
if (import.meta.env.DEV) {
  watch(work, () => {
    console.log("work", { ...work.value });
    window.work = work.value;
  });
}

function filterTerm(term) {
  add(term);
  store.dispatch("search");
  router.push("/");
}

function gotoTerm(term) {
  router.push(`/subjects/${term.name}`);
}
</script>

<style scoped>
ul li::before {
  content: "• ";
}
</style>
