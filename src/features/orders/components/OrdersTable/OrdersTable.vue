<script setup lang="ts">
import { computed, ref } from 'vue'
import { DefaultButton, DefaultPopup } from '@common/UI'
import type { IFilter, TSortType } from './types'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { statusOptions } from './options'
import { storeToRefs } from 'pinia'
import { useOrdersStore } from '../../bootstrap/store'
import { useAuthStore } from '@/features/auth'

const ordersStore = useOrdersStore()
const authStore = useAuthStore()
const { orders, error } = storeToRefs(ordersStore)
const { isAdmin } = storeToRefs(authStore)
const deletingOrderId = ref<number | null>(null)
const isPopupOpen = ref(false)
const sortDirection = ref<IFilter>({
  date: 'UP',
  address: 'UP',
})
const sortType = ref<TSortType | null>()

const sortedOrders = computed(() => {
  const data = [...orders.value]

  if (sortType.value === 'ADDERS') {
    data.sort((a, b) => {
      if (sortDirection.value.address === 'UP') return a.address.localeCompare(b.address)
      return b.address.localeCompare(a.address)
    })
  }

  if (sortType.value === 'FILTER') {
    data.sort((a, b) => {
      if (sortDirection.value.date === 'UP') return new Date(a.date).getTime() - new Date(b.date).getTime()
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }

  return data
})

const sortByAddress = () => {
  sortDirection.value.address = sortDirection.value.address === 'UP' ? 'DOWN' : 'UP'
  sortType.value = 'ADDERS'
}

const sortByDate = () => {
  sortDirection.value.date = sortDirection.value.date === 'UP' ? 'DOWN' : 'UP'
  sortType.value = 'FILTER'
}

const openDeletePopup = (id: number) => {
  deletingOrderId.value = id
  isPopupOpen.value = true
}

const onDelete = async (id: number | null) => {
  try {
    await ordersStore.deleteOrder(id)
    isPopupOpen.value = false
  } catch (error) {
    console.error('Ошибка удаления:', error)
  }
}
</script>

<template>
  <div class="orders-table-wrapper">
    <p v-if="error" class="orders-error">{{ error }}</p>

    <table v-else class="orders-table">
      <thead>
        <tr>
          <th>№</th>
          <th>Имя клиента</th>
          <th class="orders-table-filter" @click="sortByAddress">Адрес ↕</th>
          <th class="orders-table-filter" @click="sortByDate">Дата заказа ↕</th>
          <th>Статус</th>
          <th>Комментарий</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="order in sortedOrders" :key="order.id" :class="{ 'order-table-completed': order.status === 'COMPLETED' }">
          <td>{{ order.id }}</td>
          <td>{{ order.name }}</td>
          <td>{{ order.address }}</td>
          <td>{{ format(parseISO(order.date), 'dd MMMM yyyy', { locale: ru }) }}</td>
          <td>{{ statusOptions[order.status] }}</td>
          <td>{{ order.comment }}</td>
          <td class="orders-actions">
            <DefaultButton v-if="isAdmin" secondary-style @click="() => openDeletePopup(order.id)" :disabled="order.status === 'COMPLETED'">
              🗑️
            </DefaultButton>
            <span class="orders-actions-empty" v-else>—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <DefaultPopup v-model:isPopupOpen="isPopupOpen">
    <h2 class="orders-title">Вы действительно хотите удалить заказ?</h2>

    <div class="delete-button-wrapper">
      <DefaultButton @click="() => onDelete(deletingOrderId)"> Да </DefaultButton>
      <DefaultButton
        @click="
          () => {
            isPopupOpen = false
          }
        "
      >
        нет
      </DefaultButton>
    </div>
  </DefaultPopup>
</template>

<style src="./styles.css"></style>
