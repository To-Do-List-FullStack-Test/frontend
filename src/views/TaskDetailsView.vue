<template>
  <div class="task-details">
    <div class="task-details-header">
      <button @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i>
        Go Back
      </button>
      <div class="header-actions">
        <button @click="editTask" class="edit-button">
          <i class="fas fa-edit"></i>
          Edit
        </button>
        <button @click="deleteTask" class="delete-button">
          <i class="fas fa-trash"></i>
          Delete
        </button>
      </div>
    </div>

    <div v-if="taskStore.isLoading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading Tasks...</p>
    </div>

    <div v-else-if="!task" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>No Task is Found</h3>
      <p>Task is not existe or you don't have permissions.</p>
      <button @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i>
        Go Back to Tasks
      </button>
    </div>

    <div v-else class="task-details-content">
      <div class="task-main">
        <div class="task-header">
          <h1 class="task-title">{{ task.title }}</h1>
          <div class="task-status">
            <span class="status-badge" :class="task.status">
              {{ getStatusLabel(task.status) }}
            </span>
          </div>
        </div>

        <div v-if="task.description" class="task-description">
          <h3>Description</h3>
          <p>{{ task.description }}</p>
        </div>

        <div class="task-meta-grid">
          <div class="meta-item">
            <h4>Priority</h4>
            <span class="priority-badge" :class="task.priority">
              <i :class="getPriorityIcon(task.priority)"></i>
              {{ getPriorityLabel(task.priority) }}
            </span>
          </div>

          <div class="meta-item">
            <h4>Statut</h4>
            <span class="status-badge" :class="task.status">
              {{ getStatusLabel(task.status) }}
            </span>
          </div>

          <div class="meta-item">
            <h4>create at</h4>
            <span class="date-value">
              <i class="fas fa-calendar"></i>
              {{ formatDate(task.created_at) }}
            </span>
          </div>

          <div v-if="task.updated_at !== task.created_at" class="meta-item">
            <h4>update at </h4>
            <span class="date-value">
              <i class="fas fa-edit"></i>
              {{ formatDate(task.updated_at) }}
            </span>
          </div>
        </div>

        <div class="task-actions">
          <button
            @click="toggleTaskStatus"
            class="action-button"
            :class="task.status === 'completed' ? 'pending' : 'completed'"
          >
            <i :class="task.status === 'completed' ? 'fas fa-undo' : 'fas fa-check'"></i>
            {{ task.status === 'completed' ? 'Marquer comme en attente' : 'Marquer comme terminée' }}
          </button>
        </div>
      </div>

      <div class="task-sidebar">
        <div class="sidebar-section">
          <h3>Actions </h3>
          <div class="quick-actions">
            <button @click="editTask" class="quick-action">
              <i class="fas fa-edit"></i>
              Edit
            </button>
            <button @click="toggleTaskStatus" class="quick-action">
              <i :class="task.status === 'completed' ? 'fas fa-undo' : 'fas fa-check'"></i>
              {{ task.status === 'completed' ? 'Réouvrir' : 'Terminer' }}
            </button>
            <button @click="deleteTask" class="quick-action danger">
              <i class="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>Informations</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">ID</span>
              <span class="info-value">#{{ task.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Created</span>
              <span class="info-value">{{ formatDate(task.created_at) }}</span>
            </div>
            <div v-if="task.updated_at !== task.created_at" class="info-item">
              <span class="info-label">updated</span>
              <span class="info-value">{{ formatDate(task.updated_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <TaskModal
      v-if="showEditModal"
      :task="task"
      :is-edit="true"
      @close="showEditModal = false"
      @save="handleTaskUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import TaskModal from '@/components/tasks/TaskModal.vue'


const router = useRouter()
const route = useRoute()
const taskStore = useTaskStore()

const showEditModal = ref(false)

const task = computed(() => taskStore.currentTask)


function goBack() {
  router.go(-1)
}


function editTask() {
  showEditModal.value = true
}


async function deleteTask() {
  if (confirm(`Are you sure you want to delte task: "${task.value.title}" ?`)) {
    const result = await taskStore.deleteTask(task.value.id)
    if (result.success) {
      router.push({ name: 'Tasks' })
    }
  }
}


async function toggleTaskStatus() {
  const newStatus = task.value.status === 'completed' ? 'pending' : 'completed'
  await taskStore.updateTask(task.value.id, { status: newStatus })
}


async function handleTaskUpdate(taskData) {
  await taskStore.updateTask(task.value.id, taskData)
  showEditModal.value = false
}


function getPriorityIcon(priority) {
  const icons = {
    low: 'fas fa-arrow-down',
    medium: 'fas fa-minus',
    high: 'fas fa-arrow-up'
  }
  return icons[priority] || 'fas fa-minus'
}

function getPriorityLabel(priority) {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  }
  return labels[priority] || priority
}


function getStatusLabel(status) {
  const labels = {
    pending: 'En attente',
    completed: 'Terminée'
  }
  return labels[status] || status
}


function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}


onMounted(async () => {
  const taskId = parseInt(route.params.id)
  await taskStore.fetchTask(taskId)
})
</script>

<style scoped>
.task-details {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.task-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.back-button {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: #cbd5e0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.edit-button {
  background: #3182ce;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background: #2c5aa0;
}

.delete-button {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.delete-button:hover {
  background: #c53030;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.loading-state i,
.error-state i {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #cbd5e0;
}

.error-state h3 {
  color: #2d3748;
  margin: 0 0 8px 0;
}

.error-state p {
  margin: 0 0 20px 0;
}

.task-details-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
}

.task-main {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.task-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  flex: 1;
  margin-right: 20px;
}

.task-description {
  margin-bottom: 32px;
}

.task-description h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.task-description p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.task-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.meta-item h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 8px 0;
}

.priority-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.priority-badge.low {
  background: #e6fffa;
  color: #234e52;
}

.priority-badge.medium {
  background: #fef5e7;
  color: #744210;
}

.priority-badge.high {
  background: #fed7d7;
  color: #742a2a;
}

.status-badge {
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.status-badge.pending {
  background: #fef5e7;
  color: #744210;
}

.status-badge.completed {
  background: #e6fffa;
  color: #234e52;
}

.date-value {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-weight: 500;
}

.task-actions {
  display: flex;
  gap: 16px;
}

.action-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.action-button.completed {
  background: #38a169;
  color: white;
}

.action-button.completed:hover {
  background: #2f855a;
}

.action-button.pending {
  background: #ed8936;
  color: white;
}

.action-button.pending:hover {
  background: #dd6b20;
}

.task-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.sidebar-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 16px 0;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-action {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.quick-action:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.quick-action.danger {
  background: #fed7d7;
  color: #742a2a;
  border-color: #feb2b2;
}

.quick-action.danger:hover {
  background: #feb2b2;
  border-color: #fc8181;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #718096;
}

.info-value {
  font-weight: 600;
  color: #2d3748;
}

@media (max-width: 768px) {
  .task-details-content {
    grid-template-columns: 1fr;
  }

  .task-details-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }
}
</style>
