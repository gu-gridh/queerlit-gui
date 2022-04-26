<template>
  <span
    class="
    term
      inline-block
      px-1
      py-1
      leading-snug
      text-black
    "
  >
    <slot />
  </span>
</template>

<style>
.term{
  font-size:20px;
  font-weight:100;
background-color:rgb(255,180,0);
border-radius:6px;
padding: 5px 12px 5px 12px !important;
cursor:pointer;
height:38px;
}

</style>
