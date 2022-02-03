<template>
  <div class="flex-1 flex flex-col lg:flex-row">
    <div class="lg:w-1/2 lg:max-w-screen-sm"></div>
    <div
      class="
        bg-gray-300
        text-gray-600
        lg:w-1/2 lg:max-w-screen-sm lg:fixed lg:h-full
        overflow-y-auto
      "
    >
      <header>
        <div class="container max-w-screen-md py-8">
          <router-link to="/" class="flex-1">
            <h1 class="text-7xl font-thin">Queerlit</h1>
          </router-link>
        </div>
      </header>

      <nav class="main-nav container text-lg mt-6">
        <router-link to="/" class="p-1 px-4 mr-1">Sök</router-link>
        <router-link to="/ao" class="p-1 px-4 mr-1">Tesaurus</router-link>
        <a href="https://queerlit.dh.gu.se/om/" class="p-1 px-4 mr-1">Om</a>
      </nav>

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
import "@fontsource/barlow-condensed/300.css";

// Make internal apis available in browser console.
if (import.meta.env.DEV) {
  window.libris = libris;
  window.terms = terms;
}
</script>

<style lang="scss" scoped>
.main-nav .router-link-active {
  @apply bg-white rounded-lg text-gray-800;
}
</style>

<style>
html {
  font-size: 14pt;
}

#app {
  color: #2c3e50;
}
</style>
