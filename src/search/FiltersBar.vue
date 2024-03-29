<script setup lang="ts">
import useQuery from "./query.composable";
import useQueryStore from "@/stores/query.store";
import FilterButton from "./FilterButton.vue";
import useTerms from "@/terms/terms.composable";
import useSearch from "./search.composable";

const {
  text,
  terms,
  termsSecondary,
  hierarchical,
  title,
  author,
  yearStart,
  yearEnd,
  genreform,
  getPersonLabel,
  getGenreformLabel,
} = useQuery();
const queryStore = useQueryStore();
const { remove, removeSecondary } = useTerms();
const { setQuery } = useSearch();
</script>

<template>
  <aside v-if="!queryStore.isEmpty" class="container py-2">
    <div class="flex flex-wrap items-baseline gap-1">
      <h3>Din sökning:</h3>

      <FilterButton v-if="text" label="Fritext" @clear="setQuery({ text: '' })">
        {{ text }}
      </FilterButton>

      <FilterButton
        v-for="term in terms"
        :key="term.id"
        label="Ämnesord"
        @clear="remove(term)"
      >
        {{ term.label }}
      </FilterButton>

      <FilterButton
        v-for="term in termsSecondary"
        :key="term.id"
        label="Perifert ämnesord"
        @clear="removeSecondary(term)"
      >
        {{ term.label }}
      </FilterButton>

      <FilterButton
        v-if="terms.length || termsSecondary.length"
        :label="hierarchical ? 'Även smalare' : 'Ej smalare'"
      />

      <FilterButton
        v-if="title"
        label="Titel innehåller"
        @clear="setQuery({ title: '' })"
      >
        {{ title }}
      </FilterButton>

      <FilterButton
        v-if="author"
        label="Författare"
        @clear="setQuery({ author: null })"
      >
        {{ getPersonLabel(author) }}
      </FilterButton>

      <FilterButton
        v-if="yearStart"
        label="Utgivet tidigast"
        @clear="setQuery({ yearStart: null })"
      >
        {{ yearStart }}
      </FilterButton>

      <FilterButton
        v-if="yearEnd"
        label="Utgivet senast"
        @clear="setQuery({ yearEnd: null })"
      >
        {{ yearEnd }}
      </FilterButton>

      <FilterButton
        v-if="genreform"
        label="Genre/form"
        @clear="setQuery({ genreform: null })"
      >
        {{ getGenreformLabel(genreform) }}
      </FilterButton>
    </div>
  </aside>
</template>

<style></style>
