<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";

const [showOptions, toggleOptions] = useToggle();
</script>

<template>
  <div class="inline-block relative">
    <div
      v-on-click-outside="() => toggleOptions(false)"
      @click.prevent.stop="toggleOptions()"
    >
      <slot />
    </div>
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div
        v-if="showOptions"
        class="absolute z-10 h-0 bottom-0 left-0 duration-200 w-full"
      >
        <slot name="menu" />
      </div>
    </Transition>
  </div>
</template>
