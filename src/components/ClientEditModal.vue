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
            <!-- Фио / Наименование (общее поле) -->
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-1">
                {{ isPhysicalPerson ? 'ФИО *' : 'Наименование *' }}
              </label>
              <input
                v-model="form.CLIENT_NAME"
                type="text"
                required
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <!-- Поля для физического лица (client_type = 0) -->
            <template v-if="isPhysicalPerson">
              <!-- Телефон (сразу под ФИО) -->
              <div>
                <label class="block text-sm text-gray-400 mb-1">Телефон</label>
                <input
                  v-model="form.PHONE"
                  type="text"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <!-- Email и Дата рождения в одной строке -->
              <div>
                <label class="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  v-model="form.EMAIL"
                  type="email"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm text-gray-400 mb-1">Дата рождения</label>
                <input
                  v-model="form.BIRTH_DATE"
                  type="date"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <!-- Паспортные данные (сворачиваемый блок) -->
              <div class="col-span-2 border border-gray-600 rounded-lg overflow-hidden">
                <button
                  type="button"
                  @click="showPassportData = !showPassportData"
                  class="w-full flex items-center justify-between p-4 bg-gray-750 hover:bg-gray-700 transition-colors"
                >
                  <h3 class="text-sm font-medium text-gray-300">Паспортные данные</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400 transition-transform"
                    :class="{ 'rotate-180': showPassportData }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div v-show="showPassportData" class="p-4 bg-gray-800">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm text-gray-400 mb-1">Серия паспорта</label>
                      <input
                        v-model="form.P_SER"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm text-gray-400 mb-1">Номер паспорта</label>
                      <input
                        v-model="form.P_NUM"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    
                    <div class="col-span-2">
                      <label class="block text-sm text-gray-400 mb-1">Кем выдан</label>
                      <input
                        v-model="form.P_GIVEN"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-span-2">
                <label class="block text-sm text-gray-400 mb-1">Доверенные лица</label>
                <textarea
                  v-model="form.DOV"
                  rows="2"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm text-gray-400 mb-1">Тип дисконтной карты</label>
                <Dropdown
                  v-model="form.CARD_TYPE_ID"
                  :options="discountCards"
                  placeholder="Выберите тип карты"
                  empty-text="Нет доступных карт"
                />
              </div>
              
              <div>
                <label class="block text-sm text-gray-400 mb-1">Номер дисконтной карты</label>
                <input
                  v-model="form.CARD_NUMBER"
                  type="text"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </template>
            
            <!-- Поля для юридического лица (client_type = 1) -->
            <template v-else>
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
              
              <div class="col-span-2">
                <label class="block text-sm text-gray-400 mb-1">Доверенные лица</label>
                <textarea
                  v-model="form.DOV"
                  rows="2"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
                ></textarea>
              </div>
            </template>
            
            <!-- Тип клиента -->
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-1">Тип клиента</label>
              <Dropdown
                v-model="form.CL_TYPE"
                :options="clientTypeOptions"
                placeholder="Выберите тип"
                empty-text="Нет доступных типов"
              />
            </div>
            
            <!-- Общие поля -->
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-1">Адрес</label>
              <input
                v-model="form.ADDRESS"
                type="text"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-1">Адрес для рассылки</label>
              <input
                v-model="form.DELIVERY_ADDR"
                type="text"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
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
import { ref, watch, computed, onMounted } from 'vue'
import { clientsApi, discountCardsApi } from '../services/api'
import Dropdown from './Dropdown.vue'

const props = defineProps({
  isOpen: Boolean,
  client: Object
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref('')
const discountCards = ref([])
const loadingDiscountCards = ref(false)
const showPassportData = ref(false)

const clientTypeOptions = [
  { value: 0, label: 'Физическое лицо' },
  { value: 1, label: 'Юридическое лицо' }
]

const isPhysicalPerson = computed(() => {
  return props.client?.CL_TYPE === 0
})

const form = ref({
  ID: null,
  CLIENT_NAME: '',
  CL_TYPE: 0,
  CLIENT_TYPE: 0,
  BIRTH_DATE: '',
  P_SER: '',
  P_NUM: '',
  P_GIVEN: '',
  DOV: '',
  CARD_TYPE_ID: '',
  CARD_NUMBER: '',
  INN: '',
  KPP: '',
  PHONE: '',
  EMAIL: '',
  ADDRESS: '',
  DELIVERY_ADDR: ''
})

const originalData = ref({})

watch(() => props.client, (newClient) => {
  if (newClient) {
    form.value = { ...newClient }
    originalData.value = { ...newClient }
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    error.value = ''
    showPassportData.value = false
  }
})

const getChangedFields = () => {
  const changed = {}
  for (const key in form.value) {
    if (form.value[key] !== originalData.value[key]) {
      changed[key] = form.value[key]
    }
  }
  return changed
}

const save = async () => {
  error.value = ''
  saving.value = true
  
  try {
    const changedFields = getChangedFields()
    changedFields.ID = form.value.ID
    await clientsApi.update(form.value.ID, changedFields)
    emit('save', form.value)
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Ошибка при сохранении клиента'
    console.error('Ошибка при сохранении клиента:', err)
  } finally {
    saving.value = false
  }
}

const loadDiscountCards = async () => {
  loadingDiscountCards.value = true
  try {
    const response = await discountCardsApi.getAll({ skip: 0, limit: 100 })
    discountCards.value = response.data.map(card => ({
      value: card.ID,
      label: `${card.CARD_NAME} (${card.SKIDKA}%)`
    }))
  } catch (err) {
    console.error('Ошибка при загрузке дисконтных карт:', err)
  } finally {
    loadingDiscountCards.value = false
  }
}

onMounted(() => {
  loadDiscountCards()
})
</script>
