<script setup lang="ts">
import { computed } from "vue";
import useTerms from "@/terms/terms.composable";
import CollectionsSmall from "@/terms/CollectionsSmall.vue";
import TermCombobox from "@/terms/TermCombobox.vue";

const {
  terms,
  add,
  remove,
  termsSecondary,
  addSecondary,
  removeSecondary,
  hierarchical,
  toggleHierarchical,
} = useTerms();

const hierarchicalModel = computed({
  get: () => hierarchical.value,
  set: (v) => toggleHierarchical(v),
});
</script>

<template>
  <div>
    <CollectionsSmall />

    <div class="bg-smoke-200 rounded flow-root relative">
      <TermCombobox
        label="Centrala ämnesord"
        :terms="terms"
        input-id="terms"
        help="Sök efter ord från QLIT, Queerlits ämnesordslista, som är centrala i verket.
          Allmän praxis är att använda ämnesord enbart för centrala teman."
        @add="add"
        @remove="remove"
      />

      <TermCombobox
        label="Perifera ämnesord"
        :terms="termsSecondary"
        :secondary="true"
        input-id="terms-secondary"
        help="Sök efter ord från QLIT, Queerlits ämnesordslista, som är perifera i verket.
          Genom att använda ämnesord för perifera teman avviker Queerlit från allmän praxis.
          Därför finns det vissa tekniska begränsningar som innebär att du måste välja om du vill söka på ett ämnesord som centralt eller perifert."
        @add="addSecondary"
        @remove="removeSecondary"
      />

      <div
        class="shadow-inner absolute h-full w-full top-0 pointer-events-none"
      />
    </div>

    <div>
      <input id="hierarchical" v-model="hierarchicalModel" type="checkbox" />
      <label for="hierarchical"> Träffa även på smalare ämnesord</label>
    </div>
  </div>
</template>
