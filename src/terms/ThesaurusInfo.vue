<template>
  <div class="bg-white rounded-xl shadow-lg p-4 md:p-8">
    <p>
      Till Queerlit-databasen skapas en <em>tesaurus</em>, det vill säga en
      ordlista som sorterar ämnesord. Syftet med det är att göra
      skönlitteraturen i databasen mer lättillgänglig. Genom detaljerade
      ämnesord skapas fler sökvägar än de breda ämnesord som idag finns i
      <a
        href="https://metadatabyran.kb.se/amnesord-och-genre-form/svenska-amnesord"
        >Svenska Ämnesord (SAO)</a
      >, som är den ämnesordlista de flesta svenska bibliotek använder.
    </p>

    <p>
      Eftersom tesaurusen byggs upp i länkad data-format förbättras sökbarheten
      även för breda termer. Både strukturen och mängden termer kommer alltså
      att göra det enklare att söka i databasen.
    </p>

    <p>
      Utvecklingen av tesaurusen görs i samarbete med
      <a href="http://www2.ub.gu.se/kvinn/">KvinnSam</a> och
      <a href="https://www.kb.se/samverkan-och-utveckling/libris.html"
        >LIBRIS</a
      >
      och i så stor utsträckning som möjligt kommer den länkas till SAO och
      <a href="https://homosaurus.org/">Homosaurus</a> (utvecklad av IHLIA LGBT
      Heritage i Amsterdam och Digital Transgender Archive i Boston), som är den
      största internationella tesaurusen för HBTQ.
    </p>
  </div>
</template>

<style scoped>
p {
  @apply my-2;
}
p:first-child {
  @apply mt-0;
}
p:last-child {
  @apply mb-0;
}
a {
  @apply underline;
}
</style>