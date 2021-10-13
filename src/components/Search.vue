<template>
<div id="search">
    <input type="search" @keyup="search" />
</div>
</template>

<script setup>
const emit = defineEmits(['search'])

function search(event) {
    emit('search', event.target.value)
}
</script>
