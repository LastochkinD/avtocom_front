<template>
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

    <!-- Поиск -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск клиентов..."
        class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
      />
    </div>

    <!-- Таблица клиентов -->
    <div class="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-800/80">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">Клиент</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">Телефон</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">Адрес</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-300">Дата создания</th>
            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-300">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700/50">
          <tr v-for="client in filteredClients" :key="client.ID" class="hover:bg-gray-700/30 transition-colors">
            <td class="px-4 py-3 text-sm text-gray-400">{{ client.ID }}</td>
            <td class="px-4 py-3">
              <div class="text-white font-medium">{{ client.CLIENT_NAME }}</div>
              <div class="text-sm text-gray-400">{{ client.PRED }}</div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-300">{{ client.PHONE || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-300">{{ client.EMAIL || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-300">{{ client.ADDRESS || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-400">{{ formatDate(client.CR_TIME) }}</td>
            <td class="px-4 py-3 text-right">
              <button
                class="text-primary-400 hover:text-primary-300 p-1"
                title="Редактировать"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="loading">
            <td colspan="7" class="px-4 py-8 text-center text-gray-400">
              Загрузка...
            </td>
          </tr>
          <tr v-if="!loading && clients.length === 0">
            <td colspan="7" class="px-4 py-8 text-center text-gray-400">
              Клиенты не найдены
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Пагинация -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-400">
        Показано {{ clients.length }} из {{ totalCount }} клиентов
      </div>
      <div class="flex gap-2">
        <button
          :disabled="skip === 0"
          @click="loadClients(skip - limit)"
          class="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
        >
          Назад
        </button>
        <button
          :disabled="clients.length < limit"
          @click="loadClients(skip + limit)"
          class="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
        >
          Далее
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { clientsApi } from '../services/api'

const clients = ref([])
const loading = ref(false)
const searchQuery = ref('')
const skip = ref(0)
const limit = ref(20)
const totalCount = ref(0)

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value
  
  const query = searchQuery.value.toLowerCase()
  return clients.value.filter(client =>
    client.CLIENT_NAME?.toLowerCase().includes(query) ||
    client.PHONE?.includes(query) ||
    client.EMAIL?.toLowerCase().includes(query)
  )
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const loadClients = async (newSkip = 0) => {
  loading.value = true
  try {
    const response = await clientsApi.getAll({
      skip: newSkip,
      limit: limit.value
    })
    clients.value = response.data
    skip.value = newSkip
    // Для простоты предполагаем, что если вернулось меньше лимита, то это последняя страница
    totalCount.value = newSkip + response.data.length
  } catch (error) {
    console.error('Ошибка при загрузке клиентов:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadClients()
})
</script>
