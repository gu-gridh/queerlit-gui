<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "./store";

const store = useStore(key);

const error = computed(() => store.state.error);
</script>

<template>
  <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
    <div
      v-if="error"
      class="absolute top-10 left-0 right-0 flex justify-center duration-500"
    >
      <div
        class="mx-auto bg-red-400 text-white text-lg p-2 px-4 rounded-lg shadow-lg"
      >
        {{ error }}
      </div>
    </div>
  </Transition>
</template>

<style></style>
