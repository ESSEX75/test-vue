<script setup lang="ts">
import type { IDefaultPopup } from './types'
import { DefaultButton } from '@common/UI/DefaultButton'

const { isPopupOpen } = defineProps<IDefaultPopup>()

const emit = defineEmits<{
  (e: 'update:isPopupOpen', v: boolean): void
}>()

const close = () => emit('update:isPopupOpen', false)
</script>

<template>
  <div v-if="isPopupOpen" class="popup-overlay" @click.self="close">
    <div class="popup-wrapper">
      <header class="popup-header">
        <DefaultButton class="popup-close-button" secondary-style @click="close"> ✖ </DefaultButton>
      </header>

      <main class="popup-body">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<style src="./styles.css"></style>
