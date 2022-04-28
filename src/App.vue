<template>
  <div class="flex-1 flex flex-col lg:flex-row">
    <div class="lg:w-1/2 lg:max-w-screen-sm"></div>
    <div class="left-pane lg:w-1/2 lg:max-w-screen-sm lg:fixed lg:h-full">
      <header>
        <div class="max-w-screen-md py-8">
          <router-link to="/" class="flex-1">
            <div id="qlogo"></div>
          </router-link>
        </div>
      </header>

      <nav class="main-nav text-lg mt-6">
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

#qlogo {
  background-image: url(assets/qlogo.svg);
  background-size: cover;
  width: 325px;
  height: 110px;
  margin-top: 30px;
  margin-left: 10px;
  transition: all 0.5s ease-in-out;
}

.main-nav {
  margin-bottom: 20px;
  transition: all 0.5s ease-in-out;
}

@media screen and (max-height: 820px) {
  #qlogo {
    margin-top: 0px;
    width: 200px;
    height: 68px;
  }

  .main-nav {
    margin-bottom: 20px;
    margin-top: 0px !important;
  }
}

.left-pane {
  background-color: #b5c0bd;
  overflow-y: auto;
  padding: 20px 50px 50px 50px;
  box-shadow: inset -1rem 0rem 2rem rgba(0, 0, 0, 0.1);
}

.right-pane {
}

input:focus {
  outline: none !important;
}

::placeholder {
  color: #666666 !important;
  opacity: 1 !important; /* Firefox */
  font-size: 24px;
  font-weight: 100;
}

.tag-input::placeholder {
  font-size: 20px !important;
}

.advanced-form::placeholder {
  font-size: 16px;
}

.bg-greengrey {
  background-color: #e7ebe9 !important;
  backdrop-filter: blur(5px);
  margin-top: -5px;

  border-radius: 0px 0px 5px 5px !important;
  border-color: grey;
}
</style>
