<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <SidebarMenu />
    
    <!-- Основной контент -->
    <main class="ml-64 min-h-screen">
      <div class="p-6">
        <!-- Хлебные крошки -->
        <nav class="mb-6 text-sm text-gray-400">
          <router-link to="/dashboard" class="hover:text-white">Главная</router-link>
          <span class="mx-2">/</span>
          <router-link to="/service/zn" class="hover:text-white">Заказ-наряды</router-link>
          <span class="mx-2">/</span>
          <span class="text-white">Редактирование</span>
        </nav>

        <!-- Загрузка -->
        <div v-if="loading" class="bg-gray-800 rounded-xl p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p class="mt-4 text-gray-400">Загрузка заказ-наряда...</p>
        </div>

        <!-- Ошибка -->
        <div v-else-if="error" class="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
          <h2 class="text-red-400 font-semibold mb-2">Ошибка загрузки</h2>
          <p class="text-red-300">{{ error }}</p>
          <div class="mt-4 flex gap-3">
            <button
              @click="loadDoc"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Повторить
            </button>
            <router-link
              to="/service/zn"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              К списку заказ-нарядов
            </router-link>
          </div>
        </div>

        <!-- Форма редактирования -->
        <div v-else-if="doc" class="bg-gray-800 rounded-xl border border-gray-700/50 p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h1 class="text-2xl font-bold text-white">Редактирование заказ-наряда</h1>
              <p class="text-gray-400 mt-1">Номер: {{ doc.NUM || 'Не указан' }}</p>
            </div>
            <div class="flex gap-3">
              <router-link
                to="/service/zn"
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Назад к списку
              </router-link>
            </div>
          </div>

          <!-- Сообщение об ошибке -->
          <div v-if="formError" class="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p class="text-red-400">{{ formError }}</p>
          </div>

          <!-- Форма -->
          <form @submit.prevent="save" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Основная информация -->
              <div class="space-y-6">
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">Основная информация</h3>
                  
                  <div class="space-y-4">
                    <!-- Номер -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Номер *</label>
                      <input
                        v-model="form.NUM"
                        type="text"
                        required
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <!-- Дата открытия -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Дата открытия</label>
                      <input
                        v-model="form.OPEN_DATE"
                        type="date"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <!-- Дата закрытия -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Дата закрытия</label>
                      <input
                        v-model="form.CLOSE_DATE"
                        type="date"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <!-- Владелец -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Владелец</label>
                      <input
                        v-model="form.DOV_FIO"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <!-- Пробег -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Пробег</label>
                      <input
                        v-model="form.PROBEG"
                        type="number"
                        step="1"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <!-- Финансовая информация -->
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">Финансовая информация</h3>
                  
                  <div class="space-y-4">
                    <!-- Сумма -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Сумма</label>
                      <input
                        v-model="form.SUMMA"
                        type="number"
                        step="0.01"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <!-- Аванс -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Аванс</label>
                      <input
                        v-model="form.AVANS"
                        type="number"
                        step="0.01"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <!-- НДС -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">НДС (%)</label>
                      <input
                        v-model="form.NDS"
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Справочные данные -->
              <div class="space-y-6">
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">Справочные данные</h3>
                  
                  <div class="space-y-4">
                    <!-- Автомобиль -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Автомобиль</label>
                      <input
                        v-model="form.CAR_ID"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <!-- Клиент -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Клиент</label>
                      <input
                        v-model="form.CLIENT_ID"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <!-- Статусы -->
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="flex items-center gap-2 text-sm text-gray-400">
                          <input
                            v-model="form.PAYED_BOOL"
                            type="checkbox"
                            class="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                          />
                          Оплачен
                        </label>
                      </div>
                      <div>
                        <label class="flex items-center gap-2 text-sm text-gray-400">
                          <input
                            v-model="form.CLOSED_BOOL"
                            type="checkbox"
                            class="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                          />
                          Закрыт
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Примечание -->
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">Примечание</h3>
                  <textarea
                    v-model="form.NOTE"
                    rows="4"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
                    placeholder="Дополнительные комментарии..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Кнопки управления -->
            <div class="flex justify-between pt-6 border-t border-gray-700/50">
              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
                <router-link
                  to="/service/zn"
                  class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Отмена
                </router-link>
              </div>
              
              <button
                type="button"
                @click="resetForm"
                class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Сбросить изменения
              </button>
            </div>
          </form>
        </div>

        <!-- Список запчастей -->
        <div v-if="doc" class="mt-6">
          <PartsTable
            :doc-id="doc.ID"
            @add-part="handleAddPart"
            @edit-part="handleEditPart"
            @refresh="refreshData"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { docsApi } from '../services/api'
import SidebarMenu from '../components/SidebarMenu.vue'
import PartsTable from '../components/PartsTable.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const doc = ref(null)
const saving = ref(false)
const formError = ref('')

const form = ref({
  ID: null,
  NUM: '',
  OPEN_DATE: null,
  CLOSE_DATE: null,
  CAR_ID: null,
  CLIENT_ID: null,
  DOV_FIO: null,
  PROBEG: null,
  SUMMA: null,
  AVANS: null,
  NDS: null,
  PAYED_BOOL: false,
  CLOSED_BOOL: false,
  NOTE: null
})

const originalData = ref({})

const loadDoc = async () => {
  if (loading.value) return
  
  const docId = route.params.id
  if (!docId) {
    error.value = 'Не указан ID заказ-наряда'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    const response = await docsApi.getById(docId)
    doc.value = response.data
    
    // Заполняем форму данными
    form.value = {
      ID: doc.value.ID,
      NUM: doc.value.NUM || '',
      OPEN_DATE: doc.value.OPEN_DATE ? formatDateForInput(doc.value.OPEN_DATE) : null,
      CLOSE_DATE: doc.value.CLOSE_DATE ? formatDateForInput(doc.value.CLOSE_DATE) : null,
      CAR_ID: doc.value.CAR_ID || null,
      CLIENT_ID: doc.value.CLIENT_ID || null,
      DOV_FIO: doc.value.DOV_FIO || null,
      PROBEG: doc.value.PROBEG || null,
      SUMMA: doc.value.SUMMA || null,
      AVANS: doc.value.AVANS || null,
      NDS: doc.value.NDS || null,
      PAYED_BOOL: doc.value.PAYED_BOOL || false,
      CLOSED_BOOL: doc.value.CLOSED_BOOL || false,
      NOTE: doc.value.NOTE || null
    }
    
    originalData.value = { ...form.value }
  } catch (err) {
    console.error('Ошибка при загрузке заказ-наряда:', err)
    if (err.response?.status === 404) {
      error.value = 'Заказ-наряд не найден'
    } else {
      error.value = err.response?.data?.detail || 'Ошибка при загрузке заказ-наряда'
    }
  } finally {
    loading.value = false
  }
}

const save = async () => {
  formError.value = ''
  saving.value = true
  
  try {
    // Проверяем обязательные поля
    if (!form.value.NUM) {
      formError.value = 'Пожалуйста, укажите номер заказ-наряда'
      return
    }

    // Подготавливаем данные для отправки
    const updateData = { ...form.value }
    
    // Преобразуем даты в нужный формат
    if (updateData.OPEN_DATE) {
      updateData.OPEN_DATE = new Date(updateData.OPEN_DATE).toISOString()
    }
    if (updateData.CLOSE_DATE) {
      updateData.CLOSE_DATE = new Date(updateData.CLOSE_DATE).toISOString()
    }

    await docsApi.update(form.value.ID, updateData)
    
    // Перенаправляем обратно к списку
    router.push('/service/zn')
  } catch (err) {
    console.error('Ошибка при сохранении заказ-наряда:', err)
    formError.value = err.response?.data?.detail || 'Ошибка при сохранении изменений'
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  form.value = { ...originalData.value }
  formError.value = ''
}

const handleAddPart = () => {
  // TODO: Реализовать добавление запчасти
  console.log('Добавить запчасть для заказ-наряда:', doc.value.ID)
}

const handleEditPart = (part) => {
  // TODO: Реализовать редактирование запчасти
  console.log('Редактировать запчасть:', part)
}

const refreshData = () => {
  // TODO: Обновить данные заказ-наряда при изменении запчастей
  console.log('Обновить данные')
}

const formatDateForInput = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

// Загружаем данные при монтировании и при изменении ID
onMounted(() => {
  loadDoc()
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    loadDoc()
  }
})
</script>