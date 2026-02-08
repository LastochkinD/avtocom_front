<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <SidebarMenu />
    
    <!-- Основной контент -->
    <main class="ml-64 min-h-screen">
      <div class="p-8">
        <!-- Приветствие -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">Добро пожаловать! 👋</h2>
          <p class="text-gray-400">Вы успешно авторизовались в системе управления автосервисом.</p>
        </div>

        <!-- Карточка с разрешениями -->
        <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-700/50 bg-gray-700/20">
            <h3 class="text-lg font-semibold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Ваши разрешения
            </h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(value, key) in authStore.permissions"
                :key="key"
                class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                :class="value ? 'bg-green-500/5 hover:bg-green-500/10' : 'bg-gray-700/20'"
              >
                <div 
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="value ? 'bg-green-500/20' : 'bg-gray-600/30'"
                >
                  <svg 
                    v-if="value" 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-4 w-4 text-green-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg 
                    v-else 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-4 w-4 text-gray-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span 
                  class="text-sm font-medium"
                  :class="value ? 'text-gray-200' : 'text-gray-500'"
                >
                  {{ formatPermission(key) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Статистика -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h4 class="text-3xl font-bold text-white">{{ activePermissions }}</h4>
            <p class="text-gray-400 text-sm mt-1">Активных разрешений</p>
          </div>

          <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h4 class="text-3xl font-bold text-white">{{ totalPermissions - activePermissions }}</h4>
            <p class="text-gray-400 text-sm mt-1">Ограниченных прав</p>
          </div>

          <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h4 class="text-3xl font-bold text-white">{{ Math.round((activePermissions / totalPermissions) * 100) }}%</h4>
            <p class="text-gray-400 text-sm mt-1">Доступ к системе</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import SidebarMenu from '../components/SidebarMenu.vue'

const authStore = useAuthStore()

const totalPermissions = computed(() => {
  return authStore.permissions ? Object.keys(authStore.permissions).length : 0
})

const activePermissions = computed(() => {
  if (!authStore.permissions) return 0
  return Object.values(authStore.permissions).filter(Boolean).length
})

const formatPermission = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/can /g, '')
    .replace(/\b\w/g, l => l.toUpperCase())
}
</script>
