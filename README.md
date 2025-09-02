# Application de Gestion de Tâches (Todo List)

Cette application full stack permet de gérer des tâches personnelles avec un système d'authentification, de notifications et de gestion des tâches en temps réel.

## Architecture du Projet

Le projet est divisé en deux parties principales on va parler sur frontend:



### Frontend (Vue.js)

- **Framework** : Vue.js 3 avec Composition API
- **Gestion d'état** : Pinia
- **Routage** : Vue Router
- **HTTP Client** : Axios
- **Temps réel** : Laravel Echo avec Pusher

## Fonctionnalités

- **Authentification** : Inscription, connexion et déconnexion
- **Gestion de profil** : Affichage et modification des informations utilisateur
- **Gestion des tâches** :
  - Création, lecture, mise à jour et suppression de tâches
  - Filtrage par statut et priorité
  - Recherche de tâches
  - Marquage des tâches comme terminées
- **Notifications** : Notifications en temps réel pour les actions importantes

## Installation et Configuration


### 1 Configuration du Frontend

```bash
cd ../todo-frontend

# Installation des dépendances
npm install

# Vérifier que le fichier .env pointe vers l'API backend
# VITE_API_URL=http://localhost:8000/api
```

## Démarrage de l'Application


### 1. Démarrer le Frontend

```bash
cd todo-frontend
npm run dev
```

L'application frontend sera accessible à l'adresse : http://localhost:5173




## Contribution

Pour contribuer au projet, veuillez suivre les étapes suivantes :

1. Forker le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Add some amazing feature'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.
