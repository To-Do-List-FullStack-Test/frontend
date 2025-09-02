<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1 class="register-title">Inscription</h1>
        <p class="register-subtitle">Créez votre compte Todo App</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <!-- Nom complet -->
        <div class="form-group">
          <label for="full_name" class="form-label">Nom complet</label>
          <input
            id="full_name"
            v-model="form.full_name"
            type="text"
            class="form-input"
            :class="{ 'error': errors.full_name }"
            placeholder="Votre nom complet"
            required
          />
          <span v-if="errors.full_name" class="error-message">{{ errors.full_name }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'error': errors.email }"
            placeholder="votre@email.com"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- Numéro de téléphone -->
        <div class="form-group">
          <label for="phone_number" class="form-label">Numéro de téléphone</label>
          <input
            id="phone_number"
            v-model="form.phone_number"
            type="tel"
            class="form-input"
            :class="{ 'error': errors.phone_number }"
            placeholder="+33 6 12 34 56 78"
          />
          <span v-if="errors.phone_number" class="error-message">{{ errors.phone_number }}</span>
        </div>

        <!-- Adresse -->
        <div class="form-group">
          <label for="address" class="form-label">Adresse</label>
          <textarea
            id="address"
            v-model="form.address"
            class="form-textarea"
            :class="{ 'error': errors.address }"
            placeholder="Votre adresse complète"
            rows="3"
          ></textarea>
          <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
        </div>

        <!-- Image de profil -->
        <div class="form-group">
          <label for="image" class="form-label">Image de profil</label>
          <div class="file-input-container">
            <input
              id="image"
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="file-input"
            />
            <label for="image" class="file-input-label">
              <i class="fas fa-upload"></i>
              {{ selectedFile ? selectedFile.name : 'Choisir une image' }}
            </label>
          </div>
          <span v-if="errors.image" class="error-message">{{ errors.image }}</span>
        </div>

        <!-- Mot de passe -->
        <div class="form-group">
          <label for="password" class="form-label">Mot de passe</label>
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

        <!-- Confirmation du mot de passe -->
        <div class="form-group">
          <label for="password_confirmation" class="form-label">Confirmer le mot de passe</label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            class="form-input"
            :class="{ 'error': errors.password_confirmation }"
            placeholder="Confirmez votre mot de passe"
            required
          />
          <span v-if="errors.password_confirmation" class="error-message">{{ errors.password_confirmation }}</span>
        </div>

        <!-- Message d'erreur global -->
        <div v-if="authStore.error" class="error-banner">
          <i class="fas fa-exclamation-triangle"></i>
          {{ authStore.error }}
        </div>

        <!-- Bouton d'inscription -->
        <button
          type="submit"
          class="register-button"
          :disabled="authStore.isLoading"
        >
          <i v-if="authStore.isLoading" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-user-plus"></i>
          {{ authStore.isLoading ? 'Inscription...' : 'S\'inscrire' }}
        </button>

        <!-- Lien vers la connexion -->
        <div class="register-footer">
          <p>
            Déjà un compte ?
            <router-link to="/auth/login" class="link">
              Se connecter
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Vue d'inscription
 *
 * Permet à un nouvel utilisateur de créer un compte
 * avec tous les champs requis selon le cahier des charges
 */

const router = useRouter()
const authStore = useAuthStore()

// État réactif
const form = reactive({
  full_name: '',
  email: '',
  phone_number: '',
  address: '',
  image: null,
  password: '',
  password_confirmation: ''
})

const errors = reactive({
  full_name: '',
  email: '',
  phone_number: '',
  address: '',
  image: '',
  password: '',
  password_confirmation: ''
})

const showPassword = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

/**
 * Valider le formulaire
 *
 * @returns {boolean} True si valide
 */
function validateForm() {
  let isValid = true

  // Réinitialiser les erreurs
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Validation nom complet
  if (!form.full_name.trim()) {
    errors.full_name = 'name required'
    isValid = false
  } else if (form.full_name.trim().length < 2) {
    errors.full_name = 'name min 2 chars'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'email required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'email is not valid'
    isValid = false
  }

  if (form.phone_number && !/^[\\+]?[0-9\s\-\\(\\)]{10,}$/.test(form.phone_number)) {
    errors.phone_number = 'phone number is not valid'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password:min 6 chars'
    isValid = false
  }

  if (!form.password_confirmation) {
    errors.password_confirmation = 'confirmation is required'
    isValid = false
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'password mismatch'
    isValid = false
  }

  return isValid
}


async function handleRegister() {
  if (!validateForm()) {
    return
  }

  const result = await authStore.register(form)

  if (result.success) {
    router.push({
      name: 'Login',
      query: { registered: 'true' }
    })
  }
}


function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      errors.image = 'min size : 5MB'
      return
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      errors.image = 'Image must be file'
      return
    }

    selectedFile.value = file
    form.image = file
    errors.image = ''
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
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.register-subtitle {
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

.file-input-container {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
  color: #718096;
}

.file-input-label:hover {
  border-color: #667eea;
  color: #667eea;
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

.register-button {
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

.register-button:hover:not(:disabled) {
  background: #5a67d8;
}

.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-footer {
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
