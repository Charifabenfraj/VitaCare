# VitaCare - Parapharmacie en Ligne

Application e-commerce de parapharmacie construite avec Next.js 16, MongoDB et Tailwind CSS.

![VitaCare Logo](/public/logo-vitacare.svg)

## Fonctionnalités

- 🛒 Catalogue de produits avec catégories
- 🏷️ Promotions et packs
- 🛍️ Panier d'achat
- 📦 Gestion des commandes
- 👤 Espace client
- 🔐 Panel d'administration

## Technologies

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Base de données**: MongoDB avec Mongoose
- **Animations**: GSAP

## Prérequis

- Node.js 18+
- MongoDB (local ou MongoDB Atlas)

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/Charifabenfraj/VitaCare.git
cd VitaCare
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env.local
```

4. Modifier `.env.local` avec votre URI MongoDB :
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vitacare
```

5. Lancer le serveur de développement :
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Déploiement sur Vercel

### Étape 1 : Préparer MongoDB Atlas

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Configurer l'accès réseau : ajouter `0.0.0.0/0` pour permettre l'accès depuis Vercel
4. Créer un utilisateur de base de données
5. Récupérer l'URI de connexion

### Étape 2 : Déployer sur Vercel

1. Importer le projet sur [Vercel](https://vercel.com/new)
2. Connecter votre repository GitHub
3. Configurer les variables d'environnement :
   - `MONGODB_URI` : Votre URI MongoDB Atlas
4. Déployer !

### Note importante

L'upload de fichiers locaux n'est pas disponible sur Vercel (système de fichiers en lecture seule). 
Utilisez des URL d'images externes comme Cloudinary, Imgur ou Unsplash pour les images de produits.

## Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Démarrer en production
npm run lint     # Vérification ESLint
npm run seed     # Peupler la base de données
```

## Structure du projet

```
├── app/              # Pages et API Routes (App Router)
│   ├── admin/        # Pages d'administration
│   ├── api/          # API Routes
│   └── ...           # Pages publiques
├── components/       # Composants React
├── context/          # Contextes React (Auth, Cart)
├── lib/              # Utilitaires (connexion MongoDB)
├── models/           # Modèles Mongoose
├── public/           # Fichiers statiques
└── types/            # Types TypeScript
```

## Licence

MIT
