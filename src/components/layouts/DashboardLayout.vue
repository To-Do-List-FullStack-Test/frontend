<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-tasks"></i>
          <span v-if="!sidebarCollapsed" class="logo-text">Todo App</span>
        </div>
        <button @click="toggleSidebar" class="sidebar-toggle">
          <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li v-for="item in menuItems" :key="item.name" class="nav-item">
            <router-link
              :to="{ name: item.name }"
              class="nav-link"
              :class="{ 'active': isActiveRoute(item.name) }"
            >
              <i :class="item.icon"></i>
              <span v-if="!sidebarCollapsed" class="nav-text">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info" v-if="!sidebarCollapsed">
          <div class="user-avatar">
            <img
              v-if="authStore.userImage"
              :src="authStore.userImage"
              :alt="authStore.userFullName"
              class="avatar-image"
            />
            <div v-else class="avatar-placeholder">
              <i class="fas fa-user"></i>
            </div>
          </div>
          <div class="user-details">
            <p class="user-name">{{ authStore.userFullName }}</p>
            <p class="user-email">{{ authStore.userEmail }}</p>
          </div>
        </div>
        <button @click="logout" class="logout-button" :title="sidebarCollapsed ? 'Logout' : ''">
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="!sidebarCollapsed">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Top Navigation -->
      <header class="top-nav">
        <div class="nav-left">
          <button @click="toggleSidebar" class="mobile-menu-button">
            <i class="fas fa-bars"></i>
          </button>
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>

        <div class="nav-right">
          <!-- Notifications -->
          <div class="notification-dropdown">
            <button @click="toggleNotifications" class="notification-button">
              <i class="fas fa-bell"></i>
              <span v-if="notificationStore.unreadCount > 0" class="notification-badge">
                {{ notificationStore.unreadCount }}
              </span>
            </button>

            <div v-if="showNotifications" class="notification-panel">
              <div class="notification-header">
                <h3>Notifications</h3>
                <button @click="markAllAsRead" class="mark-all-button">
                  All marked as seen
                </button>
              </div>

              <div class="notification-list">
                <div
                  v-for="notification in recentNotifications"
                  :key="notification.id"
                  class="notification-item"
                  :class="{ 'unread': !notification.is_read }"
                  @click="markAsRead(notification)"
                >
                  <div class="notification-icon" :class="notification.type">
                    <i :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <h4>{{ notification.title }}</h4>
                    <p>{{ notification.message }}</p>
                    <span class="notification-time">{{ formatTime(notification.created_at) }}</span>
                  </div>
                </div>

                <div v-if="recentNotifications.length === 0" class="no-notifications">
                  <i class="fas fa-bell-slash"></i>
                  <p>No notification</p>
                </div>
              </div>

              <div class="notification-footer">
                <router-link to="/notifications" class="view-all-link">
                  See All notifications
                </router-link>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="user-menu">
            <button @click="toggleUserMenu" class="user-menu-button">
              <img
                v-if="authStore.userImage"
                :src="authStore.userImage"
                :alt="authStore.userFullName"
                class="user-avatar-small"
              />
              <div v-else class="user-avatar-small placeholder">
                <i class="fas fa-user"></i>
              </div>
              <span class="user-name-small">{{ authStore.userFullName }}</span>
              <i class="fas fa-chevron-down"></i>
            </button>

            <div v-if="showUserMenu" class="user-menu-panel">
              <div class="user-menu-header">
                <div class="user-info">
                  <img
                    v-if="authStore.userImage"
                    :src="authStore.userImage"
                    :alt="authStore.userFullName"
                    class="user-avatar-large"
                  />
                  <div v-else class="user-avatar-large placeholder">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="user-details">
                    <p class="user-name">{{ authStore.userFullName }}</p>
                    <p class="user-email">{{ authStore.userEmail }}</p>
                  </div>
                </div>
              </div>

              <div class="user-menu-actions">
                <router-link to="/profile" class="menu-action">
                  <i class="fas fa-user"></i>
                  My profile
                </router-link>
                <router-link to="/notifications" class="menu-action">
                  <i class="fas fa-bell"></i>
                  Notifications
                </router-link>
                <button @click="logout" class="menu-action danger">
                  <i class="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>

    <!-- Overlay pour mobile -->
    <div
      v-if="showMobileMenu"
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'


const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const sidebarCollapsed = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const menuItems = [
  { name: 'Dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { name: 'Tasks', label: 'My Tasks', icon: 'fas fa-tasks' },
  { name: 'Notifications', label: 'Notifications', icon: 'fas fa-bell' },
  { name: 'Profile', label: 'My Profile', icon: 'fas fa-user' }
]

const currentPageTitle = computed(() => {
  const item = menuItems.find(item => item.name === route.name)
  return item ? item.label : 'Todo App'
})

const recentNotifications = computed(() => {
  return notificationStore.notifications.slice(0, 5)
})


function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
}


function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    showUserMenu.value = false
  }
}


function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
  if (showUserMenu.value) {
    showNotifications.value = false
  }
}


function closeMobileMenu() {
  showMobileMenu.value = false
}


function isActiveRoute(routeName) {
  return route.name === routeName
}


async function markAsRead(notification) {
  if (!notification.is_read) {
    await notificationStore.markAsRead(notification.id)
  }
}


async function markAllAsRead() {
  await notificationStore.markAllAsRead()
}


async function logout() {
  if (confirm('Are you sure you want to logout ?')) {
    await authStore.logout()
    router.push({ name: 'Login' })
  }
}


function getNotificationIcon(type) {
  const icons = {
    success: 'fas fa-check-circle',
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle'
  }
  return icons[type] || 'fas fa-bell'
}


function formatTime(date) {
  const now = new Date()
  const notificationDate = new Date(date)
  const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60))

  if (diffInMinutes < 1) {
    return 'Now'
  } else if (diffInMinutes < 60) {
    return ` ${diffInMinutes} minutes ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return ` ${hours}hours ago`
  } else {
    return notificationDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    })
  }
}


function handleClickOutside(event) {
  if (!event.target.closest('.notification-dropdown')) {
    showNotifications.value = false
  }
  if (!event.target.closest('.user-menu')) {
    showUserMenu.value = false
  }
}


function handleResize() {
  if (window.innerWidth < 768) {
    sidebarCollapsed.value = true
  }
}


function initializeLayout() {
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    sidebarCollapsed.value = savedState === 'true'
  }

  handleResize()
}


onMounted(() => {
  initializeLayout()
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)

  notificationStore.fetchNotifications({ per_page: 5 })
})


onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f7fafc;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo i {
  font-size: 1.5rem;
  color: #667eea;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.sidebar-toggle:hover {
  background: #f7fafc;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  background: #f7fafc;
  color: #2d3748;
}

.nav-link.active {
  background: #e6fffa;
  color: #234e52;
  border-right: 3px solid #38a169;
}

.nav-link i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-weight: 500;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 2px 0;
  font-size: 0.9rem;
}

.user-email {
  color: #718096;
  margin: 0;
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-button {
  width: 100%;
  background: #fed7d7;
  color: #742a2a;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background: #feb2b2;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

/* Top Navigation */
.top-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.mobile-menu-button:hover {
  background: #f7fafc;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Notifications */
.notification-dropdown {
  position: relative;
}

.notification-button {
  position: relative;
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.notification-button:hover {
  background: #f7fafc;
}

.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #e53e3e;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 8px;
}

.notification-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.mark-all-button {
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.mark-all-button:hover {
  background: #f0f4ff;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f7fafc;
}

.notification-item:hover {
  background: #f7fafc;
}

.notification-item.unread {
  background: #f0f4ff;
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
}

.notification-icon.success {
  background: #38a169;
}

.notification-icon.info {
  background: #3182ce;
}

.notification-icon.warning {
  background: #ed8936;
}

.notification-icon.error {
  background: #e53e3e;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.notification-content p {
  font-size: 0.8rem;
  color: #4a5568;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.7rem;
  color: #a0aec0;
}

.no-notifications {
  text-align: center;
  padding: 40px 20px;
  color: #a0aec0;
}

.no-notifications i {
  font-size: 2rem;
  margin-bottom: 8px;
  display: block;
}

.notification-footer {
  padding: 12px 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.view-all-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.view-all-link:hover {
  text-decoration: underline;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-menu-button:hover {
  background: #f7fafc;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-small.placeholder {
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  font-size: 0.8rem;
}

.user-name-small {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.9rem;
}

.user-menu-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 8px;
}

.user-menu-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-large.placeholder {
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  font-size: 1.2rem;
}

.user-menu-actions {
  padding: 8px 0;
}

.menu-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #4a5568;
  text-decoration: none;
  transition: background-color 0.2s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
}

.menu-action:hover {
  background: #f7fafc;
}

.menu-action.danger {
  color: #e53e3e;
}

.menu-action.danger:hover {
  background: #fed7d7;
}

/* Page Content */
.page-content {
  flex: 1;
  padding: 24px;
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .mobile-menu-button {
    display: block;
  }

  .mobile-overlay {
    display: block;
  }

  .notification-panel {
    width: 300px;
    right: -50px;
  }

  .user-menu-panel {
    width: 250px;
  }

  .user-name-small {
    display: none;
  }
}
</style>
