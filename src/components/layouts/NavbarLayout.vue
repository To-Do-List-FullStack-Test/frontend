<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <i class="fas fa-tasks"></i>
          <span class="brand-text">Todo App</span>
        </router-link>
      </div>

      <!-- Navigation Links -->
      <div class="navbar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="nav-link"
          :class="{ 'active': isActiveRoute(item.name) }"
        >
          <i :class="item.icon"></i>
          <span class="nav-text">{{ item.label }}</span>
        </router-link>
      </div>

      <!-- User Menu -->
      <div class="navbar-user">
        <div class="user-info">
          <img
            v-if="authStore.userImage"
            :src="authStore.userImage"
            :alt="authStore.userFullName"
            class="user-avatar"
          />
          <div v-else class="user-avatar placeholder">
            <i class="fas fa-user"></i>
          </div>
          <span class="user-name">{{ authStore.userFullName }}</span>
        </div>

        <div class="user-actions">
          <button @click="logout" class="logout-button">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'



const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { name: 'Dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { name: 'Tasks', label: 'My Tasks', icon: 'fas fa-tasks' },
  { name: 'Notifications', label: 'Notifications', icon: 'fas fa-bell' },
  { name: 'Profile', label: 'My Profile', icon: 'fas fa-user' }
]


function isActiveRoute(routeName) {
  return route.name === routeName
}

async function logout() {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    await authStore.logout()
    router.push({ name: 'Login' })
  }
}
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #2d3748;
  font-weight: 700;
  font-size: 1.2rem;
}

.brand-link i {
  color: #667eea;
  font-size: 1.5rem;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #4a5568;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background: #f7fafc;
  color: #2d3748;
}

.nav-link.active {
  background: #e6fffa;
  color: #234e52;
}

.nav-link i {
  font-size: 1rem;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar.placeholder {
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  font-size: 0.8rem;
}

.user-name {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.9rem;
}

.logout-button {
  background: #fed7d7;
  color: #742a2a;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
  font-size: 0.9rem;
}

.logout-button:hover {
  background: #feb2b2;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 16px;
  }

  .navbar-nav {
    display: none;
  }

  .user-name {
    display: none;
  }

  .brand-text {
    display: none;
  }
}
</style>
