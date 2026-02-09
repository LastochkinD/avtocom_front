<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Modal -->
      <div class="relative bg-gray-800 rounded-xl border border-gray-700 w-full max-w-6xl mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 class="text-lg font-semibold text-white">Редактирование автомобиля</h2>
          <button
            @click="$emit('close')"
            class="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Tabs -->
        <div class="border-b border-gray-700 overflow-x-auto">
          <div class="flex px-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap"
              :class="activeTab === tab.id 
                ? 'text-primary-400 border-b-2 border-primary-400' 
                : 'text-gray-400 hover:text-white'"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>
        
        <!-- Tab Content -->
        <div class="flex-1 overflow-y-auto">
          <!-- Автомобиль Tab -->
          <div v-show="activeTab === 'car'" class="p-4 space-y-6">
            <!-- Error message -->
            <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {{ error }}
            </div>
            
            <!-- Основная информация -->
            <div class="bg-gray-700/50 rounded-lg p-4">
              <h3 class="text-white font-medium mb-4">Основная информация</h3>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- VIN -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">VIN *</label>
                  <input
                    v-model="form.VIN"
                    type="text"
                    required
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Марка -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Марка</label>
                  <select
                    v-model="form.MARK_ID"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  >
                    <option :value="null">Выберите марку</option>
                    <option v-for="mark in marks" :key="mark.ID" :value="mark.ID">
                      {{ mark.MARK_NAME }}
                    </option>
                  </select>
                </div>
                
                <!-- Модель -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Модель</label>
                  <select
                    v-model="form.MODEL_ID"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                    :disabled="!form.MARK_ID"
                  >
                    <option :value="null">Сначала выберите марку</option>
                    <option v-for="model in models" :key="model.ID" :value="model.ID">
                      {{ model.MODEL_NAME }}
                    </option>
                  </select>
                </div>
                
                <!-- Цвет -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Цвет</label>
                  <input
                    v-model.number="form.COLOR_ID"
                    type="number"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Год выпуска -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Год выпуска</label>
                  <input
                    v-model="form.CR_YEAR"
                    type="number"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Государственный номер -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Государственный номер</label>
                  <input
                    v-model="form.NOMER"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Тип двигателя -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Тип двигателя</label>
                  <input
                    v-model="form.ENGINE_TYPE"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
            
            <!-- Клиент -->
            <div class="bg-gray-700/50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-white font-medium">Клиент</h3>
                <div class="flex items-center gap-2">
                  <button
                    v-if="client"
                    @click="openClientSearch"
                    class="p-1 text-gray-400 hover:text-primary-400 transition-colors"
                    title="Сменить клиента"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                  <button
                    v-if="client"
                    @click="$emit('edit-client', client)"
                    class="p-1 text-gray-400 hover:text-primary-400 transition-colors"
                    title="Редактировать клиента"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Имя</label>
                  <input
                    :value="client?.CLIENT_NAME || ''"
                    type="text"
                    readonly
                    class="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Телефон</label>
                  <input
                    :value="client?.PHONE || ''"
                    type="text"
                    readonly
                    class="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>
              
              <!-- Заказчик по умолчанию -->
              <h4 class="text-white font-medium mb-4 mt-6 border-t border-gray-600 pt-4">Заказчик по умолчанию</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">ФИО</label>
                  <input
                    v-model="form.DOV_FIO"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Адрес</label>
                  <input
                    v-model="form.DOV_ADDRESS"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Телефон</label>
                  <input
                    v-model="form.DOV_PHONE"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Дополнительная информация Tab -->
          <div v-show="activeTab === 'additional'" class="p-4">
            <div class="bg-gray-700/50 rounded-lg p-4">
              <h3 class="text-white font-medium mb-4">Дополнительная информация</h3>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Номер двигателя -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Номер двигателя</label>
                  <input
                    v-model="form.ENGINE_NUM"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Номер кузова -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Номер кузова</label>
                  <input
                    v-model="form.BODY_NUM"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Тип КПП -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Тип КПП</label>
                  <input
                    v-model="form.KPP_TYPE"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- ПТС серия -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">ПТС серия</label>
                  <input
                    v-model="form.PTS_SER"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- ПТС номер -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">ПТС номер</label>
                  <input
                    v-model="form.PTS_NUM"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Дата продажи -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Дата продажи</label>
                  <input
                    v-model="form.SELL_DATE"
                    type="date"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Дата выпуска -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Дата выпуска</label>
                  <input
                    v-model="form.CR_TIME"
                    type="date"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Контакт -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Контакт</label>
                  <input
                    v-model="form.CONTACT"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Оформляющий наименование -->
                <div class="col-span-2">
                  <label class="block text-sm text-gray-400 mb-1">Оформляющий</label>
                  <input
                    v-model="form.OFORMLEN_NA"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Адрес ТО -->
                <div class="col-span-2">
                  <label class="block text-sm text-gray-400 mb-1">Адрес ТО</label>
                  <input
                    v-model="form.ADDRESS_TP"
                    type="text"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <!-- Примечание -->
                <div class="col-span-2">
                  <label class="block text-sm text-gray-400 mb-1">Примечание</label>
                  <textarea
                    v-model="form.NOTE"
                    rows="3"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Заказ-наряды Tab -->
          <div v-show="activeTab === 'workorders'" class="p-4">
            <p class="text-gray-500 text-sm">Раздел "Заказ-наряды" пока пустой</p>
          </div>
          
          <!-- История Tab -->
          <div v-show="activeTab === 'history'" class="p-4">
            <p class="text-gray-500 text-sm">Раздел "История" пока пустой</p>
          </div>
          
          <!-- Заказы Tab -->
          <div v-show="activeTab === 'orders'" class="p-4">
            <p class="text-gray-500 text-sm">Раздел "Заказы" пока пустой</p>
          </div>
          
          <!-- Анкета Tab -->
          <div v-show="activeTab === 'questionnaire'" class="p-4">
            <p class="text-gray-500 text-sm">Раздел "Анкета" пока пустой</p>
          </div>
          
          <!-- Рекомендации Tab -->
          <div v-show="activeTab === 'recommendations'" class="p-4">
            <p class="text-gray-500 text-sm">Раздел "Рекомендации" пока пустой</p>
          </div>
          
          <!-- Коммуникации Tab -->
          <div v-show="activeTab === 'communications'" class="p-4">
            <p class="text-gray-500 text-sm">Раздел "Коммуникации" пока пустой</p>
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

  <ClientSearchModal
    :is-open="clientSearchOpen"
    @close="clientSearchOpen = false"
    @select="handleClientSelect"
  />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { carsApi, marksApi, modelsApi, clientsApi } from '../services/api'
import ClientSearchModal from './ClientSearchModal.vue'

const props = defineProps({
  isOpen: Boolean,
  car: Object
})

const emit = defineEmits(['close', 'save', 'edit-client', 'change-client'])

const tabs = [
  { id: 'car', name: 'Автомобиль' },
  { id: 'additional', name: 'Дополнительная информация' },
  { id: 'workorders', name: 'Заказ-наряды' },
  { id: 'history', name: 'История' },
  { id: 'orders', name: 'Заказы' },
  { id: 'questionnaire', name: 'Анкета' },
  { id: 'recommendations', name: 'Рекомендации' },
  { id: 'communications', name: 'Коммуникации' }
]

const activeTab = ref('car')
const saving = ref(false)
const error = ref('')
const marks = ref([])
const models = ref([])
const client = ref(null)
const clientSearchOpen = ref(false)

const loadMarks = async () => {
  try {
    const response = await marksApi.getAll()
    marks.value = response.data
  } catch (err) {
    console.error('Ошибка при загрузке марок:', err)
  }
}

const loadModels = async (markId) => {
  if (!markId) {
    models.value = []
    form.value.MODEL_ID = null
    return
  }
  try {
    const response = await modelsApi.getAll({ MARK_ID: markId })
    models.value = response.data
  } catch (err) {
    console.error('Ошибка при загрузке моделей:', err)
  }
}

const loadClient = async (clientId) => {
  if (!clientId) {
    client.value = null
    return
  }
  try {
    const response = await clientsApi.getById(clientId)
    client.value = response.data
  } catch (err) {
    console.error('Ошибка при загрузке клиента:', err)
    client.value = null
  }
}

onMounted(() => {
  loadMarks()
})

const defaultForm = {
  ID: null,
  CLIENT_ID: null,
  VIN: '',
  NOMER: null,
  DOV_FIO: null,
  DOV_ADDRESS: null,
  DOV_PHONE: null,
  MARK_ID: null,
  MODEL_ID: null,
  COLOR_ID: null,
  SELLER_ID: null,
  SELL_DATE: null,
  CR_YEAR: null,
  ENGINE_NUM: '',
  ENGINE_TYPE: '',
  BODY_NUM: '',
  TRANSMISSION_NUM: null,
  GEAR_TYPE: null,
  KPP_NUM: null,
  KPP_TYPE: '',
  CONTACT: null,
  PTS_SER: '',
  PTS_NUM: '',
  PTS_GIBDD: null,
  PTS_U_GIBDD: null,
  CARD_ID: null,
  CR_TIME: null,
  NOTE: null,
  OFORMLEN_NA: null,
  OFORMLEN_ID: null,
  ADDRESS_TP: null
}

const form = ref({ ...defaultForm })
const originalData = ref({})

watch(() => props.car, async (newCar) => {
  if (newCar) {
    form.value = { ...defaultForm, ...newCar }
    originalData.value = { ...newCar }
    if (newCar.MARK_ID) {
      await loadModels(newCar.MARK_ID)
    }
    if (newCar.CLIENT_ID) {
      await loadClient(newCar.CLIENT_ID)
    } else {
      client.value = null
    }
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    error.value = ''
    client.value = null
  }
})

watch(() => form.value.MARK_ID, async (newMarkId) => {
  if (newMarkId) {
    await loadModels(newMarkId)
  } else {
    models.value = []
    form.value.MODEL_ID = null
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
    await carsApi.update(form.value.ID, changedFields)
    emit('save', form.value)
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Ошибка при сохранении автомобиля'
    console.error('Ошибка при сохранении автомобиля:', err)
  } finally {
    saving.value = false
  }
}

const openClientSearch = () => {
  clientSearchOpen.value = true
}

const handleClientSelect = async (newClient) => {
  form.value.CLIENT_ID = newClient.ID
  client.value = newClient
  emit('change-client', newClient)
  clientSearchOpen.value = false
}
</script>
