<template>
  <div v-on-click-outside="blur">
    <drop
      class="p-2 rounded-t"
      :class="{
        'rounded-b': !suggestions.length,
        incomplete: input,
        'bg-smoke-200 hover:bg-smoke-300': !terms.length,
        'bg-blue-100': terms.length,
        'animate-throb': isDraggingTerm,
      }"
      @drop="dropTerm"
    >
      <Labeled :label="label" :for-id="inputId" inner-class="flex items-center">
        <div class="flex-1 flex flex-wrap items-baseline gap-1">
          <Term
            v-for="term in terms"
            :key="term.name"
            class="term-added text-md"
            :data="term"
            :options="[removeOption, goto]"
            :secondary="secondary"
            :draggable="true"
          >
            {{ term.label }}
            <template v-if="secondary">– perifert</template>
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
            :size="Math.max(3, input.length + 1)"
            class="bg-transparent border border-transparent w-36 flex-1 transition-colors text-xl leading-none"
            @input="suggest"
            @keydown.backspace="removeLast"
            @focus="suggest"
          />
        </div>

        <ToggleIcon
          v-if="help"
          icon="question"
          :value="showHelp"
          :toggle="toggleHelp"
        />
      </Labeled>

      <InputHelp v-if="showHelp" class="mb-0" @dismiss="toggleHelp(false)">
        {{ help }}
      </InputHelp>
    </drop>

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
            {{ term.label }}
            <icon icon="plus" size="xs" class="ml-1" />
          </Term>
          <div class="flex-1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useToggle } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";
import debounce from "lodash/debounce";
import { key } from "@/store";
import { searchTerms } from "@/services/terms.service";
import Term from "@/terms/Term.vue";
import CloseButton from "@/components/CloseButton.vue";
import ToggleIcon from "@/components/ToggleIcon.vue";
import InputHelp from "@/components/InputHelp.vue";
import useTerms from "./terms.composable";
import useTermOptions from "./termOptions.composable";
import Labeled from "@/components/Labeled.vue";

const props = defineProps(["label", "terms", "input-id", "help", "secondary"]);
const emit = defineEmits(["add", "remove"]);
const { commit, state } = useStore(key);
const [showHelp, toggleHelp] = useToggle();
const { remove: removeTerm, removeSecondary } = useTerms();
const { goto } = useTermOptions();
const input = ref("");
const suggestions = ref([]);
const isDraggingTerm = computed(() => state.dragged?.type == "term");

// No need to load suggestions until user slows down typing.
const getSuggestions = debounce(async () => {
  if (!input.value) return;
  const inputFixed = input.value;
  const items = await searchTerms(inputFixed);
  items.splice(10);
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

const removeOption = (term) => ({
  label: `Rensa <em>${term.label}</em>`,
  action: () => remove(term),
});

function dropTerm() {
  if (isDraggingTerm.value) {
    const term = state.dragged.data;
    // Remove from both fields.
    removeTerm(term);
    removeSecondary(term);
    // Add to the current field.
    add(term);

    commit("setDragged", null);
  }
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
