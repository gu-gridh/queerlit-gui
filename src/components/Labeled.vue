<template>
  <div>
    <div class="font-label uppercase font-medium text-xs">{{ label }}</div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ label: String });
</script>

<style></style>
