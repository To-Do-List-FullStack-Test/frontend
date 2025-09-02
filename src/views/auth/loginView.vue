<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title">Sign in</h1>
        <p class="login-subtitle">Sign in to your Todo App</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'error': errors.email }"
            placeholder="your@email.com"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- Mot de passe -->
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'error': errors.password }"
              placeholder="Votre mot de passe"
              required
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="password-toggle"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Message d'erreur global -->
        <div v-if="authStore.error" class="error-banner">
          <i class="fas fa-exclamation-triangle"></i>
          {{ authStore.error }}
        </div>

        <!-- Bouton de connexion -->
        <button
          type="submit"
          class="login-button"
          :disabled="authStore.isLoading"
        >
          <i v-if="authStore.isLoading" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-sign-in-alt"></i>
          {{ authStore.isLoading ? 'login...' : 'Sign in' }}
        </button>

        <!-- Lien vers l'inscription -->
        <div class="login-footer">
          <p>
            No Account ?
            <router-link to="/auth/register" class="link">
              create one
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()


const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)


function validateForm() {
  let isValid = true

  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  if (!form.email) {
    errors.email = 'email required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'email is not valid'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must contains min 6 chars  '
    isValid = false
  }

  return isValid
}


async function handleLogin() {
  if (!validateForm()) {
    return
  }

  const result = await authStore.login(form)
  if (result.success) {
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  }
}


function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}


onMounted(() => {
  authStore.clearError()
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.login-subtitle {
  color: #718096;
  margin: 0;
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

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input.error {
  border-color: #e53e3e;
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 4px;
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

.login-button {
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-button:hover:not(:disabled) {
  background: #5a67d8;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  color: #718096;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}
</style>
