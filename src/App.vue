<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <SidebarMenu v-if="!isLoginPage" />
    <div>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarMenu from './components/SidebarMenu.vue'

const route = useRoute()

const isLoginPage = computed(() => {
  return route.name === 'login'
})
</script>

