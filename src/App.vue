<template>
  <div class="flex-1 bg-smoke-500 dark:bg-smoke-800"></div>

  <div class="w-full max-w-screen-high flex flex-col lg:flex-row text-text">
    <div class="lg:w-1/2 lg:max-w-screen-sm">
      <!--
        This empty element has the same width as the sidebar,
        and pushes main content out from the left border.
        The sidebar won't do that because it is fixed.
        This allows scrolling sidebar and main content separately.
      -->
    </div>

    <div
      class="bg-smoke-500 dark:bg-smoke-800 dark:text-smoke-300 lg:w-1/2 lg:max-w-screen-sm lg:fixed lg:h-full overflow-y-auto"
    >
      <nav class="container py-12">
        <header class="max-w-screen-md pb-8">
          <router-link to="/" class="flex-1" @click="reset">
            <img
              src="@/assets/qlogo.svg"
              class="ml-2 mt-6 h-24 transition-all duration-500 low:mt-0 low:h-14"
            />
          </router-link>
        </header>

        <div class="text-lg mt-6 mb-4 transition-all duration-500 low:mt-0">
          <router-link
            to="/"
            class="main-nav-link"
            :class="{ 'router-link-active': isTitlesRoute }"
          >
            Titlar
          </router-link>
          <router-link to="/subjects" class="main-nav-link">Ämnen</router-link>
          <a href="https://queerlit.dh.gu.se/om/" class="main-nav-link">Om</a>
          <a href="https://queerlit.dh.gu.se/om/kontakt" class="main-nav-link">
            Kontakt
          </a>
        </div>

        <section>
          <router-view name="side" />
        </section>
      </nav>
    </div>

    <div class="flex-1 dark:bg-stone-900 dark:text-stone-400 flex flex-col">
      <section class="flex-1">
        <router-view v-if="!is404" />
        <NotFound v-else class="flex-1" />
      </section>

      <ErrorMessage />
      <SiteFooter />
    </div>
  </div>

  <div class="flex-1 dark:bg-stone-900 dark:text-stone-400"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useHead } from "@unhead/vue";
import {
  useSchemaOrg,
  defineOrganization,
  defineWebSite,
} from "@unhead/schema-org";
import * as libris from "@/services/libris.service";
import * as terms from "@/services/terms.service";
import * as util from "@/util";
import "@fontsource/barlow-condensed/300.css";
import useRootStore from "@/stores/root.store";
import useQueryStore from "@/stores/query.store";
import useHistory from "./views/history.composable";
import use404 from "./views/404.composable";
import NotFound from "./views/NotFound.vue";
import ErrorMessage from "./ErrorMessage.vue";
import SiteFooter from "./SiteFooter.vue";
import useSearch from "./search/search.composable";

const siteDescription =
  "Queerlit är en databas för svensk skönlitteratur som skildrar samkönat begär och överskridanden av binära könsnormer.";

const { activateHistory } = useHistory();
const { is404 } = use404();
const store = useRootStore();
const queryStore = useQueryStore();
const route = useRoute();
const { doSearch } = useSearch();
useHead({
  // Set Schema.org host as in https://unhead.unjs.io/schema-org/getting-started/setup
  templateParams: { schemaOrg: { host: "https://queerlit.dh.gu.se" } },
  // Setting head values programmatically makes them available
  // for `useSchemaOrg` to use as defaults for some properties:
  // https://unhead.unjs.io/schema-org/getting-started/how-it-works#site-page-level-config
  meta: [{ name: "description", content: siteDescription }],
  htmlAttrs: { lang: "sv" },
});
useSchemaOrg([
  defineOrganization({ name: "Queerlit" }),
  defineWebSite({ name: "Queerlit", description: siteDescription }),
]);

const isTitlesRoute = computed(() =>
  /^\/(work|special)\//.test(route.fullPath),
);

activateHistory();

function reset() {
  queryStore.resetQuery();
  doSearch();
}

// Make internal apis available in browser console.
if (import.meta.env.DEV) {
  (window as any).state = storeToRefs(store);
  (window as any).queryStore = queryStore;
  (window as any).libris = libris;
  (window as any).terms = terms;
  (window as any).util = util;
}
</script>

<style lang="scss" scoped>
.main-nav-link {
  @apply p-1 px-4 mr-1 hover:bg-white/25 rounded-lg transition-all;
}
.main-nav-link.router-link-active {
  @apply bg-white dark:bg-white/50 rounded-lg text-gray-800 shadow-lg;
}
</style>

<style>
:root {
  color-scheme: light dark;
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
