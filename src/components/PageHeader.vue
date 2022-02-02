<template>
  <header class="bg-pink-600 text-white">
    <div class="container max-w-screen-md py-8">
      <router-link to="/" class="flex-1">
        <h1 class="text-7xl font-thin">Queerlit</h1>
      </router-link>
      <nav class="main-nav text-lg mt-6">
        <router-link to="/" class="mr-4">Sök</router-link>
        <router-link to="/ao" class="mr-4">Tesaurus</router-link>
        <a href="https://queerlit.dh.gu.se/om/" class="mr-4">Om</a>
      </nav>
    </div>
  </header>
</template>

<script setup></script>

<style lang="scss" scoped>
.main-nav .router-link-active {
  @apply p-1 px-4 bg-white rounded-lg text-gray-800;
}
</style>
