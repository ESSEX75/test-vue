<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ILoginPayload } from '../../types'
import { InputField, DefaultButton } from '@common/UI'
import useAuthStore from '../../bootstrap/store'
const authStore = useAuthStore()
const router = useRouter()

const user = ref('')
const password = ref('')
const authError = ref('')

const isFormValid = computed(() => user.value.trim() !== '' && password.value.trim() !== '')

const submit = async () => {
  authError.value = ''

  if (password.value.length < 8) {
    authError.value = 'Пароль должен быть минимум 8 символов'
    return
  }

  const payload: ILoginPayload = {
    user: user.value,
    password: password.value,
  }

  try {
    await authStore.login(payload)

    if (authStore.isAuthorized) {
      router.push('/orders')
    }
  } catch (err: unknown) {
    authError.value = (err as { message: string }).message
  }
}
</script>

<template>
  <div class="login-wrapper">
    <form class="login-form-wrapper" @submit.prevent="submit">
      <h1 class="login-title">Войти</h1>

      <div class="login-error-wrapper">
        <div class="login-input-wrapper">
          <InputField v-model="user" placeholder="Имя" />
          <InputField v-model="password" placeholder="Пароль" type="password" name="password" />
        </div>
        <p v-if="authError" class="error-login">{{ authError }}</p>
      </div>

      <DefaultButton class="login-button" type="submit" :disabled="!isFormValid"> Войти </DefaultButton>
    </form>
  </div>
</template>

<style src="./styles.css"></style>
