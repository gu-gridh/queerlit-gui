<script setup lang="ts"></script>

<template>
  <footer
    class="container mt-8 py-8 flex flex-col sm:flex-row gap-4 justify-between text-sm text-center sm:text-left"
  >
    <div class="flex-1 q-body flex flex-col gap-1">
      <div>
        Queerlitprojektet bedrivs på
        <a href="https://gu.se/">Göteborgs universitet</a> i samarbete med
        <a href="http://www2.ub.gu.se/kvinn/">KvinnSam</a>,
        <a href="https://gu.se/digital-humaniora">GRIDH</a>,
        <a href="https://www.sh.se/">Södertörns högskola</a> och
        <a href="https://lnu.se/">Linnéuniversitetet</a>.
      </div>
      <div>
        <a href="https://queerlit.dh.gu.se/om/">Mer om projektet Queerlit</a>
        <span class="px-1">·</span>
        <a href="https://queerlit.dh.gu.se/om/kontakt/">Kontakta oss</a>
        <span class="px-1">·</span>
        Licens:
        <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.sv"
          >CC0</a
        >
      </div>
    </div>

    <div class="flex gap-4 items-center justify-center">
      <a
        href="https://gu.se/digital-humaniora"
        alt="Göteborgs forskningsinfrastruktur för digital humaniora"
      >
        <span class="text-4xl font-extralight">GRIDH</span>
      </a>
      <a href="https://gu.se/" class="w-20"><img src="@/assets/gu.svg" /></a>
    </div>
  </footer>
</template>
