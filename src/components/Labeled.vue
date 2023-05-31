<script setup>
defineProps({
  label: String,
  labelClass: [Object, String],
  forId: String,
});
</script>

<template>
  <section>
    <component
      :is="forId ? 'label' : 'header'"
      :for="forId || undefined"
      class="block font-label uppercase font-medium text-xs"
      :class="labelClass"
    >
      {{ label }}
    </component>

    <div>
      <slot />
    </div>
  </section>
</template>

<style></style>
