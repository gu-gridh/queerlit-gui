<template>
<Header />
<Search @search="search" />
</template>

<script setup>
import Header from './components/Header.vue';
import Search from './components/Search.vue';

async function search(terms) {
  console.log('searching', terms)
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>
