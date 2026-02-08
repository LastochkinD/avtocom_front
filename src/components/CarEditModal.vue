<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Modal -->
      <div class="relative bg-gray-800 rounded-xl border border-gray-700 w-full max-w-3xl mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
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
        
        <!-- Form -->
        <form @submit.prevent="save" class="flex-1 overflow-y-auto p-4">
          <!-- Error message -->
          <div v-if="error" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {{ error }}
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- VIN -->
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-1">VIN *</label>
              <input
                v-model="form.VIN"
                type="text"
                required
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <!-- Номер -->
            <div>
              <label class="block text-sm text-gray-400 mb-1">Государственный номер</label>
              <input
                v-model="form.NOMER"
                type="text"
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
            
            <!-- Марка ID -->
            <div>
              <label class="block text-sm text-gray-400 mb-1">ID Марки</label>
              <input
                v-model.number="form.MARK_ID"
                type="number"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <!-- Модель ID -->
            <div>
              <label class="block text-sm text-gray-400 mb-1">ID Модели</label>
              <input
                v-model.number="form.MODEL_ID"
                type="number"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <!-- Цвет ID -->
            <div>
              <label class="block text-sm text-gray-400 mb-1">ID Цвета</label>
              <input
                v-model.number="form.COLOR_ID"
                type="number"
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
            
            <!-- Доверенное лицо ФИО -->
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-1">Доверенное лицо ФИО</label>
              <input
                v-model="form.DOV_FIO"
                type="text"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <!-- Доверенное лицо адрес -->
            <div class="col-span-2">
              <label class="block text-sm text-gray-400 mb-1">Доверенное лицо адрес</label>
              <input
                v-model="form.DOV_ADDRESS"
                type="text"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <!-- Доверенное лицо телефон -->
            <div>
              <label class="block text-sm text-gray-400 mb-1">Доверенное лицо телефон</label>
              <input
                v-model="form.DOV_PHONE"
                type="text"
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
import { carsApi } from '../services/api'

const props = defineProps({
  isOpen: Boolean,
  car: Object
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref('')

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

watch(() => props.car, (newCar) => {
  if (newCar) {
    form.value = { ...defaultForm, ...newCar }
    originalData.value = { ...newCar }
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    error.value = ''
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
</script>
