<script setup lang="ts">
import { useAttrs } from 'vue'

const modelValue = defineModel<string>()
const attrs = useAttrs()
</script>

<template>
  <input v-bind="attrs" v-model="modelValue" class="input-field" />
</template>

<style src="./styles.css"></style>
