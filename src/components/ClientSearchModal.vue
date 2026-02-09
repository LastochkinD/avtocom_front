<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Modal -->
      <div class="relative bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl mx-4 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 class="text-lg font-semibold text-white">Выбор клиента</h2>
          <button
            @click="$emit('close')"
            class="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Search -->
        <div class="p-4 border-b border-gray-700">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по имени, телефону или номеру..."
              class="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary-500"
              @input="debouncedSearch"
            />
          </div>
        </div>
        
        <!-- Results -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="loading" class="flex items-center justify-center py-8">
            <svg class="animate-spin h-8 w-8 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else-if="clients.length === 0 && searchQuery" class="text-center py-8 text-gray-400">
            Клиенты не найдены
          </div>
          
          <div v-else-if="clients.length === 0" class="text-center py-8 text-gray-400">
            Начните поиск для выбора клиента
          </div>
          
          <div v-else class="space-y-2">
            <button
              v-for="client in clients"
              :key="client.ID"
              @click="selectClient(client)"
              class="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors group"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white font-medium group-hover:text-primary-400 transition-colors">
                    {{ client.CLIENT_NAME }}
                  </div>
                  <div class="text-sm text-gray-400">
                    {{ client.PHONE || 'Телефон не указан' }}
                  </div>
                </div>
                <div class="text-sm text-gray-500">
                  <span v-if="client.CL_TYPE === 0">Физ. лицо</span>
                  <span v-else>Юр. лицо</span>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="flex justify-end gap-3 p-4 border-t border-gray-700">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { clientsApi } from '../services/api'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'select'])

const searchQuery = ref('')
const clients = ref([])
const loading = ref(false)
let searchTimeout = null

const search = async () => {
  if (!searchQuery.value.trim()) {
    clients.value = []
    return
  }
  
  loading.value = true
  try {
    const response = await clientsApi.getAll({
      search: searchQuery.value,
      limit: 20
    })
    clients.value = response.data
  } catch (err) {
    console.error('Ошибка при поиске клиентов:', err)
    clients.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(search, 300)
}

const selectClient = (client) => {
  emit('select', client)
  emit('close')
  searchQuery.value = ''
  clients.value = []
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    searchQuery.value = ''
    clients.value = []
  }
})
</script>
