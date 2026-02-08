<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <SidebarMenu />
    
    <!-- Основной контент -->
    <main class="ml-64 min-h-screen">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-white">Клиенты</h1>
          <button
            class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить клиента
          </button>
        </div>

        <!-- Поля фильтрации -->
        <FilterFields
          v-model="filters"
          :fields="filterFields"
          class="mb-6"
        />

        <!-- Таблица клиентов -->
        <DataTable
          :columns="columns"
          :items="clients"
          :loading="isLoading"
          :paginated="true"
          :skip="skip"
          :limit="limit"
          :total-count="totalCount"
          empty-text="Клиенты не найдены"
          row-key="ID"
          @page-change="loadClients"
        >
          <!-- Слот для колонки Клиент -->
          <template #client-name="{ item }">
            <div class="text-white font-medium">{{ item.CLIENT_NAME }}</div>
            <div class="text-sm text-gray-400">{{ item.PRED }}</div>
          </template>
          
          <!-- Слот для колонки Действия -->
          <template #actions="{ item }">
            <button
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
import { ref, watch, onMounted } from 'vue'
import { clientsApi } from '../services/api'
import SidebarMenu from '../components/SidebarMenu.vue'
import DataTable from '../components/DataTable.vue'
import FilterFields from '../components/FilterFields.vue'

let isLoading = false

const clients = ref([])
const skip = ref(0)
const limit = ref(40)
const totalCount = ref(0)

const filters = ref({
  CLIENT_NAME: '',
  ADDRESS: '',
  PHONE: '',
  EMAIL: ''
})

const filterFields = [
  { key: 'CLIENT_NAME', label: 'Название клиента' },
  { key: 'ADDRESS', label: 'Адрес' },
  { key: 'PHONE', label: 'Телефон' },
  { key: 'EMAIL', label: 'Email' }
]

const columns = [
  { key: 'ID', label: 'ID', align: 'left', textClass: 'text-sm text-gray-400' },
  { key: 'client-name', label: 'Клиент', align: 'left' },
  { key: 'PHONE', label: 'Телефон', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'EMAIL', label: 'Email', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'ADDRESS', label: 'Адрес', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'CR_TIME', label: 'Дата создания', align: 'left', textClass: 'text-sm text-gray-400', format: 'date' },
  { key: 'actions', label: 'Действия', align: 'right' }
]

const loadClients = async (newSkip = 0) => {
  if (isLoading) return
  isLoading = true
  
  try {
    const params = {
      skip: newSkip,
      limit: newSkip + limit.value
    }
    
    // Добавляем фильтры с lowercase ключами
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value) {
        params[key.toLowerCase()] = value
      }
    })
    
    const response = await clientsApi.getAll(params)
    clients.value = response.data
    skip.value = newSkip
    // Для простоты предполагаем, что если вернулось меньше ожидаемого, то это последняя страница
    totalCount.value = newSkip + response.data.length
  } catch (error) {
    console.error('Ошибка при загрузке клиентов:', error)
  } finally {
    isLoading = false
  }
}

// При изменении фильтров сбрасываем на первую страницу
watch(filters, () => {
  skip.value = 0
  loadClients(0)
}, { deep: true })

onMounted(() => {
  loadClients()
})
</script>
