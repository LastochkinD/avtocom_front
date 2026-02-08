<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <SidebarMenu />
    
    <!-- Основной контент -->
    <main class="ml-64 min-h-screen">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-white">Номенклатура</h1>
          <button
            class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить номенклатуру
          </button>
        </div>

        <!-- Поля фильтрации -->
        <FilterFields
          v-model="filters"
          :fields="filterFields"
          class="mb-6"
        />

        <!-- Таблица номенклатуры -->
        <DataTable
          :columns="columns"
          :items="nomenclature"
          :loading="isLoading"
          :paginated="true"
          :skip="skip"
          :limit="limit"
          :total-count="totalCount"
          empty-text="Номенклатура не найдена"
          row-key="ID"
          @page-change="loadNomenclature"
        >
          <!-- Слот для колонки Код -->
          <template #part-code="{ item }">
            <div class="text-primary-400 font-mono font-medium">{{ item.PART_CODE }}</div>
          </template>
          
          <!-- Слот для колонки Название -->
          <template #part-name="{ item }">
            <div class="text-white font-medium">{{ item.PART_NAME }}</div>
          </template>
          
          <!-- Слот для колонки Местоположение -->
          <template #location="{ item }">
            <div class="text-sm text-gray-300">{{ item.LOCATION || '-' }}</div>
          </template>
        </DataTable>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { nomenclatureApi } from '../services/api'
import SidebarMenu from '../components/SidebarMenu.vue'
import DataTable from '../components/DataTable.vue'
import FilterFields from '../components/FilterFields.vue'

const isLoading = ref(false)

const nomenclature = ref([])
const skip = ref(0)
const limit = ref(40)
const totalCount = ref(0)

const filters = ref({
  PART_CODE: '',
  PART_NAME: '',
  LOCATION: ''
})

const filterFields = [
  { key: 'PART_CODE', label: 'Код детали' },
  { key: 'PART_NAME', label: 'Название' },
  { key: 'LOCATION', label: 'Местоположение' }
]

const columns = [
  { key: 'ID', label: 'ID', align: 'left', textClass: 'text-sm text-gray-400' },
  { key: 'part-code', label: 'Код детали', align: 'left' },
  { key: 'part-name', label: 'Название', align: 'left' },
  { key: 'LOCATION', label: 'Местоположение', align: 'left', textClass: 'text-sm text-gray-300' }
]

const loadNomenclature = async (newSkip = 0) => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    const params = {
      skip: newSkip,
      limit: limit.value
    }
    
    // Добавляем фильтры
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value) {
        params[key.toLowerCase()] = value
      }
    })
    
    const response = await nomenclatureApi.getAll(params)
    nomenclature.value = response.data
    skip.value = newSkip
    // Для простоты предполагаем, что если вернулось меньше ожидаемого, то это последняя страница
    totalCount.value = newSkip + response.data.length
  } catch (error) {
    console.error('Ошибка при загрузке номенклатуры:', error)
  } finally {
    isLoading.value = false
  }
}

// При изменении фильтров сбрасываем на первую страницу
watch(filters, () => {
  skip.value = 0
  loadNomenclature(0)
}, { deep: true })

onMounted(() => {
  loadNomenclature()
})
</script>
