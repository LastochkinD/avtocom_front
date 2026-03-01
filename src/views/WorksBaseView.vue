<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <SidebarMenu />
    
    <!-- Основной контент -->
    <main class="ml-64 min-h-screen">
      <div class="p-6 space-y-6">
    <!-- Заголовок -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white">Справочник работ</h1>
        <p class="text-gray-400 mt-1">База данных всех доступных работ</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="refreshWorks"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Обновить
        </button>
      </div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- Таблица работ -->
    <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-700/80">
            <tr>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">ID</th>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">Группа</th>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">Код</th>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">Название</th>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">Количество</th>
              <th class="px-4 py-3 text-left text-gray-300 font-medium">Цена</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-600/50">
            <tr v-for="work in works" :key="work.ID" class="hover:bg-gray-700/50">
              <td class="px-4 py-3 text-gray-300">{{ work.ID }}</td>
              <td class="px-4 py-3 text-white font-medium">{{ work.WORKS_GROUP_NAME || '-' }}</td>
              <td class="px-4 py-3 text-white font-medium">{{ work.CODE }}</td>
              <td class="px-4 py-3 text-gray-300">{{ work.NAME }}</td>
              <td class="px-4 py-3 text-gray-300">{{ work.KOL }}</td>
              <td class="px-4 py-3 text-white font-medium">{{ work.PRICE ? work.PRICE.toFixed(2) : '0.00' }}</td>
            </tr>
            <tr v-if="loading">
              <td :colspan="6" class="px-4 py-6 text-center text-gray-400">
                <div class="flex justify-center items-center space-x-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                  <span>Загрузка данных...</span>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && works.length === 0">
              <td :colspan="6" class="px-4 py-6 text-center text-gray-400">
                Справочник работ пуст
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Статистика -->
    <div v-if="works.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <div class="text-sm text-gray-400">Всего работ</div>
        <div class="text-2xl font-bold text-white">{{ works.length }}</div>
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <div class="text-sm text-gray-400">Средняя цена</div>
        <div class="text-2xl font-bold text-white">{{ averagePrice.toFixed(2) }}</div>
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <div class="text-sm text-gray-400">Общая сумма</div>
        <div class="text-2xl font-bold text-white">{{ totalPrice.toFixed(2) }}</div>
      </div>
    </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { worksBaseApi } from '../services/api'

const works = ref([])
const loading = ref(false)
const error = ref('')

const loadWorks = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await worksBaseApi.getAll()
    works.value = response.data
  } catch (err) {
    console.error('Ошибка при загрузке справочника работ:', err)
    error.value = err.response?.data?.detail || 'Ошибка при загрузке справочника работ'
  } finally {
    loading.value = false
  }
}

const averagePrice = computed(() => {
  if (works.value.length === 0) return 0
  const total = works.value.reduce((sum, work) => sum + (work.PRICE || 0), 0)
  return total / works.value.length
})

const totalPrice = computed(() => {
  return works.value.reduce((sum, work) => sum + (work.PRICE || 0) * (work.KOL || 1), 0)
})

const refreshWorks = () => {
  loadWorks()
}

// Загружаем данные при монтировании
onMounted(() => {
  loadWorks()
})
</script>