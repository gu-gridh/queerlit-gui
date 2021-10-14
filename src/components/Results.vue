<template>
  <div class="p-8">
    <div class="flex mb-8">
      <div class="w-1/3">37 träffar</div>
      <div class="w-1/3 text-center">◀ 1 2 3 ▶</div>
      <div class="w-1/3 text-right">
        Sortering:
        <select>
          <option>Relevans</option>
        </select>
      </div>
    </div>
    <WorkHit />
    <WorkHit />
    <WorkHit />
    <WorkHit />
    <div class="flex justify-around mb-8">
      <div>◀ 1 2 3 ▶</div>
    </div>
  </div>
</template>

<script setup>
import WorkHit from "@/components/WorkHit.vue";
</script>
