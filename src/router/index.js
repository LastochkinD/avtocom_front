import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ClientsView from '../views/ClientsView.vue'
import CarsView from '../views/CarsView.vue'
import NomenclatureView from '../views/NomenclatureView.vue'
import PrihodView from '../views/PrihodView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/spravochnik/clients',
    name: 'clients',
    component: ClientsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/spravochnik/cars',
    name: 'cars',
    component: CarsView,
    meta: { requiresAuth: true }
  },
{
    path: '/spravochnik/nomenclature',
    name: 'nomenclature',
    component: NomenclatureView,
    meta: { requiresAuth: true }
  },
  {
    path: '/sklad/prihod',
    name: 'prihod',
    component: PrihodView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Проверяем авторизацию при каждом переходе
  authStore.checkAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
