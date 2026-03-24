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
              <button
                @click="exportToPDF"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Экспорт в PDF
              </button>
            </div>
          </div>

          <!-- Сообщение об ошибке -->
          <div v-if="formError" class="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p class="text-red-400">{{ formError }}</p>
          </div>

          <!-- Вкладки -->
          <div class="border-b border-gray-700/50 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button
                @click="activeTab = 'main'"
                :class="[
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'main'
                    ? 'text-primary-400 border-primary-400'
                    : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
                ]"
              >
                Основная информация
              </button>
              <button
                @click="activeTab = 'client'"
                :class="[
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'client'
                    ? 'text-primary-400 border-primary-400'
                    : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
                ]"
              >
                Клиент
              </button>
              <button
                @click="activeTab = 'additional'"
                :class="[
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'additional'
                    ? 'text-primary-400 border-primary-400'
                    : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
                ]"
              >
                Дополнительная информация
              </button>
            </nav>
          </div>

          <!-- Форма -->
          <form @submit.prevent="save" class="space-y-6">
            <!-- Вкладка: Основная информация -->
            <div v-show="activeTab === 'main'" class="space-y-6">
              <div class="bg-gray-700/50 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                  <!-- Владелец -->
                  <div class="md:col-span-4">
                    <label class="block text-sm text-gray-400 mb-2">Владелец</label>
                    <input
                      v-model="form.DOV_FIO"
                      type="text"
                      class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Вкладка: Клиент -->
            <div v-show="activeTab === 'client'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-6">
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">Информация о клиенте</h3>

                  <div class="space-y-4">
                    <!-- Клиент -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Клиент</label>
                      <input
                        v-model="form.CLIENT_ID"
                        type="text"
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
                  </div>
                </div>
              </div>

              <!-- Статусы -->
              <div class="space-y-6">
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">Статусы</h3>

                  <div class="space-y-4">
                    <div class="grid grid-cols-1 gap-4">
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
              </div>
            </div>

            <!-- Вкладка: Дополнительная информация -->
            <div v-show="activeTab === 'additional'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-6">
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">Примечание</h3>
                  <textarea
                    v-model="form.NOTE"
                    rows="6"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
                    placeholder="Дополнительные комментарии..."
                  ></textarea>
                </div>

                <!-- Финансовая информация -->
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">Финансовая информация</h3>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <!-- Скидка на работы -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Скидка на работы (%)</label>
                      <input
                        v-model="form.SKIDKA_W"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <!-- Скидка на запчасти -->
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Скидка на запчасти (%)</label>
                      <input
                        v-model="form.SKIDKA_P"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Автомобиль и техническая информация -->
              <div class="space-y-6">
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">Автомобиль</h3>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm text-gray-400 mb-2">Автомобиль</label>
                      <input
                        v-model="form.CAR_ID"
                        type="text"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div class="bg-gray-700/50 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">Техническая информация</h3>

                  <div class="space-y-4">
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

        <!-- Список работ -->
        <div v-if="doc" class="mt-6">
          <WorksTable
            :doc-id="doc.ID"
            :skidka-w="form.SKIDKA_W || 0"
            @add-work="handleAddWork"
            @edit-work="handleEditWork"
            @refresh="refreshData"
          />
        </div>

        <!-- Список запчастей -->
        <div v-if="doc" class="mt-6">
          <PartsTable
            :doc-id="doc.ID"
            :skidka-p="form.SKIDKA_P || 0"
            @add-part="handleAddPart"
            @edit-part="handleEditPart"
            @refresh="refreshData"
          />
        </div>

        <!-- Итоговая информация -->
        <div v-if="doc" class="mt-6 bg-gray-800 rounded-xl border border-gray-700/50 p-6">
          <h3 class="text-white font-medium mb-4">Итоговая информация</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-700/50 rounded-lg p-4">
              <div class="text-sm text-gray-400">Скидка на работы</div>
              <div class="text-lg font-bold text-white">{{ form.SKIDKA_W || 0 }}%</div>
            </div>
            <div class="bg-gray-700/50 rounded-lg p-4">
              <div class="text-sm text-gray-400">Скидка на запчасти</div>
              <div class="text-lg font-bold text-white">{{ form.SKIDKA_P || 0 }}%</div>
            </div>
            <div class="bg-gray-700/50 rounded-lg p-4">
              <div class="text-sm text-gray-400">Общая сумма</div>
              <div class="text-lg font-bold text-white">{{ calculateTotalAmount().toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Модальное окно печати -->
    <PrintModal
      v-if="showPrintModal && doc"
      :work-order-id="doc.ID"
      @close="showPrintModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { docsApi } from '../services/api'
import SidebarMenu from '../components/SidebarMenu.vue'
import PartsTable from '../components/PartsTable.vue'
import WorksTable from '../components/WorksTable.vue'
import PrintModal from '../components/PrintModal.vue'

const showPrintModal = ref(false)

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const doc = ref(null)
const saving = ref(false)
const formError = ref('')
const activeTab = ref('main')

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
      SKIDKA_W: doc.value.SKIDKA_W || 0,
      SKIDKA_P: doc.value.SKIDKA_P || 0,
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

const calculateTotalAmount = () => {
  // This is a placeholder - in a real implementation, you would fetch the actual work and part totals
  // For now, we'll return the form.SUMMA value
  return form.value.SUMMA || 0
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

// Функции для печати
const openPrintModal = () => {
  // Открываем модальное окно печати
  console.log('Открыть модальное окно печати для заказ-наряда:', doc.value.ID)
  showPrintModal.value = true
}

const exportToPDF = () => {
  // Открываем новое окно с содержимым для печати
  const printWindow = window.open('', '_blank')
  
  // Получаем данные заказ-наряда
  const workOrderData = {
    NUM: form.value.NUM || '',
    OPEN_DATE: form.value.OPEN_DATE ? new Date(form.value.OPEN_DATE).toLocaleDateString('ru-RU') : '',
    CLOSE_DATE: form.value.CLOSE_DATE ? new Date(form.value.CLOSE_DATE).toLocaleDateString('ru-RU') : '',
    CLIENT_NAME: form.value.DOV_FIO || 'Не указан',
    CAR_BRAND: 'Автомобиль',
    CAR_MODEL: '',
    CAR_NUMBER: '',
    PROBEG: form.value.PROBEG || 'Не указан',
    SKIDKA_W: form.value.SKIDKA_W || 0,
    SKIDKA_P: form.value.SKIDKA_P || 0,
    NDS: form.value.NDS || 0,
    SUMMA: form.value.SUMMA || 0
  }

  // Создаем HTML для печати
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Заказ-наряд №${workOrderData.NUM}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #ccc;
        }
        .logo-placeholder {
          width: 100px;
          height: 100px;
          background: #f0f0f0;
          border: 1px dashed #999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .company-info {
          flex: 1;
          margin-left: 20px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .company-details {
          font-size: 12px;
          color: #666;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          text-align: center;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        .info-label {
          font-weight: bold;
          color: #555;
        }
        .info-value {
          color: #333;
        }
        .table-container {
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background-color: #f5f5f5;
          padding: 10px;
          text-align: left;
          font-weight: bold;
          color: #333;
          border-bottom: 2px solid #ddd;
        }
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #eee;
        }
        .table-footer {
          display: flex;
          justify-content: flex-end;
          background-color: #f5f5f5;
          padding: 10px;
          border-top: 1px solid #ddd;
        }
        .total-label {
          font-weight: bold;
          margin-right: 20px;
          color: #555;
        }
        .total-amount {
          font-weight: bold;
          color: #333;
        }
        .financial-info {
          margin-bottom: 30px;
        }
        .financial-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .financial-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .financial-label {
          font-weight: bold;
          color: #555;
        }
        .financial-value {
          color: #333;
        }
        .financial-item.total {
          grid-column: 1 / -1;
          background-color: #f5f5f5;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .financial-item.total .financial-label {
          font-size: 16px;
          color: #333;
        }
        .financial-item.total .financial-value {
          font-size: 16px;
          font-weight: bold;
          color: #e74c3c;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #ccc;
        }
        .signatures {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        .signature-block {
          text-align: center;
        }
        .signature-line {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 10px;
        }
        .signature-label {
          font-weight: bold;
          color: #555;
          min-width: 60px;
        }
        .signature-placeholder {
          flex: 1;
          height: 40px;
          border-bottom: 2px solid #333;
        }
        .signature-name {
          font-size: 12px;
          color: #666;
          font-style: italic;
        }
        .footer-text {
          text-align: center;
          font-size: 12px;
          color: #666;
          line-height: 1.6;
        }
        @media print {
          body {
            margin: 0;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-placeholder">
          <div style="text-align: center;">
            <span style="font-size: 12px; color: #666;">ЛОГОТИП</span>
          </div>
        </div>
        <div class="company-info">
          <div class="company-name">Название организации</div>
          <div class="company-details">
            <p>ИНН: 1234567890</p>
            <p>ОГРН: 1234567890123</p>
            <p>Адрес: г. Самара, ул. Примерная, д. 1</p>
            <p>Тел.: +7 (846) 123-45-67</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Заказ-наряд №${workOrderData.NUM} от ${workOrderData.OPEN_DATE}</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Клиент:</span>
            <span class="info-value">${workOrderData.CLIENT_NAME}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Автомобиль:</span>
            <span class="info-value">${workOrderData.CAR_BRAND} ${workOrderData.CAR_MODEL} ${workOrderData.CAR_NUMBER}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Пробег:</span>
            <span class="info-value">${workOrderData.PROBEG} км</span>
          </div>
          <div class="info-item">
            <span class="info-label">Дата открытия:</span>
            <span class="info-value">${workOrderData.OPEN_DATE}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Дата закрытия:</span>
            <span class="info-value">${workOrderData.CLOSE_DATE || 'Не закрыт'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">Выполненные работы</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Код</th>
                <th>Наименование</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="5" style="text-align: center;">Работы не найдены</td>
              </tr>
            </tbody>
          </table>
          <div class="table-footer">
            <div class="total-label">Итого по работам:</div>
            <div class="total-amount">0.00</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">Использованные запчасти</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Код</th>
                <th>Наименование</th>
                <th>Количество</th>
                <th>Ед. изм.</th>
                <th>Цена</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="6" style="text-align: center;">Запчасти не найдены</td>
              </tr>
            </tbody>
          </table>
          <div class="table-footer">
            <div class="total-label">Итого по запчастям:</div>
            <div class="total-amount">0.00</div>
          </div>
        </div>
      </div>

      <div class="section financial-info">
        <h3 class="section-title">Финансовая информация</h3>
        <div class="financial-grid">
          <div class="financial-item">
            <span class="financial-label">Скидка на работы:</span>
            <span class="financial-value">${workOrderData.SKIDKA_W}%</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">Скидка на запчасти:</span>
            <span class="financial-value">${workOrderData.SKIDKA_P}%</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">НДС (${workOrderData.NDS}%):</span>
            <span class="financial-value">0.00</span>
          </div>
          <div class="financial-item total">
            <span class="financial-label">ИТОГО:</span>
            <span class="financial-value">${workOrderData.SUMMA ? workOrderData.SUMMA.toFixed(2) : '0.00'}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="signatures">
          <div class="signature-block">
            <div class="signature-line">
              <span class="signature-label">Клиент:</span>
              <div class="signature-placeholder"></div>
            </div>
            <div class="signature-name">${workOrderData.CLIENT_NAME}</div>
          </div>
          <div class="signature-block">
            <div class="signature-line">
              <span class="signature-label">Мастер:</span>
              <div class="signature-placeholder"></div>
            </div>
            <div class="signature-name">________________</div>
          </div>
        </div>
        <div class="footer-text">
          <p>Все работы выполнены в соответствии с договором</p>
          <p>Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </div>
    </body>
    </html>
  `

  // Записываем содержимое в новое окно
  printWindow.document.write(printContent)
  printWindow.document.close()

  // Ждем загрузки контента и запускаем печать
  printWindow.onload = function() {
    printWindow.print()
  }
}
</script>
