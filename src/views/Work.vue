<template>
  <div class="p-6">
    <router-link to="/" class="flex items-center">
      &laquo; Tillbaka till sökning
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
      <Term v-for="term in work.terms" :key="term" class="mr-1 mb-1">{{
        term
      }}</Term>
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
          <div class="mt-2">• Göteborg: Biskopsgården</div>
          <div>• Göteborg: Torslanda</div>
          <div>• Göteborg: Stadsbiblioteket</div>
          <div>• Stockholm: Medborgarplatsen</div>
        </Labeled>
      </div>
    </div>
  </div>
</template>

<script setup>
import Labeled from "@/components/Labeled.vue";
import Term from "@/terms/Term.vue";
import { computed, ref } from "@vue/reactivity";
import { get } from "@/services/libris.service";
import { useRoute } from "vue-router";
import { watch } from "@vue/runtime-core";

const TYPE_LABELS = {
  book: "Bok",
};

const route = useRoute();

const work = ref();
const typeLabel = computed(() => work.value && TYPE_LABELS[work.value.type]);

get(route.params.id).then((work_) => (work.value = work_));

// Expose full data to developer console.
if (import.meta.env.DEV) {
  watch(work, () => {
    console.log({ work: work.value });
  });
}
</script>

<style></style>
