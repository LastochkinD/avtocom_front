<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <SidebarMenu />
    
    <!-- Основной контент -->
    <main class="ml-64 min-h-screen">
      <div class="p-6 space-y-6">
        <!-- Заголовок -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-white">Группы работ</h1>
            <p class="text-gray-400 mt-1">Управление группами работ</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="addGroup"
              class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Добавить группу
            </button>
            <button
              @click="refreshGroups"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Обновить
            </button>
          </div>
        </div>

        <!-- Сообщение об ошибке -->
        <div v-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p class="text-red-400">{{ error }}</p>
        </div>

        <!-- Таблица групп работ -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-700/80">
                <tr>
                  <th class="px-4 py-3 text-left text-gray-300 font-medium">ID</th>
                  <th class="px-4 py-3 text-left text-gray-300 font-medium">Код</th>
                  <th class="px-4 py-3 text-left text-gray-300 font-medium">Название</th>
                  <th class="px-4 py-3 text-left text-gray-300 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-600/50">
                <tr v-for="group in worksGroups" :key="group.ID" class="hover:bg-gray-700/50">
                  <td class="px-4 py-3 text-gray-300">{{ group.ID }}</td>
                  <td class="px-4 py-3 text-white font-medium">{{ group.WG_CODE }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ group.WORKS_GROUP_NAME }}</td>
                  <td class="px-4 py-3 text-right space-x-2">
                    <button
                      @click="editGroup(group)"
                      class="text-primary-400 hover:text-primary-300 p-1"
                      title="Редактировать"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteGroup(group)"
                      class="text-red-400 hover:text-red-300 p-1"
                      title="Удалить"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="loading">
                  <td :colspan="4" class="px-4 py-6 text-center text-gray-400">
                    <div class="flex justify-center items-center space-x-2">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                      <span>Загрузка данных...</span>
                    </div>
                  </td>
                </tr>
                <tr v-if="!loading && worksGroups.length === 0">
                  <td :colspan="4" class="px-4 py-6 text-center text-gray-400">
                    Список групп работ пуст
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Статистика -->
        <div v-if="worksGroups.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <div class="text-sm text-gray-400">Всего групп</div>
            <div class="text-2xl font-bold text-white">{{ worksGroups.length }}</div>
          </div>
          <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <div class="text-sm text-gray-400">Среднее количество работ</div>
            <div class="text-2xl font-bold text-white">{{ averageWorksPerGroup.toFixed(1) }}</div>
          </div>
        </div>
      </div>
    </main>

    <!-- Модальное окно редактирования группы -->
    <GroupEditModal
      :is-open="isModalOpen"
      :group="selectedGroup"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { worksGroupsApi } from '../services/api'
import GroupEditModal from '../components/GroupEditModal.vue'

const worksGroups = ref([])
const loading = ref(false)
const error = ref('')

const isModalOpen = ref(false)
const selectedGroup = ref(null)

const loadGroups = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await worksGroupsApi.getAll()
    worksGroups.value = response.data
  } catch (err) {
    console.error('Ошибка при загрузке групп работ:', err)
    error.value = err.response?.data?.detail || 'Ошибка при загрузке групп работ'
  } finally {
    loading.value = false
  }
}

const averageWorksPerGroup = computed(() => {
  // Здесь можно добавить логику подсчета среднего количества работ в группах
  // Пока возвращаем 0, так как у нас нет информации о количестве работ в каждой группе
  return 0
})

const refreshGroups = () => {
  loadGroups()
}

const addGroup = () => {
  selectedGroup.value = null
  isModalOpen.value = true
}

const editGroup = (group) => {
  selectedGroup.value = group
  isModalOpen.value = true
}

const handleSave = async (groupData) => {
  try {
    if (selectedGroup.value) {
      // Редактирование существующей группы
      await worksGroupsApi.update(selectedGroup.value.ID, groupData)
      // Обновляем данные в списке
      const index = worksGroups.value.findIndex(g => g.ID === selectedGroup.value.ID)
      if (index !== -1) {
        worksGroups.value[index] = { ...worksGroups.value[index], ...groupData }
      }
    } else {
      // Добавление новой группы
      const response = await worksGroupsApi.create(groupData)
      worksGroups.value.unshift(response.data)
    }
    isModalOpen.value = false
    // Перезагружаем список для обновления всех данных
    loadGroups()
  } catch (err) {
    console.error('Ошибка при сохранении группы:', err)
    error.value = err.response?.data?.detail || 'Ошибка при сохранении группы'
  }
}

const deleteGroup = async (group) => {
  if (!confirm(`Вы уверены, что хотите удалить группу "${group.WORKS_GROUP_NAME}"?`)) {
    return
  }
  
  try {
    await worksGroupsApi.delete(group.ID)
    // Удаляем группу из списка
    const index = worksGroups.value.findIndex(g => g.ID === group.ID)
    if (index !== -1) {
      worksGroups.value.splice(index, 1)
    }
  } catch (err) {
    console.error('Ошибка при удалении группы:', err)
    error.value = err.response?.data?.detail || 'Ошибка при удалении группы'
  }
}

// Загружаем данные при монтировании
onMounted(() => {
  loadGroups()
})
</script>