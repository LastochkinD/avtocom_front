<template>
  <aside class="fixed left-0 top-0 h-full w-64 bg-gray-800/80 backdrop-blur-xl border-r border-gray-700/50 z-30 flex flex-col">
    <!-- Логотип -->
    <div class="p-4 border-b border-gray-700/50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        </div>
        <span class="text-xl font-bold text-white">AvtoKom</span>
      </div>
    </div>

    <!-- Меню -->
    <nav class="flex-1 overflow-y-auto p-4">
      <ul class="space-y-1">
        <!-- Раздел Сервис -->
        <li v-if="hasAnyServicePermission">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
            Сервис
          </div>
          <ul class="space-y-1">
            <li>
              <router-link
                to="/dashboard"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Главная
              </router-link>
            </li>
            <li v-if="authStore.hasPermission('can_create_zn')">
              <router-link
                to="/service/zn"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Заказ-наряды
              </router-link>
            </li>
            <li v-if="authStore.hasPermission('can_create_nakl')">
              <router-link
                to="/service/nakl"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Накладные
              </router-link>
            </li>
          </ul>
        </li>

        <!-- Раздел Склад -->
        <li v-if="hasAnySkladPermission">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-4">
            Склад
          </div>
          <ul class="space-y-1">
            <li v-if="authStore.hasPermission('can_add_parts')">
              <router-link
                to="/sklad/parts"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Запчасти
              </router-link>
            </li>
            <li v-if="authStore.hasPermission('can_accept_prihod')">
              <router-link
                to="/sklad/prihod"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Приход
              </router-link>
            </li>
            <li v-if="authStore.hasPermission('can_update_part_kol')">
              <router-link
                to="/sklad/movement"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Перемещение
              </router-link>
            </li>
          </ul>
        </li>

        <!-- Раздел Справочники -->
        <li v-if="hasAnySpravochnikPermission">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-4">
            Справочники
          </div>
          <ul class="space-y-1">
            <li>
              <router-link
                to="/spravochnik/clients"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Клиенты
              </router-link>
            </li>
            <li v-if="authStore.hasPermission('can_edit_nom')">
              <router-link
                to="/spravochnik/nomenclature"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Номенклатура
              </router-link>
            </li>
            <li>
              <router-link
                to="/spravochnik/cars"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Автомобили
              </router-link>
            </li>
          </ul>
        </li>

        <!-- Раздел Разное -->
        <li v-if="hasAnyRaznoePermission">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-4">
            Разное
          </div>
          <ul class="space-y-1">
            <li>
              <router-link
                to="/raznoe/report"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Отчёты
              </router-link>
            </li>
            <li>
              <router-link
                to="/raznoe/calendar"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Календарь
              </router-link>
            </li>
          </ul>
        </li>

        <!-- Раздел Настройки (только с can_edit_sys_settings) -->
        <li v-if="authStore.hasPermission('can_edit_sys_settings')">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-4">
            Настройки
          </div>
          <ul class="space-y-1">
            <li v-if="authStore.hasPermission('can_edit_settings')">
              <router-link
                to="/settings"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                active-class="bg-primary-500/20 text-primary-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Настройки системы
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const hasAnyServicePermission = computed(() => {
  return authStore.hasPermission('can_create_zn') || 
         authStore.hasPermission('can_create_nakl')
})

const hasAnySkladPermission = computed(() => {
  return authStore.hasPermission('can_add_parts') || 
         authStore.hasPermission('can_accept_prihod') ||
         authStore.hasPermission('can_update_part_kol')
})

const hasAnySpravochnikPermission = computed(() => {
  return authStore.hasPermission('can_edit_nom') || true // Клиенты и авто доступны всем
})

const hasAnyRaznoePermission = computed(() => {
  return true // Разное доступно всем авторизованным
})
</script>
