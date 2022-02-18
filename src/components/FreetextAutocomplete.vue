<script setup>
import Term from "@/components/Term.vue";
const props = defineProps(["terms"]);
const emit = defineEmits(["chooseTerm"]);
</script>

<template>
  <div
    v-if="terms.length"
    class="absolute top-0 bg-white shadow rounded-b w-full overflow-hidden"
  >
    <div class="text-sm m-2">Sök på ämnesord:</div>
    <div class="my-2 overflow-x-auto whitespace-nowrap">
      <Term
        v-for="{ term } in terms"
        :key="term.id"
        class="mx-2"
        @click="emit('chooseTerm', term)"
      >
        {{ term.label }}
        <icon icon="plus" size="xs" />
      </Term>
    </div>
    <div class="text-sm m-2">Sök på ämnesord:</div>
  </div>
</template>
