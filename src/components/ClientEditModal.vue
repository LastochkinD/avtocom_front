<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Modal -->
      <div class="relative bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 class="text-lg font-semibold text-white">Редактирование клиента</h2>
          <button
            @click="$emit('close')"
            class="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Form -->
        <form @submit.prevent="save" class="flex-1 overflow-y-auto p-4">
          <!-- Error message -->
          <div v-if="error" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {{ error }}
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-1">Название клиента *</label>
              <input
                v-model="form.CLIENT_NAME"
                type="text"
                required
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-1">ИНН</label>
              <input
                v-model="form.INN"
                type="text"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-1">КПП</label>
              <input
                v-model="form.KPP"
                type="text"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-1">Телефон</label>
              <input
                v-model="form.PHONE"
                type="text"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-1">Email</label>
              <input
                v-model="form.EMAIL"
                type="email"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-1">Адрес</label>
              <input
                v-model="form.ADDRESS"
                type="text"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-1">Примечание</label>
              <textarea
                v-model="form.COMMENTS"
                rows="3"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
              ></textarea>
            </div>
          </div>
        </form>
        
        <!-- Footer -->
        <div class="flex justify-end gap-3 p-4 border-t border-gray-700">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button
            @click="save"
            :disabled="saving"
            class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ saving ? 'Сохранение...' : 'Сохранить' }}
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
  isOpen: Boolean,
  client: Object
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref('')

const form = ref({
  ID: null,
  CLIENT_NAME: '',
  INN: '',
  KPP: '',
  PHONE: '',
  EMAIL: '',
  ADDRESS: '',
  COMMENTS: ''
})

watch(() => props.client, (newClient) => {
  if (newClient) {
    form.value = { ...newClient }
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    error.value = ''
  }
})

const save = async () => {
  error.value = ''
  saving.value = true
  
  try {
    await clientsApi.update(form.value.ID, form.value)
    emit('save', form.value)
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Ошибка при сохранении клиента'
    console.error('Ошибка при сохранении клиента:', err)
  } finally {
    saving.value = false
  }
}
</script>
