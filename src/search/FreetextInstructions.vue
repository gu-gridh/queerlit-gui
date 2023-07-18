<script setup lang="ts">
import CloseButton from "@/components/CloseButton.vue";

defineEmits<{
  dismiss: [];
}>();
</script>

<template>
  <div class="relative my-2 bg-amber-50 border border-amber-200 p-2 text-sm">
    <h4 class="text-base font-bold">Sökhjälp</h4>
    <CloseButton @click="$emit('dismiss')" />
    <p>
      I huvudsökrutan kan du söka i fritext, men du får också förslag på
      ämnesord och andra söktermer. Genom att välja en föreslagen sökterm får du
      mer precist definierade sökningar. En fritextsökning söker i flera fält
      samtidigt, och du får ofta fler träffar.
    </p>
    <h4 class="text-base font-bold mt-2">Specialtecken i fritextsökning</h4>
    <p>
      <code>+</code> betyder AND<br />
      <code>|</code> betyder OR<br />
      <code>-</code> innebär uteslutning<br />
      <code>"</code> används för frassökning<br />
      <code>*</code> innebär trunkering av en term<br />
      <code>~</code> används för oexakt sökning
    </p>
  </div>
</template>

<style scoped>
code {
  font-size: smaller;
}
</style>
