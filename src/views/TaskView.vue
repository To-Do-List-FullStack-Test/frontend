<template>
  <div class="tasks-page">
    <div class="tasks-header">
      <h1 class="tasks-title">My Tasks</h1>
      <button @click="showCreateModal = true" class="create-button">
        <i class="fas fa-plus"></i>
        New Task
      </button>
    </div>

    <!-- Filtres et recherche -->
    <div class="filters-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search task..."
          class="search-input"
        />
      </div>

      <div class="filters">
        <select v-model="statusFilter" class="filter-select">
          <option value="all">All Status</option>
          <option value="pending">pending</option>
          <option value="completed">completed</option>
        </select>

        <select v-model="priorityFilter" class="filter-select">
          <option value="all">All priorities</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>

        <button @click="resetFilters" class="reset-button">
          <i class="fas fa-times"></i>
          Reset
        </button>
      </div>
    </div>


    <div class="tasks-content">
      <div v-if="taskStore.isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading Tasks...</p>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <h3>No Task is Found</h3>
        <p v-if="hasActiveFilters">
         No Task matched your filter.
        </p>
        <p v-else>
          You don't have tasks yet , create you first task now!
        </p>
        <button @click="showCreateModal = true" class="create-task-button">
          <i class="fas fa-plus"></i>
          Create a task
        </button>
      </div>

      <div v-else class="tasks-grid">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-card"
          @click="goToTaskDetails(task.id)"
        >
          <div class="task-header">
            <h3 class="task-title">{{ task.title }}</h3>
            <div class="task-actions">
              <button
                @click.stop="toggleTaskStatus(task)"
                class="action-button"
                :class="task.status"
                :title="task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'"
              >
                <i :class="task.status === 'completed' ? 'fas fa-undo' : 'fas fa-check'"></i>
              </button>
              <button
                @click.stop="editTask(task)"
                class="action-button edit"
                title="update"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click.stop="deleteTask(task)"
                class="action-button delete"
                title="delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <p v-if="task.description" class="task-description">
            {{ task.description }}
          </p>

          <div class="task-meta">
            <span class="task-priority" :class="task.priority">
              <i :class="getPriorityIcon(task.priority)"></i>
              {{ getPriorityLabel(task.priority) }}
            </span>
            <span class="task-date">
              <i class="fas fa-calendar"></i>
              {{ formatDate(task.created_at) }}
            </span>
          </div>

          <div class="task-status">
            <span class="status-badge" :class="task.status">
              {{ getStatusLabel(task.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <TaskModal
      v-if="showCreateModal || showEditModal"
      :task="editingTask"
      :is-edit="showEditModal"
      @close="closeModal"
      @save="handleTaskSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import TaskModal from '@/components/tasks/TaskModal.vue'


const router = useRouter()
const taskStore = useTaskStore()

const searchQuery = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTask = ref(null)

const filteredTasks = computed(() => {
  let tasks = taskStore.filteredTasks

  if (statusFilter.value !== 'all') {
    tasks = tasks.filter(task => task.status === statusFilter.value)
  }

  if (priorityFilter.value !== 'all') {
    tasks = tasks.filter(task => task.priority === priorityFilter.value)
  }

  return tasks
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || statusFilter.value !== 'all' || priorityFilter.value !== 'all'
})


function goToTaskDetails(taskId) {
  router.push({ name: 'TaskDetails', params: { id: taskId } })
}


async function toggleTaskStatus(task) {
  const newStatus = task.status === 'completed' ? 'pending' : 'completed'
  await taskStore.updateTask(task.id, { status: newStatus })
}


function editTask(task) {
  editingTask.value = { ...task }
  showEditModal.value = true
}


async function deleteTask(task) {
  if (confirm(`Are you sure you want to delete "${task.title}" ?`)) {
    await taskStore.deleteTask(task.id)
  }
}


function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingTask.value = null
}


async function handleTaskSave(taskData) {
  if (showEditModal.value && editingTask.value) {
    await taskStore.updateTask(editingTask.value.id, taskData)
  } else {
    await taskStore.createTask(taskData)
  }
  closeModal()
}


function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = 'all'
  priorityFilter.value = 'all'
  taskStore.resetFilters()
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
    low: 'low',
    medium: 'Medium',
    high: 'High'
  }
  return labels[priority] || priority
}

/**
 * Obtenir le label de statut
 *
 * @param {string} status - Statut de la tâche
 * @returns {string} Label du statut
 */
function getStatusLabel(status) {
  const labels = {
    pending: 'Pending',
    completed: 'Completed'
  }
  return labels[status] || status
}


function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}


watch(searchQuery, (newValue) => {
  taskStore.setFilters({ search: newValue })
})


onMounted(() => {
  taskStore.fetchTasks()
})
</script>

<style scoped>
.tasks-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.tasks-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.create-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.create-button:hover {
  background: #5a67d8;
}

.filters-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filters {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.reset-button {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background: #cbd5e0;
}

.tasks-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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
  margin: 0 0 20px 0;
}

.create-task-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-task-button:hover {
  background: #5a67d8;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.task-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.task-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.task-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.task-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.task-card:hover .task-actions {
  opacity: 1;
}

.action-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s;
}

.action-button.pending {
  background: #e6fffa;
  color: #234e52;
}

.action-button.completed {
  background: #fef5e7;
  color: #744210;
}

.action-button.edit {
  background: #ebf8ff;
  color: #2b6cb0;
}

.action-button.delete {
  background: #fed7d7;
  color: #742a2a;
}

.action-button:hover {
  transform: scale(1.1);
}

.task-description {
  color: #718096;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.task-priority {
  display: flex;
  align-items: center;
  gap: 6px;
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
  display: flex;
  align-items: center;
  gap: 6px;
  color: #a0aec0;
  font-size: 0.8rem;
}

.task-status {
  position: absolute;
  top: 16px;
  right: 16px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
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
</style>
