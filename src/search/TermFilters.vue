<script setup>
import { computed } from "vue";
import Labeled from "@/components/Labeled.vue";
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
  <Labeled label="Ämnen">
    <CollectionsSmall />

    <Labeled label="Centrala ämnesord" for-id="terms">
      <TermCombobox
        :terms="terms"
        input-id="terms"
        help="Sök efter ord från QLIT, Queerlits ämnesordslista, som är centrala i verket"
        class="mb-4"
        @add="add"
        @remove="remove"
      />
    </Labeled>

    <Labeled label="Perifera ämnesord" for-id="terms-secondary">
      <TermCombobox
        :terms="termsSecondary"
        :secondary="true"
        input-id="terms-secondary"
        help="Sök efter ord från QLIT, Queerlits ämnesordslista, som är perifera i verket"
        class="mb-4"
        @add="addSecondary"
        @remove="removeSecondary"
      />
    </Labeled>

    <div class="mb-4">
      <input id="hierarchical" v-model="hierarchicalModel" type="checkbox" />
      <label for="hierarchical"> Träffa även på smalare ämnesord</label>
    </div>
  </Labeled>
</template>
