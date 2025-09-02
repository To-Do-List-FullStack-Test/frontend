<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Page not found</h1>
      <p class="error-message">
        PAGE NOT FOUND
      </p>
      <div class="error-actions">
        <button @click="goHome" class="home-button">
          <i class="fas fa-home"></i>
         Go Home page
        </button>
        <button @click="goBack" class="back-button">
          <i class="fas fa-arrow-left"></i>
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'


const router = useRouter()


function goHome() {
  router.push({ name: 'Dashboard' })
}


function goBack() {
  router.go(-1)
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  color: #667eea;
  line-height: 1;
  margin-bottom: 20px;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 16px 0;
}

.error-message {
  color: #718096;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 32px 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.home-button,
.back-button {
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 16px;
}

.home-button {
  background: #667eea;
  color: white;
}

.home-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.back-button {
  background: #e2e8f0;
  color: #4a5568;
}

.back-button:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .not-found-content {
    padding: 40px 20px;
  }

  .error-code {
    font-size: 6rem;
  }

  .error-title {
    font-size: 2rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .home-button,
  .back-button {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}
</style>
