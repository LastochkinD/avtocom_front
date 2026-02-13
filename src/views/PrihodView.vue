<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <SidebarMenu />
    
    <!-- Основной контент -->
    <main class="ml-64 min-h-screen">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-white">Приходные накладные</h1>
          <button
            @click="addPrihod"
            class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить накладную
          </button>
        </div>

        <!-- Таблица приходных накладных -->
        <DataTable
          :columns="columns"
          :items="prihods"
          :loading="isLoading"
          :paginated="true"
          :skip="skip"
          :limit="limit"
          :total-count="totalCount"
          empty-text="Приходные накладные не найдены"
          row-key="ID"
          @page-change="loadPrihods"
        >
          <!-- Слот для колонки ID -->
          <template #ID="{ item }">
            <div class="text-gray-300 font-mono text-sm">{{ item.ID }}</div>
          </template>
          
          <!-- Слот для колонки Номер -->
          <template #NUM="{ item }">
            <div class="text-white font-medium">{{ item.NUM || '-' }}</div>
          </template>

          <!-- Слот для колонки Дата -->
          <template #PRIHOD_DATE="{ item }">
            <div class="text-gray-300">{{ formatDate(item.PRIHOD_DATE) }}</div>
          </template>
          
          <!-- Слот для колонки Поставщик -->
          <template #SUPPLIER_ID="{ item }">
            <div class="text-gray-300">{{ item.SUPPLIER_ID || '-' }}</div>
          </template>

          <!-- Слот для колонки Примечание -->
          <template #NOTE="{ item }">
            <div class="text-gray-300 truncate max-w-xs">{{ item.NOTE || '-' }}</div>
          </template>

          <!-- Слот для колонки Принято -->
          <template #ACCEPTED="{ item }">
            <span 
              :class="item.ACCEPTED ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'"
              class="px-2 py-1 rounded text-xs font-medium"
            >
              {{ item.ACCEPTED ? 'Да' : 'Нет' }}
            </span>
          </template>

          <!-- Слот для колонки Наличные -->
          <template #FOR_CASH="{ item }">
            <span 
              :class="item.FOR_CASH ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'"
              class="px-2 py-1 rounded text-xs font-medium"
            >
              {{ item.FOR_CASH ? 'Да' : 'Нет' }}
            </span>
          </template>
          
          <!-- Слот для колонки Действия -->
          <template #actions="{ item }">
            <button
              @click="editPrihod(item)"
              class="text-primary-400 hover:text-primary-300 p-1"
              title="Редактировать"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </template>
        </DataTable>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { prihodApi } from '../services/api'
import SidebarMenu from '../components/SidebarMenu.vue'
import DataTable from '../components/DataTable.vue'

const isLoading = ref(false)
const prihods = ref([])
const skip = ref(0)
const limit = ref(100)
const totalCount = ref(0)

const columns = [
  { key: 'ID', label: 'ID', align: 'left', textClass: 'text-sm text-gray-400', width: '60px' },
  { key: 'NUM', label: 'Номер', align: 'left' },
  { key: 'PRIHOD_DATE', label: 'Дата', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'SUPPLIER_ID', label: 'Поставщик', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'NOTE', label: 'Примечание', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'ACCEPTED', label: 'Принято', align: 'center', textClass: 'text-sm text-gray-300', width: '100px' },
  { key: 'FOR_CASH', label: 'Наличные', align: 'center', textClass: 'text-sm text-gray-300', width: '100px' },
  { key: 'actions', label: 'Действия', align: 'right', width: '80px' }
]

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

const loadPrihods = async (newSkip = 0) => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    const response = await prihodApi.getAll({
      skip: newSkip,
      limit: limit.value
    })
    prihods.value = response.data
    skip.value = newSkip
    totalCount.value = newSkip + response.data.length
  } catch (error) {
    console.error('Ошибка при загрузке приходных накладных:', error)
  } finally {
    isLoading.value = false
  }
}

const addPrihod = () => {
  // TODO: Реализовать добавление новой накладной
  console.log('Добавить накладную')
}

const editPrihod = (prihod) => {
  // TODO: Реализовать редактирование накладной
  console.log('Редактировать накладную:', prihod)
}

onMounted(() => {
  loadPrihods()
})
</script>
