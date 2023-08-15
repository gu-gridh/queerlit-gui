<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { QlitCollection } from "@/services/qlit.types";
import { getCollections } from "@/services/terms.service";

defineProps<{
  selected: string[];
}>();

const emit = defineEmits<{
  select: [QlitCollection];
}>();

const collections = ref<QlitCollection[]>();

watchEffect(async () => (collections.value = await getCollections()));
</script>

<template>
  <div class="flex flex-wrap justify-center -mx-1 text-center">
    <div
      v-for="collection in collections"
      :key="collection.id"
      class="w-1/2 sm:w-1/3 p-1"
    >
      <div
        class="p-2 px-4 bg-amber-300 hover:brightness-105 transition-all shadow rounded-lg h-full flex justify-center items-center cursor-pointer"
        :class="{
          'bg-amber-400 shadow-lg': selected?.includes(collection.name),
        }"
        @click="emit('select', collection)"
      >
        {{ collection.label }}
      </div>
    </div>
  </div>
</template>
