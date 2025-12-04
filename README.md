# 🏳️ World Flags - Application d'apprentissage des drapeaux du monde

Une application React moderne, PWA et responsive pour découvrir et apprendre les drapeaux du monde entier avec un système de filtres avancés.

![World Flags App](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-06B6D4?logo=tailwindcss)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8)

## ✨ Fonctionnalités

### 🌍 Affichage des drapeaux
- **195 pays** reconnus par l'ONU
- Grille responsive avec **3 niveaux de zoom** (petit, moyen, grand)
- Chargement optimisé des images selon le niveau de zoom
- Animations fluides avec Framer Motion

### 🔍 Système de filtres avancé
- **Filtres par couleurs** : blanc, noir, rouge, bleu, vert, jaune, orange, etc.
- **Filtres par formes** : bandes verticales/horizontales, croix nordiques, triangles, etc.
- **Filtres par symboles** :
  - Animaux (aigles, lions, dragons...)
  - Astres (étoiles, croissants, soleils...)
  - Armes et outils
  - Flore (cèdres, palmes...)
  - Emblèmes religieux
- **Filtres par continent** : Afrique, Asie, Europe, Amériques, Océanie
- Logique **AND cumulative** : les filtres s'additionnent
- **Désactivation intelligente** des filtres qui ne donnent aucun résultat

### 📱 Interface utilisateur
- **Mobile-first** et responsive
- **Thème clair/sombre** avec détection automatique
- **Bilingue** : français et anglais
- Panneau d'information détaillé pour chaque pays :
  - Capitale
  - Population
  - Superficie
  - Monnaie
  - Langues

### ⚡ PWA (Progressive Web App)
- Installable sur mobile et desktop
- Fonctionne hors-ligne (cache des drapeaux)
- Service Worker pour les performances

## 🚀 Installation

### Prérequis
- Node.js 20.19+ ou 22.12+
- npm ou yarn

### Étapes

```bash
# Cloner ou accéder au projet
cd world-flags-app

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📦 Scripts disponibles

```bash
# Développement
npm run dev          # Lancer le serveur de développement

# Production
npm run build        # Construire pour la production
npm run preview      # Prévisualiser le build de production

# Qualité
npm run lint         # Vérifier le code avec ESLint
```

## 🏗️ Architecture du projet

```
world-flags-app/
├── public/
│   ├── icons/              # Icônes PWA
│   ├── manifest.json       # Manifeste PWA
│   ├── sw.js               # Service Worker
│   └── flag-icon.svg       # Favicon
├── src/
│   ├── components/         # Composants React
│   │   ├── FlagCard.tsx
│   │   ├── FlagGrid.tsx
│   │   ├── CountryInfoPanel.tsx
│   │   ├── FiltersSidebar.tsx
│   │   ├── TopFiltersMobile.tsx
│   │   ├── FilterButton.tsx
│   │   ├── ZoomSelector.tsx
│   │   └── Header.tsx
│   ├── hooks/              # Hooks personnalisés
│   │   ├── useFlags.ts
│   │   ├── useFetchCountry.ts
│   │   └── useTranslation.ts
│   ├── store/              # État global (Zustand)
│   │   └── useAppStore.ts
│   ├── data/               # Données JSON
│   │   ├── flags_en.json
│   │   ├── taxonomy.json
│   │   └── translations.json
│   ├── types/              # Types TypeScript
│   │   └── index.ts
│   ├── lib/                # Utilitaires
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 🛠️ Stack technique

| Technologie | Usage |
|-------------|-------|
| **React 18** | Framework UI |
| **TypeScript** | Typage statique |
| **Vite** | Bundler et serveur de dev |
| **TailwindCSS** | Styling utilitaire |
| **Zustand** | Gestion d'état |
| **Framer Motion** | Animations |
| **React Query** | Fetching et caching API |
| **Lucide React** | Icônes |

### Pourquoi ces choix ?

- **Vite** plutôt que Next.js : Application SPA pure sans besoin de SSR, démarrage ultra-rapide
- **Zustand** plutôt que Redux : Plus léger, API simple, parfait pour une app de cette taille
- **TailwindCSS** : Prototypage rapide, thème dark/light facile, bundle optimisé
- **Framer Motion** : Animations performantes et déclaratives

## 🌐 APIs utilisées

- **[Flagcdn.com](https://flagcdn.com)** : Images des drapeaux en plusieurs résolutions
- **[REST Countries](https://restcountries.com)** : Informations détaillées sur les pays

## 📱 Responsive Design

| Écran | Comportement |
|-------|--------------|
| Mobile (<768px) | Filtres en bandeau horizontal scrollable, panneau info full-screen |
| Tablet (768-1024px) | Grille adaptative, filtres accessibles via bouton |
| Desktop (>1024px) | Sidebar de filtres fixe à droite, grille large |

## 🎨 Thèmes

L'application supporte le mode clair et sombre :
- Détection automatique des préférences système
- Toggle manuel dans le header
- Persistance en localStorage

## 📄 Format des données drapeaux

Les drapeaux sont décrits dans un format structuré permettant des filtres complexes :

```json
{
  "France": {
    "code": "FR",
    "continent": "Europe",
    "attributes": [
      {"element": "vertical_bands", "count": 3},
      {"element": "color_1", "value": "blue"},
      {"element": "color_2", "value": "white"},
      {"element": "color_3", "value": "red"}
    ]
  }
}
```

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

Le dossier `dist/` contient l'application prête à être déployée.

### Plateformes recommandées

- **Vercel** : `npx vercel`
- **Netlify** : Connecter le repo GitHub
- **GitHub Pages** : Via GitHub Actions
- **Firebase Hosting** : `firebase deploy`

## 📝 Licence

MIT License - Libre d'utilisation et de modification.

---

Créé avec ❤️ pour l'apprentissage des drapeaux du monde.
