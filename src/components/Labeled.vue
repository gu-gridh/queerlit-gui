<template>
  <section>
    <header class="font-label uppercase font-medium text-xs">
      {{ label }}
    </header>
    <div>
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({ label: String });
</script>

<style></style>
