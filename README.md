# 🏥 Application de Gestion Médicale

Application web complète et sécurisée pour la gestion de cabinet médical, incluant la gestion des patients, des rendez-vous et des dossiers médicaux électroniques.

## 📋 Fonctionnalités

### ✅ Gestion des Patients
- Ajout, modification et visualisation des patients
- Recherche avancée (nom, prénom, ID)
- Fiche patient détaillée avec historique complet

### 📅 Gestion des Rendez-vous
- Calendrier interactif
- Planification et suivi des rendez-vous
- Statuts : En attente, Confirmé, Terminé, Annulé

### 📝 Dossiers Médicaux Électroniques
- Création et consultation de dossiers médicaux
- Historique des consultations
- Prescriptions et notes médicales
- Vue globale de tous les dossiers du cabinet

### 📊 Tableau de Bord
- Statistiques en temps réel
- Graphiques dynamiques (semaine/mois)
- Indicateurs clés : patients, rendez-vous, médecins

### 🔐 Sécurité
- Authentification JWT
- Hachage des mots de passe avec bcrypt
- Application dédiée aux professionnels de santé

## 🚀 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn

### 1. Installation des dépendances

**Backend :**
```bash
cd server
npm install
```

**Frontend :**
```bash
cd client
npm install
```

## 🎯 Lancement de l'Application

### Méthode Rapide (2 terminaux)

**Terminal 1 - Backend :**
```bash
cd server
node index.js
```
Le serveur démarre sur **http://localhost:3001**

**Terminal 2 - Frontend :**
```bash
cd client
npm run dev
```
L'application web démarre sur **http://localhost:5173**

### Accès à l'Application

Ouvrez votre navigateur : **http://localhost:5173**

## 👤 Identifiants par Défaut

### Compte Administrateur
- **Email :** `admin@medical.com`
- **Mot de passe :** `admin123`
- **Rôle :** Admin (accès complet)

### Créer de Nouveaux Comptes
Utilisez la page d'inscription : **http://localhost:5173/signup**

## 📁 Structure du Projet

```
medical-app/
├── client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── context/        # AuthContext
│   │   ├── layouts/        # Layout principal
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # API client
│   │   └── index.css       # Styles globaux
│   └── package.json
│
├── server/                 # Backend Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuration DB
│   │   ├── controllers/    # Logique métier
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Modèles Sequelize
│   │   └── routes/         # Routes API
│   ├── .env                # Variables d'environnement
│   ├── index.js            # Point d'entrée
│   └── package.json
│
└── README.md               # Ce fichier
```

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Lucide React** - Icônes

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Sequelize** - ORM
- **SQLite** - Base de données (dev)
- **JWT** - Authentification
- **Bcrypt** - Hachage de mots de passe

## 🎨 Fonctionnalités par Rôle

| Fonctionnalité | Admin | Médecin | Secrétaire | Patient |
|----------------|-------|---------|------------|---------|
| Voir Dashboard | ✅ | ✅ | ✅ | ✅ |
| Ajouter Patient | ✅ | ✅ | ✅ | ❌ |
| Voir Patients | ✅ | ✅ | ✅ | ⚠️* |
| Créer Dossier Médical | ✅ | ✅ | ❌ | ❌ |
| Voir Dossiers | ✅ | ✅ | ✅ | ⚠️* |
| Créer Rendez-vous | ✅ | ✅ | ✅ | ⚠️* |

*⚠️ Les patients voient uniquement leurs propres données (à implémenter)*

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier que le port 3001 n'est pas déjà utilisé
# Windows :
netstat -ano | findstr :3001

# Tuer le processus si nécessaire
taskkill /F /PID <PID>
```

### Erreur "Token invalide ou expiré"
**Solution :** Déconnectez-vous et reconnectez-vous pour obtenir un nouveau token.

### La base de données ne contient pas de données
```bash
# Exécuter le script de seed
cd server
node seed_force.js
```

## 📝 Scripts Disponibles

### Backend
- `node index.js` - Démarre le serveur
- `node seed_force.js` - Réinitialise la DB avec données de test

### Frontend
- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualise le build

## 🔄 Workflow de Développement

1. **Démarrer les serveurs** (backend + frontend)
2. **Se connecter** avec le compte admin
3. **Ajouter des patients** de test
4. **Créer des rendez-vous**
5. **Ajouter des dossiers médicaux**
6. **Vérifier le Dashboard** pour voir les statistiques

## 📧 Support

Pour toute question ou problème, consultez la documentation technique dans :
- `server/src/` - Documentation backend
- `client/src/` - Documentation frontend

## 📄 Licence

Ce projet est développé à des fins éducatives et de démonstration.

---

💙 Développé avec Node.js, React et ❤️
