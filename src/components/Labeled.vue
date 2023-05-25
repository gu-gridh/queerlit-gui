<template>
  <section>
    <header
      class="font-label uppercase font-medium text-xs"
      :class="labelClass"
    >
      <label v-if="forId" :for="forId" class="block">{{ label }}</label>
      <template v-else>{{ label }}</template>
    </header>
    <div>
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({ label: String, labelClass: [Object, String], forId: String });
</script>

<style></style>
