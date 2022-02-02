<template>
  <div class="flex-1 flex flex-col lg:flex-row">
    <router-view />
  </div>
</template>

<script setup>
import * as libris from "@/services/libris";
import * as terms from "@/services/terms";
import "@fontsource/barlow-condensed/300.css";

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
