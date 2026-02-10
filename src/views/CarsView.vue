<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <SidebarMenu />
    
    <!-- Основной контент -->
    <main class="ml-64 min-h-screen">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-white">Автомобили</h1>
          <button
            class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить автомобиль
          </button>
        </div>

        <!-- Таблица автомобилей -->
        <DataTable
          :columns="columns"
          :items="cars"
          :loading="isLoading"
          :paginated="true"
          :skip="skip"
          :limit="limit"
          :total-count="totalCount"
          empty-text="Автомобили не найдены"
          row-key="ID"
          @page-change="loadCars"
        >
          <!-- Слот для колонки VIN -->
          <template #vin="{ item }">
            <div class="text-white font-mono text-sm">{{ item.VIN }}</div>
          </template>
          
          <!-- Слот для колонки Номер -->
          <template #number="{ item }">
            <div class="text-white font-medium">{{ item.NOMER || '-' }}</div>
          </template>

          <!-- Слот для колонки Год выпуска -->
          <template #year="{ item }">
            <div class="text-gray-300">{{ item.CR_YEAR || '-' }}</div>
          </template>
          
          <!-- Слот для колонки Действия -->
          <template #actions="{ item }">
            <button
              @click="editCar(item)"
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

    <!-- Модальное окно редактирования -->
    <CarEditModal
      :is-open="isModalOpen"
      :car="selectedCar"
      @close="isModalOpen = false"
      @save="handleSave"
      @edit-client="editClient"
      @change-client="handleClientChange"
    />
    
    <!-- Модальное окно редактирования клиента -->
    <ClientEditModal
      :is-open="isClientModalOpen"
      :client="selectedClient"
      @close="isClientModalOpen = false"
      @save="handleClientSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { carsApi } from '../services/api'
import SidebarMenu from '../components/SidebarMenu.vue'
import DataTable from '../components/DataTable.vue'
import CarEditModal from '../components/CarEditModal.vue'
import ClientEditModal from '../components/ClientEditModal.vue'

const isLoading = ref(false)
const cars = ref([])
const skip = ref(0)
const limit = ref(100)
const totalCount = ref(0)

const isModalOpen = ref(false)
const selectedCar = ref(null)
const isClientModalOpen = ref(false)
const selectedClient = ref(null)

const columns = [
  { key: 'ID', label: 'ID', align: 'left', textClass: 'text-sm text-gray-400', width: '60px' },
  { key: 'vin', label: 'VIN', align: 'left' },
  { key: 'number', label: 'Номер', align: 'left' },
  { key: 'MODEL_NAME', label: 'Модель', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'COLOR_NAME', label: 'Цвет', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'CR_YEAR', label: 'Год выпуска', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'ENGINE_TYPE', label: 'Тип двигателя', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'KPP_TYPE', label: 'КПП', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'CLIENT_NAME', label: 'Клиент', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'PHONE', label: 'Телефон', align: 'left', textClass: 'text-sm text-gray-300' },
  { key: 'actions', label: 'Действия', align: 'right', width: '80px' }
]

const loadCars = async (newSkip = 0) => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    const response = await carsApi.getAll({
      skip: newSkip,
      limit: limit.value
    })
    cars.value = response.data
    skip.value = newSkip
    totalCount.value = newSkip + response.data.length
  } catch (error) {
    console.error('Ошибка при загрузке автомобилей:', error)
  } finally {
    isLoading.value = false
  }
}

const editCar = (car) => {
  selectedCar.value = car
  isModalOpen.value = true
}

const handleSave = (updatedCar) => {
  const index = cars.value.findIndex(c => c.ID === updatedCar.ID)
  if (index !== -1) {
    cars.value[index] = { ...cars.value[index], ...updatedCar }
  }
}

const editClient = (client) => {
  selectedClient.value = client
  isClientModalOpen.value = true
}

const handleClientSave = (updatedClient) => {
  if (selectedCar.value) {
    loadCars(skip.value)
  }
}

const handleClientChange = (newClient) => {
  if (selectedCar.value) {
    selectedCar.value = {
      ...selectedCar.value,
      CLIENT_ID: newClient.ID,
      CLIENT_NAME: newClient.CLIENT_NAME,
      PHONE: newClient.PHONE
    }
    const index = cars.value.findIndex(c => c.ID === selectedCar.value.ID)
    if (index !== -1) {
      cars.value[index] = { ...selectedCar.value }
    }
  }
}

onMounted(() => {
  loadCars()
})
</script>
