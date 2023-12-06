<template>
  <div class="container q-body my-10">
    <h1 class="text-6xl my-10">Sidan kan inte hittas</h1>
    <p>Något gick snett, och på den här adressen finns inget att visa.</p>
    <p>Prova gärna att:</p>
    <ul class="list-disc pl-4">
      <li>
        <router-link to="/"
          >Söka efter verk i Queerlit-bibliografin</router-link
        >
      </li>
      <li>
        <router-link to="/subjects"
          >Bläddra bland Queerlits ämnesord</router-link
        >
      </li>
      <li><a href="https://queerlit.dh.gu.se/om/">Läsa mer om projektet</a></li>
    </ul>
    <p>
      Om du har frågor eller tror att något är fel, hör gärna av dig till
      <code class="text-sm">queerlit@lir.gu.se</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";
import useTitle from "./title.composable";

useHead({ meta: [{ name: "robots", content: "noindex" }] });
useTitle("");
</script>
