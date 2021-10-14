<template>
  <div>
    <div class="uppercase text-sm">{{ label }}</div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
const { label } = defineProps({ label: String });
</script>

<style></style>
