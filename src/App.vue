<template>
  <Header />
  <div class="flex-1 flex flex-col">
    <router-view />
  </div>
</template>

<script setup>
import Header from "@/components/PageHeader.vue";
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>
