<template>
  <div class="notifications-page">
    <div class="notifications-header">
      <h1 class="notifications-title">Notifications</h1>
      <div class="header-actions">
        <button @click="markAllAsRead" class="mark-all-button" :disabled="unreadCount === 0">
          <i class="fas fa-check-double"></i>
          All marked as seen
        </button>
        <button @click="refreshNotifications" class="refresh-button">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': notificationStore.isLoading }"></i>
          Refresh
        </button>
      </div>
    </div>

    <div class="notifications-stats">
      <div class="stat-item">
        <span class="stat-number">{{ unreadCount }}</span>
        <span class="stat-label">not seen</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ totalCount }}</span>
        <span class="stat-label">Total</span>
      </div>
    </div>

    <div class="notifications-content">
      <div v-if="notificationStore.isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading notifications...</p>
      </div>

      <div v-else-if="notifications.length === 0" class="empty-state">
        <i class="fas fa-bell-slash"></i>
        <h3>No notification</h3>
        <p>No notification yet.</p>
      </div>

      <div v-else class="notifications-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 'unread': !notification.is_read }"
          @click="markAsRead(notification)"
        >
          <div class="notification-icon" :class="notification.type">
            <i :class="getNotificationIcon(notification.type)"></i>
          </div>

          <div class="notification-content">
            <div class="notification-header">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <span class="notification-time">
                {{ formatTime(notification.created_at) }}
              </span>
            </div>

            <p class="notification-message">{{ notification.message }}</p>

            <div v-if="notification.data" class="notification-data">
              <div v-if="notification.data.task_title" class="task-info">
                <i class="fas fa-tasks"></i>
                <span>Task: {{ notification.data.task_title }}</span>
              </div>
            </div>
          </div>

          <div class="notification-actions">
            <button
              v-if="!notification.is_read"
              @click.stop="markAsRead(notification)"
              class="mark-read-button"
              title="Marquer comme lu"
            >
              <i class="fas fa-check"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notifications'


const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)
const totalCount = computed(() => notifications.value.length)


async function markAsRead(notification) {
  if (!notification.is_read) {
    await notificationStore.markAsRead(notification.id)
  }
}


async function markAllAsRead() {
  await notificationStore.markAllAsRead()
}


async function refreshNotifications() {
  await notificationStore.fetchNotifications()
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
    return ` ${diffInMinutes} minute ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return ` ${hours}hour(s) ago`
  } else {
    return notificationDate.toLocaleDateString('en-EN', {
      day: 'numeric',
      month: 'short'
    })
  }
}

onMounted(() => {
  notificationStore.fetchNotifications()
})
</script>

<style scoped>
.notifications-page {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.notifications-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.mark-all-button,
.refresh-button {
  background: #667eea;
  color: white;
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

.mark-all-button:hover:not(:disabled) {
  background: #5a67d8;
}

.mark-all-button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.refresh-button {
  background: #e2e8f0;
  color: #4a5568;
}

.refresh-button:hover {
  background: #cbd5e0;
}

.notifications-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.stat-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  min-width: 120px;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.stat-label {
  color: #718096;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

.notifications-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
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
  margin: 0;
}

.notifications-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: #f7fafc;
}

.notification-item.unread {
  background: #f0f4ff;
  border-left: 4px solid #667eea;
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  top: 20px;
  right: 20px;
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
}

.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
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

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.notification-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.notification-time {
  color: #a0aec0;
  font-size: 0.8rem;
  white-space: nowrap;
}

.notification-message {
  color: #4a5568;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.notification-data {
  background: #f7fafc;
  border-radius: 6px;
  padding: 8px 12px;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-size: 0.9rem;
}

.notification-actions {
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.notification-item:hover .notification-actions {
  opacity: 1;
}

.mark-read-button {
  background: #e6fffa;
  color: #234e52;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s;
}

.mark-read-button:hover {
  background: #b2f5ea;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .notifications-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }

  .notifications-stats {
    justify-content: center;
  }

  .notification-header {
    flex-direction: column;
    gap: 4px;
  }

  .notification-title {
    margin-right: 0;
  }
}
</style>
