<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = defineProps<{
  secondaryStyle?: boolean
}>()

const emits = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const attrs = useAttrs()

const buttonClass = computed(() => ['button', props.secondaryStyle ? 'button--secondary' : 'button--primary'])

const handleClick = (event: MouseEvent) => {
  emits('click', event)
}
</script>

<template>
  <button :class="buttonClass" v-bind="attrs" @click="handleClick">
    <slot />
  </button>
</template>

<style src="./styles.css"></style>
