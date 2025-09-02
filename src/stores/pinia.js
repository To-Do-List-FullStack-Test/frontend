import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'


const pinia = createPinia()


pinia.use(createPersistedState({

  storage: localStorage,

  persist: {
    key: 'todo-app-stores',
    paths: ['auth.user', 'auth.token'] //only user and token
  }
}))

export default pinia
