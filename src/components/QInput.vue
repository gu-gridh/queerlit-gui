<script setup>
defineProps(["modelValue", "input-id", "search", "is-incomplete", "has-value"]);
defineEmits(["update:modelValue", "focus"]);
</script>

<template>
  <div
    class="
      w-full
      flex
      items-center
      py-1
      px-2
      rounded
      text-text text-xl
      shadow-inner
      leading-snug
      transition-colors
    "
    :class="[
      isIncomplete ? 'incomplete' : null,
      hasValue ? 'bg-blue-100' : 'bg-smoke-200 hover:bg-smoke-300',
    ]"
  >
    <input
      :value="modelValue"
      :type="search ? 'search' : undefined"
      autocomplete="off"
      class="flex-1 bg-transparent"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('focus', $event.target.value)"
    />

    <!-- <ToggleIcon icon="question" :value="showHelp" :toggle="toggleHelp" /> -->
  </div>
</template>

<style scoped>
::placeholder {
  font-size: 16px;
}
.incomplete:not(:has(:focus)) {
  @apply bg-red-100;
}
</style>
