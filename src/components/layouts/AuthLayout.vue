<template>
  <div class="auth-layout">
    <div class="auth-background">
      <div class="auth-pattern"></div>
    </div>

    <div class="auth-container">
      <div class="auth-header">
        <div class="logo">
          <i class="fas fa-tasks"></i>
          <span class="logo-text">Todo App</span>
        </div>
        <p class="auth-subtitle">Manage your Tasks</p>
      </div>

      <div class="auth-content">
        <router-view />
      </div>

      <div class="auth-footer">
        <p>&copy; 2025 Todo App. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.auth-container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.logo i {
  font-size: 2.5rem;
  color: white;
}

.logo-text {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
}

.auth-content {
  width: 100%;
  max-width: 500px;
}

.auth-footer {
  margin-top: 40px;
  text-align: center;
}

.auth-footer p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 16px;
  }

  .logo i {
    font-size: 2rem;
  }

  .logo-text {
    font-size: 1.5rem;
  }

  .auth-subtitle {
    font-size: 1rem;
  }
}
</style>
