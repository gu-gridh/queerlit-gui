<template>
  <article class="block clearfix mb-2">
    <img
      src="https://placekitten.com/200/300"
      class="float-right ml-2 mb-1 h-48"
    />
    <h3 class="text-xl">Drottningens juvelsmycke</h3>
    <div class="flex my-2">
      <div class="w-1/2 pr-4">Almqvist, Carl Jonas Love</div>
      <div class="w-1/4 pr-4">Bok</div>
      <div class="w-1/4 pr-4">1874</div>
    </div>
    <div class="my-2">
      <Term>kvinnor</Term>
      <Term>bögar</Term>
      <Term>föräldraskap (HBTQI)</Term>
    </div>
  </article>
</template>

<script setup>
import Term from "./Term.vue";
</script>

<style>
.clearfix::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
</style>
