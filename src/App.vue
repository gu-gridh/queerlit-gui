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

        <nav class="text-lg mt-6 mb-4 transition-all duration-500 low:mt-0">
          <router-link
            to="/"
            class="main-nav-link"
            :class="{ 'router-link-active': isTitlesRoute }"
          >
            Titlar
          </router-link>
          <router-link to="/subjects" class="main-nav-link">Ämnen</router-link>
          <a href="https://queerlit.dh.gu.se/om/" class="main-nav-link">Om</a>
        </nav>

        <aside>
          <router-view name="side" />
        </aside>
      </div>
    </div>
    <div class="flex-1 flex flex-col">
      <div class="flex-1">
        <router-view v-if="!is404" />
        <NotFound v-else class="flex-1" />
      </div>

      <ErrorMessage />
      <SiteFooter />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import * as libris from "@/services/libris.service";
import * as terms from "@/services/terms.service";
import * as util from "@/util";
import "@fontsource/barlow-condensed/latin-300.css";
import use404 from "./views/404.composable";
import NotFound from "./views/NotFound.vue";
import ErrorMessage from "./ErrorMessage.vue";
import SiteFooter from "./SiteFooter.vue";

const { is404 } = use404();
const { state } = useStore();
const route = useRoute();

const isTitlesRoute = computed(() => route.fullPath.indexOf("/work") === 0);

// Make internal apis available in browser console.
if (import.meta.env.DEV) {
  window.state = state;
  window.libris = libris;
  window.terms = terms;
  window.util = util;
}
</script>

<style lang="scss" scoped>
.main-nav-link {
  @apply p-1 px-4 mr-1 hover:bg-opacity-25 hover:bg-white rounded-lg transition-all;
}
.main-nav-link.router-link-active {
  @apply bg-white rounded-lg text-gray-800 shadow-lg;
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
