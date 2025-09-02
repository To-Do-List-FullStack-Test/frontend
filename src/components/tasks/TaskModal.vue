<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ isEdit ? 'Modifier la tâche' : 'Nouvelle tâche' }}</h3>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="modal-body">
        <div class="form-group">
          <label for="title">Titre</label>
          <input id="title" v-model="localTask.title" type="text" class="input" required />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="localTask.description" class="textarea" rows="4"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="priority">priority</label>
            <select id="priority" v-model="localTask.priority" class="input">
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>

          <div class="form-group">
            <label for="status">Statut</label>
            <select id="status" v-model="localTask.status" class="input">
              <option value="pending">En attente</option>
              <option value="completed">Terminée</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn secondary" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn primary">
            <i class="fas fa-save"></i>
            {{ isEdit ? 'Save' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  task: { type: Object, default: () => null },
  isEdit: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'save'])

const localTask = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending'
})

watch(() => props.task, (val) => {
  if (val) {
    localTask.title = val.title || ''
    localTask.description = val.description || ''
    localTask.priority = val.priority || 'medium'
    localTask.status = val.status || 'pending'
  } else {
    localTask.title = ''
    localTask.description = ''
    localTask.priority = 'medium'
    localTask.status = 'pending'
  }
}, { immediate: true })

function onSubmit() {
  emit('save', { ...localTask })
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 1000; }
.modal { width: 100%; max-width: 560px; background: #fff; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,.15); overflow: hidden; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
.modal-body { padding: 20px; }
.close-btn { background: none; border: none; color: #4a5568; cursor: pointer; }
.form-group { margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
label { display: block; font-weight: 600; color: #2d3748; margin-bottom: 6px; }
.input, .textarea, select { width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; }
.input:focus, .textarea:focus, select:focus { outline: none; border-color: #667eea; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 20px; border-top: 1px solid #e2e8f0; }
.btn { padding: 10px 16px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
.btn.primary { background: #667eea; color: #fff; }
.btn.primary:hover { background: #5a67d8; }
.btn.secondary { background: #e2e8f0; color: #4a5568; }
.btn.secondary:hover { background: #cbd5e0; }
</style>
