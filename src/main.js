import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Инициализация проверки аутентификации при запуске приложения
router.isReady().then(() => {
  const authStore = useAuthStore()
  authStore.checkAuth()
})

app.mount('#app')
