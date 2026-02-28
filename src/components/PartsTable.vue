<template>
  <div class="bg-gray-700/50 rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-white font-medium">Список запчастей</h3>
      <div class="flex gap-2">
        <button
          @click="addPart"
          class="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm transition-colors"
        >
          Добавить запчасть
        </button>
        <button
          @click="refreshParts"
          class="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm transition-colors"
        >
          Обновить
        </button>
      </div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
      <p class="text-red-400 text-sm">{{ error }}</p>
    </div>

    <!-- Таблица запчастей -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-700/80">
          <tr>
            <th class="px-3 py-2 text-left text-gray-300 font-medium">Код</th>
            <th class="px-3 py-2 text-left text-gray-300 font-medium">Название</th>
            <th class="px-3 py-2 text-left text-gray-300 font-medium">Количество</th>
            <th class="px-3 py-2 text-left text-gray-300 font-medium">Ед. изм.</th>
            <th class="px-3 py-2 text-left text-gray-300 font-medium">Цена</th>
            <th class="px-3 py-2 text-left text-gray-300 font-medium">Сумма</th>
            <th class="px-3 py-2 text-left text-gray-300 font-medium">Работник</th>
            <th class="px-3 py-2 text-left text-gray-300 font-medium">Дата</th>
            <th class="px-3 py-2 text-left text-gray-300 font-medium">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-600/50">
          <tr v-for="part in parts" :key="part.ID" class="hover:bg-gray-600/30">
            <td class="px-3 py-2 text-gray-300">{{ part.CODE || '-' }}</td>
            <td class="px-3 py-2 text-white">{{ part.NAME }}</td>
            <td class="px-3 py-2 text-gray-300">{{ part.KOL }}</td>
            <td class="px-3 py-2 text-gray-300">{{ part.UNIT_NAME || '-' }}</td>
            <td class="px-3 py-2 text-gray-300">{{ part.PRICE ? part.PRICE.toFixed(2) : '0.00' }}</td>
            <td class="px-3 py-2 text-white font-medium">{{ (part.PRICE * part.KOL).toFixed(2) }}</td>
            <td class="px-3 py-2 text-gray-300">{{ part.WORKER_ID || '-' }}</td>
            <td class="px-3 py-2 text-gray-300">{{ formatDate(part.CR_TIME) }}</td>
            <td class="px-3 py-2">
              <div class="flex gap-1">
                <button
                  @click="editPart(part)"
                  class="p-1 text-gray-400 hover:text-primary-400 transition-colors"
                  title="Редактировать"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deletePart(part.ID)"
                  class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  title="Удалить"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="loading">
            <td :colspan="9" class="px-3 py-4 text-center text-gray-400">
              Загрузка запчастей...
            </td>
          </tr>
          <tr v-if="!loading && parts.length === 0">
            <td :colspan="9" class="px-3 py-4 text-center text-gray-400">
              Запчасти не найдены
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Итоговая сумма -->
    <div v-if="parts.length > 0" class="mt-4 flex justify-end">
      <div class="bg-gray-800 rounded-lg p-3">
        <div class="text-sm text-gray-400">Общая сумма запчастей:</div>
        <div class="text-lg font-bold text-white">{{ totalPartsAmount.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { rashodNApi } from '../services/api'

const props = defineProps({
  docId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['add-part', 'edit-part', 'refresh'])

const parts = ref([])
const loading = ref(false)
const error = ref('')

const loadParts = async () => {
  if (!props.docId) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await rashodNApi.getByDocId(props.docId)
    parts.value = response.data
  } catch (err) {
    console.error('Ошибка при загрузке запчастей:', err)
    error.value = err.response?.data?.detail || 'Ошибка при загрузке запчастей'
  } finally {
    loading.value = false
  }
}

const totalPartsAmount = computed(() => {
  return parts.value.reduce((total, part) => {
    return total + (part.PRICE * part.KOL)
  }, 0)
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

const addPart = () => {
  emit('add-part')
}

const editPart = (part) => {
  emit('edit-part', part)
}

const deletePart = async (partId) => {
  if (!confirm('Вы уверены, что хотите удалить эту запчасть?')) return
  
  try {
    await rashodNApi.delete(partId)
    await loadParts()
    emit('refresh')
  } catch (err) {
    console.error('Ошибка при удалении запчасти:', err)
    error.value = err.response?.data?.detail || 'Ошибка при удалении запчасти'
  }
}

const refreshParts = () => {
  loadParts()
}

// Загружаем запчасти при монтировании и при изменении docId
onMounted(() => {
  loadParts()
})

watch(() => props.docId, (newDocId) => {
  if (newDocId) {
    loadParts()
  }
})
</script>