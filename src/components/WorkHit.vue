<template>
  <article class="block clearfix mb-2">
    <div
      class="
        float-right
        ml-2
        mb-1
        h-48
        w-32
        bg-gray-100
        flex
        justify-center
        items-center
        p-1
      "
    >
      <img src="@/assets/drottningens-juvelsmycke.jpeg" class="max-h-full" />
    </div>
    <h3 class="text-xl">
      <router-link to="/verk/1">Drottningens juvelsmycke</router-link>
    </h3>
    <div class="flex my-2">
      <div class="w-1/2 pr-4">Almqvist, Carl Jonas Love</div>
      <div class="w-1/4 pr-4">Bok</div>
      <div class="w-1/4 pr-4">1874</div>
    </div>
    <div class="my-2">
      <Term>androgyni</Term>
      <Term>kvinnor</Term>
      <Term>bögar</Term>
      <Term>föräldraskap (HBTQI)</Term>
    </div>
  </article>
</template>

<script setup>
import Term from "@/components/Term.vue";
</script>

<style>
.clearfix::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
</style>
