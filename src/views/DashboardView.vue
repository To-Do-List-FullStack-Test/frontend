<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Dashboard</h1>
      <p class="dashboard-subtitle">Welcome, {{ authStore.userFullName }} !</p>
    </div>



      <div class="stat-card">
        <div class="stat-icon pending">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ taskStats.pending }}</h3>
          <p class="stat-label">Pending</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon completed">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ taskStats.completed }}</h3>
          <p class="stat-label">Completed</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon priority">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ taskStats.highPriority }}</h3>
          <p class="stat-label">highPriority</p>
        </div>
      </div>
    </div>

    <!-- Tâches récentes -->
    <div class="recent-tasks">
      <div class="section-header">
        <h2 class="section-title">Lates Task</h2>
        <router-link to="/tasks" class="view-all-link">
          See all tasks
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>

      <div v-if="taskStore.isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading tasks...</p>
      </div>

      <div v-else-if="recentTasks.length === 0" class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <h3>No Task</h3>
        <p>No Task ?create one now !</p>
        <router-link to="/tasks" class="create-task-button">
          <i class="fas fa-plus"></i>
          create a task
        </router-link>
      </div>

      <div v-else class="tasks-list">
        <div
          v-for="task in recentTasks"
          :key="task.id"
          class="task-item"
          @click="goToTaskDetails(task.id)"
        >
          <div class="task-content">
            <h4 class="task-title">{{ task.title }}</h4>
            <p v-if="task.description" class="task-description">
              {{ task.description }}
            </p>
            <div class="task-meta">
              <span class="task-priority" :class="task.priority">
                {{ getPriorityLabel(task.priority) }}
              </span>
              <span class="task-date">
                {{ formatDate(task.created_at) }}
              </span>
            </div>
          </div>
          <div class="task-status">
            <span class="status-badge" :class="task.status">
              {{ getStatusLabel(task.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications récentes -->
    <div class="recent-notifications">
      <div class="section-header">
        <h2 class="section-title">Latest Notifications </h2>
        <router-link to="/notifications" class="view-all-link">
          See all notifications
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>

      <div v-if="notificationStore.isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>loading (notifications)...</p>
      </div>

      <div v-else-if="recentNotifications.length === 0" class="empty-state">
        <i class="fas fa-bell-slash"></i>
        <h3>No notification</h3>
        <p>No notification yet for you .</p>
      </div>

      <div v-else class="notifications-list">
        <div
          v-for="notification in recentNotifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 'unread': !notification.is_read }"
        >
          <div class="notification-icon" :class="notification.type">
            <i :class="getNotificationIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <h4 class="notification-title">{{ notification.title }}</h4>
            <p class="notification-message">{{ notification.message }}</p>
            <span class="notification-date">
              {{ formatDate(notification.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { useNotificationStore } from '@/stores/notifications'



const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const notificationStore = useNotificationStore()


const taskStats = computed(() => taskStore.taskStats)
const recentTasks = computed(() => taskStore.tasks.slice(0, 5))
const recentNotifications = computed(() => notificationStore.notifications.slice(0, 5))


function goToTaskDetails(taskId) {
  router.push({ name: 'TaskDetails', params: { id: taskId } })
}

function getPriorityLabel(priority) {
  const labels = {
    low: 'low',
    medium: 'medium',
    high: 'high'
  }
  return labels[priority] || priority
}


function getStatusLabel(status) {
  const labels = {
    pending:  '  pending',
    completed:  'completed'
  }
  return labels[status] || status
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

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}


async function loadDashboardData() {
  try {
    await Promise.all([
      taskStore.fetchTasks({ per_page: 5 }),
      notificationStore.fetchNotifications({ per_page: 5 })
    ])
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.dashboard-subtitle {
  color: #718096;
  font-size: 1.1rem;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  background: #667eea;
}

.stat-icon.pending {
  background: #ed8936;
}

.stat-icon.completed {
  background: #38a169;
}

.stat-icon.priority {
  background: #e53e3e;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.stat-label {
  color: #718096;
  margin: 0;
  font-weight: 500;
}

.recent-tasks,
.recent-notifications {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.view-all-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #5a67d8;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
}

.loading-state i,
.empty-state i {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #cbd5e0;
}

.empty-state h3 {
  color: #2d3748;
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 0 0 20px 0;
}

.create-task-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #667eea;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.create-task-button:hover {
  background: #5a67d8;
}

.tasks-list,
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.task-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.task-description {
  color: #718096;
  margin: 0 0 8px 0;
  font-size: 0.9rem;
}

.task-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.task-priority {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.task-priority.low {
  background: #e6fffa;
  color: #234e52;
}

.task-priority.medium {
  background: #fef5e7;
  color: #744210;
}

.task-priority.high {
  background: #fed7d7;
  color: #742a2a;
}

.task-date {
  color: #a0aec0;
  font-size: 0.8rem;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef5e7;
  color: #744210;
}

.status-badge.completed {
  background: #e6fffa;
  color: #234e52;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s;
}

.notification-item.unread {
  background: #f7fafc;
  border-color: #667eea;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
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
}

.notification-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.notification-message {
  color: #718096;
  margin: 0 0 8px 0;
  font-size: 0.9rem;
}

.notification-date {
  color: #a0aec0;
  font-size: 0.8rem;
}
</style>
