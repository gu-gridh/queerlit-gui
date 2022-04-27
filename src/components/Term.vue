<template>
  <span class="term inline-block px-1 py-1 leading-snug text-black">
    <slot />
  </span>
</template>

<style>
.term {
  font-size: 20px !important;
  font-weight: 100 !important;
  background-color: rgb(255, 180, 0);
  border-radius: 6px;
  padding: 5px 12px 5px 12px !important;
  cursor: pointer;
  height: 38px;
  box-shadow: 0rem 0.1rem 0.5rem rgba(0, 0, 0, 0.2);
}
</style>
