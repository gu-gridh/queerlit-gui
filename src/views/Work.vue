<template>
  <div class="p-8">
    <div class="clearfix">
      <h2 class="text-3xl">Drottningens juvelsmycke</h2>
      <div
        class="
          float-right
          bg-gray-100
          p-1
          flex
          justify-center
          items-center
          h-64
          w-48
        "
      >
        <img src="@/assets/drottningens-juvelsmycke.jpeg" class="max-h-full" />
      </div>
      <div class="flex my-4">
        <Labeled label="Författare" class="w-1/3 pr-4">
          Almqvist, Carl Johan Love
        </Labeled>
        <Labeled label="typ" class="w-1/3 pr-4"> Bok </Labeled>
        <Labeled label="Utgivningsår" class="w-1/3 pr-4"> 1834 </Labeled>
      </div>
      <Labeled label="Ämnesord" class="my-4 text-lg">
        <Term>androgyni</Term>
        <Term>kvinnor</Term>
        <Term>bögar</Term>
        <Term>föräldraskap (HBTQI)</Term>
      </Labeled>
      <Labeled label="Beskrivning" class="my-4">
        Drottningens Juvelsmycke utgavs i två volymer i november 1834 inom
        duodesserien av Törnrosens bok (Swensk Bibliographi 1834 nr 11
        [november], s. 90). De annonserades i Aftonbladet 20/11 1834.
        Annonstext: ”Af Trycket har utkommit i tvenne Band, och säljes à 2 R:dr
        B:ko: DROTTNINGENS JUVELSMYCKE, eller Azouras Lazuli Tintomara.
        Romantiserad berättelse om hemliga händelser näst före, under och efter
        Kon. Gustaf III:s mord.”
      </Labeled>
    </div>
    <blockquote class="flex my-4">
      <p class="whitespace-nowrap overflow-hidden flex-1 mr-4 italic">
        Tider af dueller och dubbel-jalousier, hvilka tider likväl af
        intressanta äfventyr, hvilka tider af storm kring lockarna och eld i
        hjertat?
      </p>
      <a
        href="https://litteraturbanken.se/f%C3%B6rfattare/AlmqvistCJL/titlar/SamladeVerk6/sida/III/etext"
        class=""
        >Läs hela</a
      >
    </blockquote>
  </div>
</template>

<script setup>
import Labeled from "@/components/Labeled.vue";
import Term from "@/components/Term.vue";
</script>

<style></style>
