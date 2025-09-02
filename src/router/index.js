import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy-load views
const AuthLayout = () => import('../components/layouts/AuthLayout.vue')
const DashboardLayout = () => import('../components/layouts/DashboardLayout.vue')

const Login = () => import('../views/auth/loginView.vue')
const Register = () => import('../views/auth/registerView.vue')

const Dashboard = () => import('../views/DashboardView.vue')
const Tasks = () => import('../views/TaskView.vue')
const TaskDetails = () => import('../views/TaskDetailsView.vue')
const Notifications = () => import('../views/NotificationsView.vue')
const Profile = () => import('../views/ProfileView.vue')
const NotFound = () => import('../views/NotFoundView.vue')

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      { path: 'login', name: 'Login', component: Login, meta: { title: 'Sign In', requiresGuest: true } },
      { path: 'register', name: 'Register', component: Register, meta: { title: 'Sign Up', requiresGuest: true } }
    ]
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: Dashboard, meta: { title: 'Dashboard', requiresAuth: true } },
      { path: 'tasks', name: 'Tasks', component: Tasks, meta: { title: 'My Tasks', requiresAuth: true } },
      { path: 'tasks/:id', name: 'TaskDetails', component: TaskDetails, meta: { title: 'TaskDetails', requiresAuth: true }, props: true },
      { path: 'notifications', name: 'Notifications', component: Notifications, meta: { title: 'Notifications', requiresAuth: true } },
      { path: 'profile', name: 'Profile', component: Profile, meta: { title: 'My Profile', requiresAuth: true } }
    ]
  },
  { path: '/login', redirect: '/auth/login' },
  { path: '/register', redirect: '/auth/register' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: 'Page not found' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_, __, saved) {
    return saved ?? { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated && localStorage.getItem('token')) {
    auth.initializeAuth()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  if (to.meta.title) {
    document.title = `${to.meta.title} - Todo App`
  }

  next()
})

export default router
