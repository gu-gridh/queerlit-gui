<template>
  <div class="flex-1 flex flex-col lg:flex-row text-text">
    <div class="lg:w-1/2 lg:max-w-screen-sm"></div>
    <div
      class="
        bg-smoke-500
        lg:w-1/2 lg:max-w-screen-sm lg:fixed lg:h-full
        overflow-y-auto
      "
    >
      <div class="container py-12">
        <header class="max-w-screen-md pb-8">
          <router-link to="/" class="flex-1">
            <img
              src="@/assets/qlogo.svg"
              class="
                ml-2
                mt-6
                h-24
                transition-all
                duration-500
                low:mt-0 low:h-14
              "
            />
          </router-link>
        </header>

        <nav
          class="
            main-nav
            text-lg
            mt-6
            mb-4
            transition-all
            duration-500
            low:mt-0
          "
        >
          <router-link to="/" class="p-1 px-4 mr-1">Sök</router-link>
          <router-link to="/ao" class="p-1 px-4 mr-1">Tesaurus</router-link>
          <a href="https://queerlit.dh.gu.se/om/" class="p-1 px-4 mr-1">Om</a>
        </nav>

        <div class="bg-white rounded-xl shadow-lg">
          <router-view name="side" />
        </div>
      </div>
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

*:focus {
  outline: none !important;
}

::placeholder {
  color: #666666 !important;
  /* font-size: inherit; */
}
</style>
