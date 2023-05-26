<template>
  <div v-on-click-outside="blur">
    <div
      class="p-2 flex rounded-t shadow-inner"
      :class="{
        'rounded-b': !suggestions.length,
        incomplete: input,
        'bg-smoke-200 hover:bg-smoke-300': !terms.length,
        'bg-blue-100': terms.length,
      }"
    >
      <div class="flex-1 flex flex-wrap items-baseline gap-1">
        <Term
          v-for="term in terms"
          :key="term.name"
          class="term-added text-md"
          :data="term"
          :options="['goto']"
        >
          {{ term.prefLabel }}
          <icon
            icon="times"
            size="xs"
            class="ml-1 cursor-pointer"
            @click.prevent="remove(term)"
          />
        </Term>

        <input
          :id="inputId"
          v-model="input"
          type="search"
          class="
            bg-transparent
            border border-transparent
            w-36
            flex-1
            transition-colors
            text-xl
            leading-none
          "
          @input="suggest"
          @keydown.backspace="removeLast"
          @focus="suggest"
        />

        <ToggleIcon
          v-if="help"
          icon="question"
          :value="showHelp"
          :toggle="toggleHelp"
        />
      </div>
    </div>

    <div v-show="suggestions.length" class="h-0 relative z-20">
      <CloseButton @click="setSuggestions([])" />
      <div class="bg-smoke-200 rounded-b pt-2 shadow">
        <div
          v-for="term in suggestions"
          :key="term.name"
          class="px-2 pb-2 flex items-baseline"
        >
          {{ term.id }}
          <Term :data="term" class="cursor-pointer" @click="add(term)">
            {{ term._label }}
            <icon icon="plus" size="xs" class="ml-1" />
          </Term>
          <div class="flex-1"></div>
        </div>
      </div>
    </div>

    <InputHelp v-if="showHelp" @dismiss="toggleHelp(false)">
      {{ help }}
    </InputHelp>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { useToggle } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";
import Term from "@/terms/Term.vue";
import CloseButton from "@/components/CloseButton.vue";
import { searchTerms } from "@/services/terms.service";
import debounce from "lodash/debounce";
import ToggleIcon from "@/components/ToggleIcon.vue";
import InputHelp from "@/components/InputHelp.vue";

const props = defineProps(["terms", "input-id", "help"]);
const emit = defineEmits(["add", "remove"]);
const [showHelp, toggleHelp] = useToggle();
const input = ref("");
const suggestions = ref([]);

// No need to load suggestions until user slows down typing.
const getSuggestions = debounce(async () => {
  const inputFixed = input.value;
  const items = await searchTerms(inputFixed);
  // Update suggestion list only if the input hasn't already been changed again.
  if (inputFixed == input.value) setSuggestions(items);
}, 400);

async function suggest() {
  if (input.value) {
    getSuggestions();
  } else {
    setSuggestions([]);
  }
}

function add(term) {
  emit("add", term);
  input.value = "";
  setSuggestions([]);
}

function remove(term) {
  emit("remove", term);
}

function removeLast() {
  if (input.value) return;
  const lastTerm = props.terms[props.terms.length - 1];
  if (lastTerm) remove(lastTerm);
}

function setSuggestions(matches) {
  suggestions.value = matches || [];
}

function blur() {
  setSuggestions([]);
}
</script>

<style scoped>
::placeholder {
  font-size: 20px;
}

.incomplete:not(:focus-within) {
  @apply bg-red-100;
}

.term-added:last-of-type {
  @apply mr-0;
}
</style>
