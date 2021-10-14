<template>
  <div class="p-8">
    <div class="flex justify-between mb-8">
      <div>37 träffar</div>
      <div>◀ 1 2 3 ▶</div>
      <div>
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
  </div>
</template>

<script setup>
import WorkHit from "../components/WorkHit.vue";
</script>
