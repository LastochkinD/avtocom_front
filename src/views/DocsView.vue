<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <SidebarMenu />
    
    <!-- Основной контент -->
    <main class="ml-64 min-h-screen">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-white">Заказ-наряды</h1>
          <button
            @click="addDoc"
            class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить заказ-наряд
          </button>
        </div>

        <!-- Таблица заказ-нарядов -->
        <DataTable
          :columns="columns"
          :items="docs"
          :loading="isLoading"
          :paginated="true"
          :skip="skip"
          :limit="limit"
          :total-count="totalCount"
          empty-text="Заказ-наряды не найдены"
          row-key="ID"
          @page-change="loadDocs"
        >
          <!-- Слот для колонки ID -->
          <template #ID="{ item }">
            <div class="text-gray-300 font-mono text-sm">{{ item.ID }}</div>
          </template>
          
          <!-- Слот для колонки Номер -->
          <template #NUM="{ item }">
            <div class="text-white font-medium">{{ item.NUM || '-' }}</div>
          </template>

          <!-- Слот для колонки Дата открытия -->
          <template #OPEN_DATE="{ item }">
            <div class="text-gray-300">{{ formatDate(item.OPEN_DATE) }}</div>
          </template>

          <!-- Слот для колонки Дата закрытия -->
          <template #CLOSE_DATE="{ item }">
            <div class="text-gray-300">{{ formatDate(item.CLOSE_DATE) }}</div>
          </template>
          
          <!-- Слот для колонки Автомобиль -->
          <template #CAR_ID="{ item }">
            <div class="text-gray-300">{{ item.CAR_ID || '-' }}</div>
          </template>

          <!-- Слот для колонки Клиент -->
          <template #CLIENT_ID="{ item }">
            <div class="text-gray-300">{{ item.CLIENT_ID || '-' }}</div>
          </template>

          <!-- Слот для колонки Сумма -->
          <template #SUMMA="{ item }">
            <div class="text-white font-medium">{{ item.SUMMA ? item.SUMMA.toFixed(2) : '0.00' }}</div>
          </template>

          <!-- Слот для колонки Оплачен -->
          <template #PAYED_BOOL="{ item }">
            <span 
              :class="item.PAYED_BOOL ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'"
              class="px-2 py-1 rounded text-xs font-medium"
            >
              {{ item.PAYED_BOOL ? 'Да' : 'Нет' }}
            </span>
          </template>

          <!-- Слот для колонки Закрыт -->
          <template #CLOSED_BOOL="{ item }">
            <span 
              :class="item.CLOSED_BOOL ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'"
              class="px-2 py-1 rounded text-xs font-medium"
            >
              {{ item.CLOSED_BOOL ? 'Да' : 'Нет' }}
            </span>
          </template>

          <!-- Слот для колонки Аванс -->
          <template #AVANS="{ item }">
            <div class="text-gray-300">{{ item.AVANS ? item.AVANS.toFixed(2) : '0.00' }}</div>
          </template>

          <!-- Слот для колонки НДС -->
          <template #NDS="{ item }">
            <div class="text-gray-300">{{ item.NDS || '0' }}%</div>
          </template>
          
          <!-- Слот для колонки Действия -->
          <template #actions="{ item }">
            <router-link
              :to="`/service/zn/edit/${item.ID}`"
              class="text-primary-400 hover:text-primary-300 p-1"
              title="Редактировать"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </router-link>
          </template>
        </DataTable>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { docsApi } from '../services/api'
import SidebarMenu from '../components/SidebarMenu.vue'
import DataTable from '../components/DataTable.vue'

const isLoading = ref(false)
const docs = ref([])
const skip = ref(0)
const limit = ref(100)
const totalCount = ref(0)

const columns = [
  { key: 'ID', label: 'ID', align: 'left', textClass: 'text-sm text-gray-400', width: '60px' },
  { key: 'NUM', label: 'Номер', align: 'left' },
  { key: 'OPEN_DATE', label: 'Дата открытия', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'CLOSE_DATE', label: 'Дата закрытия', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'CAR_ID', label: 'Авто', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'CLIENT_ID', label: 'Клиент', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'DOV_FIO', label: 'Владелец', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'PROBEG', label: 'Пробег', align: 'right', textClass: 'text-sm text-gray-300' },
  { key: 'SUMMA', label: 'Сумма', align: 'right', textClass: 'text-sm text-gray-300' },
  { key: 'AVANS', label: 'Аванс', align: 'right', textClass: 'text-sm text-gray-300' },
  { key: 'NDS', label: 'НДС', align: 'center', textClass: 'text-sm text-gray-300', width: '60px' },
  { key: 'PAYED_BOOL', label: 'Оплачен', align: 'center', textClass: 'text-sm text-gray-300', width: '80px' },
  { key: 'CLOSED_BOOL', label: 'Закрыт', align: 'center', textClass: 'text-sm text-gray-300', width: '80px' },
  { key: 'actions', label: 'Действия', align: 'right', width: '80px' }
]

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

const loadDocs = async (newSkip = 0) => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    const response = await docsApi.getAll({
      skip: newSkip,
      limit: limit.value
    })
    docs.value = response.data
    skip.value = newSkip
    totalCount.value = newSkip + response.data.length
  } catch (error) {
    console.error('Ошибка при загрузке заказ-нарядов:', error)
  } finally {
    isLoading.value = false
  }
}

const addDoc = () => {
  // TODO: Реализовать добавление нового заказ-наряда
  console.log('Добавить заказ-наряд')
}


onMounted(() => {
  loadDocs()
})
</script>
