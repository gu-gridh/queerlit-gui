<script setup lang="ts">
defineEmits<{
  dismiss: [];
}>();
</script>

<template>
  <div
    class="relative my-1 px-2 text-sm help-box"
  >
    <div
      class="float-right z-10 m-1.5 mr-0.5 opacity-70 cursor-pointer"
      @click="$emit('dismiss')"
    >
      <icon icon="times" size="sm" class="block" />
    </div>

    <slot />
  </div>
</template>

<style scoped>
.help-box{
background-color:rgba(0,0,0,0.4);
color:white;
border-radius:5px;
line-height:1.1;
padding:10px;
}

</style>
