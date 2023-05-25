<script setup>
import { useToggle } from "@vueuse/core";
import { useSlots } from "vue";

defineProps({
  label: String,
  labelClass: [Object, String],
  forId: String,
  helpBelow: Boolean,
});

const slots = useSlots();

const [showHelp, toggleHelp] = useToggle();
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

      <span v-if="slots.help" class="cursor-pointer" @click="toggleHelp()">
        <icon
          icon="question"
          fixed-width
          mask="circle"
          transform="shrink-5"
          class="opacity-50 hover:opacity-100"
        />
      </span>
    </component>

    <slot v-if="showHelp && !helpBelow" name="help" />

    <div>
      <slot />
    </div>

    <slot v-if="showHelp && helpBelow" name="help" />
  </section>
</template>

<style></style>
