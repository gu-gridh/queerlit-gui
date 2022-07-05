<script setup>
defineProps({
  uris: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <ul>
    <li v-for="uri in uris" :key="uri">
      <a :href="uri" target="_blank">
        {{ uri }}
      </a>
    </li>
  </ul>
</template>
