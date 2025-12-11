<script setup lang="ts">
import { useAuthStore } from '@/features/auth'
import { useOrdersStore } from '../../bootstrap/store'
import { DefaultButton, DefaultPopup, InputField } from '@common/UI'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import type { TAddOrderPayload } from './types'

const authStore = useAuthStore()
const orderStore = useOrdersStore()
const { userData } = storeToRefs(authStore)
const router = useRouter()

const isPopupOpen = ref(false)
const name = ref('')
const address = ref('')
const comment = ref('')
const formError = ref('')

watch(
  userData,
  (val) => {
    if (val?.name) name.value = val.name
  },
  { immediate: true },
)

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const submit = async () => {
  formError.value = ''

  if (!name.value.trim() || !address.value.trim()) {
    formError.value = 'Имя и адрес должны быть заполнены!'
    return
  }

  const payload: TAddOrderPayload = {
    name: name.value,
    address: address.value,
    comment: comment.value,
  }

  try {
    await orderStore.addOrder(payload)
    isPopupOpen.value = false
  } catch (err: unknown) {
    formError.value = (err as { message: string }).message
  }
}
</script>

<template>
  <header class="orders-header">
    <div class="orders-header-main">
      <h1 class="orders-header-title">Все заказы</h1>

      <DefaultButton
        @click="
          () => {
            isPopupOpen = true
          }
        "
      >
        + Добавить заказ
      </DefaultButton>

      <DefaultButton @click="orderStore.getOrders"> Обновить статус </DefaultButton>
    </div>

    <div class="orders-header-user">
      <div class="orders-user-info">
        <span class="order-user-name">{{ userData?.name }}</span>
      </div>

      <DefaultButton @click="logout"> Выйти </DefaultButton>
    </div>
  </header>

  <DefaultPopup v-model:isPopupOpen="isPopupOpen">
    <form class="orders-form-wrapper" @submit.prevent="submit">
      <h2 class="orders-title">Добавить заказ</h2>

      <div class="orders-error-wrapper">
        <div class="orders-input-wrapper">
          <InputField v-model="name" placeholder="Имя" />
          <InputField v-model="address" placeholder="Адрес" name="address" />
          <InputField v-model="comment" placeholder="Комментарии" name="comment" />
        </div>
        <p v-if="formError" class="error-orders">{{ formError }}</p>
      </div>

      <DefaultButton class="orders-button" type="submit"> Добавить заказ </DefaultButton>
    </form>
  </DefaultPopup>
</template>

<style src="./styles.css"></style>
