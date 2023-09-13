<script setup lang="ts">
import useRootStore from "@/stores/root.store";

const store = useRootStore();
</script>

<template>
  <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
    <div
      v-if="store.error"
      class="absolute top-10 left-0 right-0 flex justify-center duration-500"
    >
      <div
        class="mx-auto bg-red-400 text-white text-lg p-2 px-4 rounded-lg shadow-lg"
      >
        {{ store.error }}
      </div>
    </div>
  </Transition>
</template>

<style></style>
