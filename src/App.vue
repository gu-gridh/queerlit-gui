<template>
  <div class="flex-1 flex flex-col lg:flex-row">
    <div class="lg:w-1/2 lg:max-w-screen-sm"></div>
    <div
      class="
        bg-pink-50
        text-gray-600
        lg:w-1/2 lg:max-w-screen-sm lg:fixed
        h-full
        overflow-y-auto
      "
    >
      <PageHeader />
      <router-view name="side" />
    </div>
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import * as libris from "@/services/libris";
import * as terms from "@/services/terms";
import PageHeader from "./components/PageHeader.vue";
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
