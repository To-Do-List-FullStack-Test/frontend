<template>
  <aside class="sidebar" :class="{ 'collapsed': collapsed }">
    <div class="sidebar-header">
      <div class="logo">
        <i class="fas fa-tasks"></i>
        <span v-if="!collapsed" class="logo-text">Todo App</span>
      </div>
      <button @click="$emit('toggle')" class="sidebar-toggle">
        <i :class="collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
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
            <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
            <span v-if="!collapsed && item.badge" class="nav-badge">{{ item.badge }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info" v-if="!collapsed">
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
      <button @click="logout" class="logout-button" :title="collapsed ? 'Logout' : ''">
        <i class="fas fa-sign-out-alt"></i>
        <span v-if="!collapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'


const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])

const menuItems = [
  { name: 'Dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { name: 'Tasks', label: 'My Tasks', icon: 'fas fa-tasks' },
  {
    name: 'Notifications',
    label: 'Notifications',
    icon: 'fas fa-bell',
    badge: notificationStore.unreadCount > 0 ? notificationStore.unreadCount : null
  },
  { name: 'Profile', label: 'My Profile', icon: 'fas fa-user' }
]


function isActiveRoute(routeName) {
  return route.name === routeName
}


async function logout() {
  if (confirm('you want to logout? ?')) {
    await authStore.logout()
    router.push({ name: 'Login' })
  }
}
</script>
<style scoped>
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

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
    height: 100vh;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    transition: transform 0.3s ease, width 0.3s ease;
  }

  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 220px;
  }

  .sidebar-header {
    padding: 20px 16px;
  }

  .nav-link {
    padding: 12px 16px;
  }

  .sidebar-footer {
    padding: 16px;
  }
}
</style>
