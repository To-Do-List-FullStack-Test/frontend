import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

/**
 * Configuration de Laravel Echo pour les WebSockets
 *
 * Ce service configure la connexion WebSocket avec Pusher
 * pour recevoir les notifications en temps réel
 */

// Configuration Pusher
window.Pusher = Pusher

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  wsHost: import.meta.env.VITE_PUSHER_HOST,
  wsPort: import.meta.env.VITE_PUSHER_PORT,
  wssPort: import.meta.env.VITE_PUSHER_PORT,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
})

/**
 * Écouter les notifications pour un utilisateur spécifique
 *
 * @param {number} userId - ID de l'utilisateur
 * @param {Function} callback - Fonction de callback pour traiter les notifications
 * @returns {Object} Canal d'écoute
 */
export function listenToUserNotifications(userId, callback) {
  return echo.private(`App.Models.User.${userId}`)
    .listen('task.created', callback)
    .listen('task.updated', callback)
    .listen('task.deleted', callback)
    .listen('task.completed', callback)
}

/**
 * Arrêter d'écouter les notifications
 *
 * @param {string} channelName - Nom du canal
 */
export function stopListening(channelName) {
  echo.leave(channelName)
}

/**
 * Déconnecter complètement Echo
 */
export function disconnect() {
  echo.disconnect()
}

export default echo
