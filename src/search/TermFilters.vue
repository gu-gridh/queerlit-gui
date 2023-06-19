<script setup>
import Labeled from "@/components/Labeled.vue";
import useTerms from "@/terms/terms.composable";
import CollectionsSmall from "@/terms/CollectionsSmall.vue";
import TermCombobox from "@/terms/TermCombobox.vue";

const { terms, add, remove, termsSecondary, addSecondary, removeSecondary } =
  useTerms();
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
        input-id="terms-secondary"
        help="Sök efter ord från QLIT, Queerlits ämnesordslista, som är perifera i verket"
        class="mb-4"
        @add="addSecondary"
        @remove="removeSecondary"
      />
    </Labeled>
  </Labeled>
</template>
