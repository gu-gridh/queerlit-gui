<template>
  <section>
    <header
      class="font-label uppercase font-medium text-xs"
      :class="labelClass"
    >
      {{ label }}
    </header>
    <div>
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({ label: String, labelClass: [Object, String] });
</script>

<style></style>
