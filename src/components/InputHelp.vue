<script setup lang="ts">
defineEmits<{
  dismiss: [];
}>();
</script>

<template>
  <div class="relative my-1 bg-amber-50 border border-amber-200 px-1 text-sm">
    <div
      class="float-right z-10 m-1.5 mr-0.5 opacity-70 cursor-pointer"
      @click="$emit('dismiss')"
    >
      <icon icon="times" size="sm" class="block" />
    </div>

    <slot />
  </div>
</template>
