<template>
  <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
      <!-- Заголовок -->
      <div class="flex justify-between items-center p-6 border-b border-gray-700">
        <h3 class="text-lg font-semibold text-white">{{ work ? 'Редактировать работу' : 'Добавить работу' }}</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Форма -->
      <form @submit.prevent="saveWork" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Код</label>
          <input
            v-model="formData.CODE"
            type="text"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            placeholder="Введите код работы"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Название</label>
          <input
            v-model="formData.NAME"
            type="text"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            placeholder="Введите название работы"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Количество</label>
          <input
            v-model.number="formData.KOL"
            type="number"
            step="0.01"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            placeholder="Введите количество"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Цена</label>
          <input
            v-model.number="formData.PRICE"
            type="number"
            step="0.01"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            placeholder="Введите цену"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Группа работ</label>
          <input
            v-model="formData.WORKS_GROUP_NAME"
            type="text"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            placeholder="Введите группу работ"
          />
        </div>

        <!-- Кнопки -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  work: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isModalOpen = ref(false)
const formData = ref({
  CODE: '',
  NAME: '',
  KOL: 0,
  PRICE: 0,
  WORKS_GROUP_NAME: ''
})

// Синхронизация модального окна с пропсами
watch(() => props.isOpen, (newVal) => {
  isModalOpen.value = newVal
  if (newVal && props.work) {
    // Заполняем форму данными из редактируемой работы
    formData.value = {
      CODE: props.work.CODE || '',
      NAME: props.work.NAME || '',
      KOL: props.work.KOL || 0,
      PRICE: props.work.PRICE || 0,
      WORKS_GROUP_NAME: props.work.WORKS_GROUP_NAME || ''
    }
  } else if (newVal) {
    // Очищаем форму для новой работы
    formData.value = {
      CODE: '',
      NAME: '',
      KOL: 0,
      PRICE: 0,
      WORKS_GROUP_NAME: ''
    }
  }
})

const saveWork = () => {
  emit('save', formData.value)
}
</script>