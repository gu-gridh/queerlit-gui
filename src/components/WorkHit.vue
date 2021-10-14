<template>
  <router-link to="/verk/1">
    <article class="block clearfix mb-2">
      <div
        class="
          float-right
          ml-2
          mb-1
          h-48
          w-32
          flex
          justify-center
          items-center
          p-1
        "
      >
        <img
          src="@/assets/drottningens-juvelsmycke.jpeg"
          class="max-h-full border"
        />
      </div>
      <h3 class="text-xl">Drottningens juvelsmycke</h3>
      <div class="flex my-2">
        <div class="w-1/2 pr-4">Almqvist, Carl Jonas Love</div>
        <div class="w-1/4 pr-4">Bok</div>
        <div class="w-1/4 pr-4">1874</div>
      </div>
      <div class="my-2">
        <Term class="mr-1 mb-1">androgyni</Term>
        <Term class="mr-1 mb-1">kvinnor</Term>
        <Term class="mr-1 mb-1">bögar</Term>
        <Term class="mr-1 mb-1">föräldraskap (HBTQI)</Term>
      </div>
    </article>
  </router-link>
</template>

<script setup>
import Term from "@/components/Term.vue";
</script>

<style></style>
