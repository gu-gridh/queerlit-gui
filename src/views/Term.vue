<template>
  <div class="container flex justify-around py-8 items-end">
    <div class="w-2/3 flex">
      <div class="w-1/4 text-right">
        <Labeled label="Bredare">
          <Term>Föräldrar</Term>
        </Labeled>
      </div>
      <div class="w-2/4 text-center">
        <Term class="text-2xl">Homosexuella föräldrar</Term>
        <div class="p-4">
          <router-link to="/" class="bg-pink-900 text-white px-2 py-1 rounded"
            >Sök</router-link
          >
        </div>
      </div>
      <div class="w-1/4">
        <Labeled label="Smalare">
          <Term>Lesbiska mödrar</Term>
        </Labeled>
      </div>
    </div>
  </div>
  <div class="container flex justify-around text-center">
    <div class="w-2/3">
      <Labeled label="Relaterade" class="my-4">
        <Term class="mr-1 mb-1">Barn till homosexuella</Term>
        <Term class="mr-1 mb-1">Bisexuella föräldrar</Term>
      </Labeled>
      <Labeled label="Nära match" class="my-4">
        <Term class="mr-1 mb-1">Gay parents (LCSH)</Term>
      </Labeled>
      <Labeled label="Bred match" class="my-4">
        <Term class="mr-1 mb-1">Oac (kssb)</Term>
        <Term class="mr-1 mb-1">Ohjh (kssb)</Term>
      </Labeled>
    </div>
  </div>
</template>

<script setup>
import Term from "@/components/Term.vue";
import Labeled from "@/components/Labeled.vue";
</script>

<style></style>
