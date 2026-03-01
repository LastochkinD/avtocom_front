import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ClientsView from '../views/ClientsView.vue'
import CarsView from '../views/CarsView.vue'
import NomenclatureView from '../views/NomenclatureView.vue'
import WorksBaseView from '../views/WorksBaseView.vue'
import PrihodView from '../views/PrihodView.vue'
import RashodView from '../views/RashodView.vue'
import DocsView from '../views/DocsView.vue'
import DocEditView from '../views/DocEditView.vue'

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
    path: '/spravochnik/works_base',
    name: 'works_base',
    component: WorksBaseView,
    meta: { requiresAuth: true }
  },
{
    path: '/sklad/prihod',
    name: 'prihod',
    component: PrihodView,
    meta: { requiresAuth: true }
  },
{
    path: '/sklad/rashod',
    name: 'rashod',
    component: RashodView,
    meta: { requiresAuth: true }
  },
  {
    path: '/service/zn',
    name: 'zn',
    component: DocsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/service/zn/edit/:id',
    name: 'doc-edit',
    component: DocEditView,
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Проверяем авторизацию при каждом переходе
  try {
    await authStore.checkAuth()
  } catch (error) {
    // Если произошла ошибка при проверке, считаем пользователя неавторизованным
    console.error('Ошибка проверки аутентификации:', error)
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
