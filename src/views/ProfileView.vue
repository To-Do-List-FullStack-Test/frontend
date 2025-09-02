<template>
  <div class="profile-page">
    <div class="profile-header">
      <h1 class="profile-title">My Profile</h1>
    </div>

    <div class="profile-content">
      <div class="profile-main">
        <div class="profile-card">
          <div class="profile-avatar">
            <img
              v-if="authStore.userImage"
              :src="authStore.userImage"
              :alt="authStore.userFullName"
              class="avatar-image"
            />
            <div v-else class="avatar-placeholder">
              <i class="fas fa-user"></i>
            </div>
            <button @click="triggerFileInput" class="avatar-upload">
              <i class="fas fa-camera"></i>
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageChange"
              class="file-input"
            />
          </div>

          <div class="profile-info">
            <h2 class="profile-name">{{ authStore.userFullName }}</h2>
            <p class="profile-email">{{ authStore.userEmail }}</p>
          </div>
        </div>

        <form @submit.prevent="handleUpdateProfile" class="profile-form">
          <div class="form-section">
            <h3>Informations</h3>

            <div class="form-group">
              <label for="full_name" class="form-label">Full Name</label>
              <input
                id="full_name"
                v-model="form.full_name"
                type="text"
                class="form-input"
                :class="{ 'error': errors.full_name }"
                required
              />
              <span v-if="errors.full_name" class="error-message">{{ errors.full_name }}</span>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ 'error': errors.email }"
                required
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="phone_number" class="form-label">phone_number</label>
              <input
                id="phone_number"
                v-model="form.phone_number"
                type="tel"
                class="form-input"
                :class="{ 'error': errors.phone_number }"
              />
              <span v-if="errors.phone_number" class="error-message">{{ errors.phone_number }}</span>
            </div>

            <div class="form-group">
              <label for="address" class="form-label">address</label>
              <textarea
                id="address"
                v-model="form.address"
                class="form-textarea"
                :class="{ 'error': errors.address }"
                rows="3"
              ></textarea>
              <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
            </div>
          </div>

          <div class="form-section">
            <h3>Change Password</h3>

            <div class="form-group">
              <label for="current_password" class="form-label">current_password</label>
              <input
                id="current_password"
                v-model="form.current_password"
                type="password"
                class="form-input"
                :class="{ 'error': errors.current_password }"
              />
              <span v-if="errors.current_password" class="error-message">{{ errors.current_password }}</span>
            </div>

            <div class="form-group">
              <label for="new_password" class="form-label">new_password</label>
              <input
                id="new_password"
                v-model="form.new_password"
                type="password"
                class="form-input"
                :class="{ 'error': errors.new_password }"
              />
              <span v-if="errors.new_password" class="error-message">{{ errors.new_password }}</span>
            </div>

            <div class="form-group">
              <label for="new_password_confirmation" class="form-label">Confirm the new password</label>
              <input
                id="new_password_confirmation"
                v-model="form.new_password_confirmation"
                type="password"
                class="form-input"
                :class="{ 'error': errors.new_password_confirmation }"
              />
              <span v-if="errors.new_password_confirmation" class="error-message">{{ errors.new_password_confirmation }}</span>
            </div>
          </div>

          <!-- Message d'erreur global -->
          <div v-if="authStore.error" class="error-banner">
            <i class="fas fa-exclamation-triangle"></i>
            {{ authStore.error }}
          </div>

          <!-- Message de succès -->
          <div v-if="successMessage" class="success-banner">
            <i class="fas fa-check-circle"></i>
            {{ successMessage }}
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="save-button"
              :disabled="authStore.isLoading"
            >
              <i v-if="authStore.isLoading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ authStore.isLoading ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
          </div>
        </form>
      </div>

      <div class="profile-sidebar">
        <div class="sidebar-section">
          <h3>Statistiques</h3>
          <div class="stats-list">
            <div class="stat-item">
              <span class="stat-label">Member since</span>
              <span class="stat-value">{{ formatDate(authStore.user?.created_at) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Last Sign in</span>
              <span class="stat-value">{{ formatDate(authStore.user?.updated_at) }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>Actions</h3>
          <div class="action-list">
            <button @click="logout" class="action-button danger">
              <i class="fas fa-sign-out-alt"></i>
              logout

            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'


const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  full_name: '',
  email: '',
  phone_number: '',
  address: '',
  image: null,
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const errors = reactive({
  full_name: '',
  email: '',
  phone_number: '',
  address: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const successMessage = ref('')
const fileInput = ref(null)


function validateForm() {
  let isValid = true

  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  if (!form.full_name.trim()) {
    errors.full_name = 'fullname required'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'email isnot valid'
    isValid = false
  }

  if (form.current_password || form.new_password || form.new_password_confirmation) {
    if (!form.current_password) {
      errors.current_password = 'password is required'
      isValid = false
    }

    if (!form.new_password) {
      errors.new_password = 'new password is required'
      isValid = false
    } else if (form.new_password.length < 6) {
      errors.new_password = 'min chars:6'
      isValid = false
    }

    if (!form.new_password_confirmation) {
      errors.new_password_confirmation = 'confirmation is required'
      isValid = false
    } else if (form.new_password !== form.new_password_confirmation) {
      errors.new_password_confirmation = 'Passwords mismatch'
      isValid = false
    }
  }

  return isValid
}


async function handleUpdateProfile() {
  if (!validateForm()) {
    return
  }

  const profileData = {
    full_name: form.full_name,
    email: form.email,
    phone_number: form.phone_number,
    address: form.address
  }

  if (form.image) {
    profileData.image = form.image
  }

  if (form.current_password) {
    profileData.current_password = form.current_password
    profileData.new_password = form.new_password
    profileData.new_password_confirmation = form.new_password_confirmation
  }

  const result = await authStore.updateProfile(profileData)

  if (result.success) {
    successMessage.value = 'Profile updated succefully'

    form.current_password = ''
    form.new_password = ''
    form.new_password_confirmation = ''

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}


function triggerFileInput() {
  fileInput.value?.click()
}


function handleImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('size file: 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('image must be a file')
      return
    }

    form.image = file
  }
}


async function logout() {
  if (confirm('Are you sure you want to logout ?')) {
    await authStore.logout()
    router.push({ name: 'Login' })
  }
}


function formatDate(date) {
  if (!date) return 'No dispo'
  return new Date(date).toLocaleDateString('en-EN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}


function initializeForm() {
  if (authStore.user) {
    form.full_name = authStore.user.full_name || ''
    form.email = authStore.user.email || ''
    form.phone_number = authStore.user.phone_number || ''
    form.address = authStore.user.address || ''
  }
}


onMounted(() => {
  authStore.clearError()
  initializeForm()
})
</script>

<style scoped>
.profile-page {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  margin-bottom: 32px;
}

.profile-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e2e8f0;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #a0aec0;
  border: 4px solid #e2e8f0;
}

.avatar-upload {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background-color 0.2s;
}

.avatar-upload:hover {
  background: #5a67d8;
}

.file-input {
  display: none;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.profile-email {
  color: #718096;
  font-size: 1.1rem;
  margin: 0;
}

.profile-form {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.form-section {
  margin-bottom: 32px;
}

.form-section:last-of-type {
  margin-bottom: 0;
}

.form-section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-input.error,
.form-textarea.error {
  border-color: #e53e3e;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: #e53e3e;
  font-size: 14px;
  margin-top: 4px;
  display: block;
}

.error-banner {
  background: #fed7d7;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-banner {
  background: #c6f6d5;
  color: #22543d;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}

.save-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.save-button:hover:not(:disabled) {
  background: #5a67d8;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-sidebar {
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

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-weight: 500;
  color: #718096;
}

.stat-value {
  font-weight: 600;
  color: #2d3748;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-button {
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

.action-button:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.action-button.danger {
  background: #fed7d7;
  color: #742a2a;
  border-color: #feb2b2;
}

.action-button.danger:hover {
  background: #feb2b2;
  border-color: #fc8181;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .profile-card {
    flex-direction: column;
    text-align: center;
  }

  .form-actions {
    justify-content: center;
  }
}
</style>
