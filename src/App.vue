<template>
  <Header />
  <div class="flex-1 flex flex-col">
    <router-view />
  </div>
</template>

<script setup>
import * as libris from "@/services/libris";
import * as terms from "@/services/terms";
import Header from "@/components/PageHeader.vue";
import "@fontsource/barlow-condensed";

if (import.meta.env.DEV) {
  window.libris = libris;
  window.terms = terms;
}
</script>

<style>
html {
  font-size: 14pt;
}

#app {
  color: #2c3e50;
}
</style>
