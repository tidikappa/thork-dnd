# 🐙 Déploiement sur GitHub Pages — Setup en 10 min, mises à jour en 5 sec ensuite

## Pourquoi GitHub Pages ?

- ✅ **Gratuit pour toujours** (pas d'expiration comme Netlify Drop sans compte)
- ✅ **HTTPS par défaut** (requis pour PWA installable)
- ✅ **Mises à jour en 1 commande** (`./deploy.command` après le setup initial)
- ✅ **Historique versionné** (tu peux revenir en arrière à chaque commit)
- ✅ **Intégration Mac native** (avec Git ou GitHub Desktop)

---

## Setup initial (à faire une seule fois)

### 1️⃣ Compte GitHub

Si tu n'as pas de compte : crée-en un sur **https://github.com/signup** (gratuit, mail + mot de passe).

### 2️⃣ Installer Git sur ton Mac

Ouvre **Terminal** (Cmd+Espace → "Terminal"), colle cette commande, appuie sur Entrée :

```bash
git --version
```

- Si tu vois un numéro de version → Git est déjà installé. Passe à l'étape 3.
- Si Mac te propose d'installer les "Outils de développement en ligne de commande" → accepte (1 popup, 2 min).

### 3️⃣ Créer le repo sur GitHub

1. Va sur **https://github.com/new**
2. Remplis :
   - **Repository name** : `thork-dnd` (ou ce que tu veux, mais évite les espaces)
   - **Public** ✓ (obligatoire pour GitHub Pages gratuit)
   - **Add a README** : décoché (j'en ai déjà créé un)
   - **Add .gitignore** : "None" (j'en ai déjà créé un)
3. Clique **"Create repository"**

GitHub te montre une page avec des commandes. **Garde cet onglet ouvert**, tu vas en avoir besoin.

### 4️⃣ Initialiser et pousser depuis ton Mac

Ouvre Terminal et colle ces commandes une par une :

```bash
cd ~/Documents/Claude/Projects/D\&D
git init
git config user.name "Ton Nom"
git config user.email "ton.email@example.com"
git branch -M main
git add .
git commit -m "Première version Thork PWA"
```

Puis (remplace `TONUSER` par ton pseudo GitHub) :

```bash
git remote add origin https://github.com/TONUSER/thork-dnd.git
git push -u origin main
```

GitHub te demandera ton mot de passe → ce n'est PAS ton mot de passe GitHub mais un **Personal Access Token**. Pour le créer :

- Va sur **https://github.com/settings/tokens/new**
- **Note** : "Mac local"
- **Expiration** : "No expiration" (ou 1 an)
- Coche **"repo"** (toutes les sous-options)
- Clique **Generate token** en bas
- **Copie le token** (commence par `ghp_…`) — tu ne le reverras jamais
- Recolle-le quand `git push` te demande le password

✅ Tes fichiers sont maintenant sur GitHub.

### 5️⃣ Activer GitHub Pages

1. Sur le repo GitHub, clique **Settings** (en haut à droite)
2. Dans la sidebar, clique **Pages**
3. Sous "Source", choisis :
   - **Branch** : `main`
   - **Folder** : `/ (root)`
4. Clique **Save**

GitHub te dit : *"Your site is live at `https://TONUSER.github.io/thork-dnd/`"*

⏳ Compte 1 à 2 minutes pour que ça soit accessible la 1ʳᵉ fois.

### 6️⃣ Installer sur ta tablette Android

1. Sur ta tablette, ouvre **Chrome** (impératif).
2. Va sur `https://TONUSER.github.io/thork-dnd/`
3. Menu Chrome (⋮) → **"Installer l'application"** ou **"Ajouter à l'écran d'accueil"**.
4. L'icône **sceau de cire T** apparaît sur ton bureau.
5. Lance-la → mode plein écran, fonctionne hors-ligne après le 1ᵉʳ chargement.

🎉 **C'est fait. Tu as une vraie app D&D sur ta tablette.**

---

## Mises à jour quotidiennes — 1 commande

À chaque fois que tu modifies l'app sur ton Mac :

**Double-clic** sur `deploy.command` (dans ton Finder)

Le script :
1. Bumpe automatiquement la version du cache (`v1` → `v2` → `v3`…)
2. Commit toutes les modifications
3. Push sur GitHub
4. GitHub Pages re-déploie en ~30 secondes

À la prochaine ouverture de l'app sur ta tablette, **une bannière rouge cire** apparaît en bas pour signaler la mise à jour. Tap → nouvelle version.

> ⚠️ La 1ʳᵉ fois que tu lances `deploy.command`, Mac peut bloquer l'exécution. Si oui :
> - Va dans **Préférences Système → Sécurité et confidentialité → Général**
> - Clique sur **"Autoriser quand même"** à côté du nom du script
> - Re-double-clic sur `deploy.command`

---

## Alternative sans Terminal : GitHub Desktop

Si le Terminal te fait peur, télécharge **https://desktop.github.com/**. Application avec interface graphique :

- Tu cliques **Add → Add existing repository** → choisis ton dossier D&D
- Tu écris un message de commit
- Tu cliques **Commit** puis **Push origin**
- C'est fait

Pour bumper la version du cache, tu dois quand même éditer `sw.js` à la main avant le push :
```js
const CACHE_VERSION = 'thork-pwa-v2';   // était v1
```

---

## Synchronisation entre Mac et tablette

Les données du personnage sont stockées **localement par appareil**. Pour transférer ta progression :

1. Sur l'appareil source : **Réglages → Exporter JSON** → fichier `Thork.json` téléchargé.
2. AirDrop / mail / Drive → l'autre appareil.
3. Sur l'appareil cible : **Réglages → Importer JSON**.

Conseil : exporte avant chaque session, garde une copie sur Drive comme sauvegarde.

---

## Dépannage

**"GitHub Pages me dit 404 Not Found"**
- Attends 1–2 min après le 1ᵉʳ Save. C'est lent au début.
- Vérifie que `index.html` est bien à la **racine** du repo (pas dans un sous-dossier).
- Vérifie dans Settings → Pages que la branche est bien `main` et le folder `/`.

**"L'icône d'install n'apparaît pas dans Chrome"**
- Recharge la page une fois.
- Vérifie l'URL : doit être en `https://`, pas `http://`.
- Sur Android, ça marche dans Chrome — pas Firefox ni Samsung Internet.

**"`git push` me dit Authentication failed"**
- Crée un Personal Access Token (étape 4 ci-dessus). Mot de passe GitHub classique = refusé par git push depuis 2021.

**"Les modifications ne se voient pas sur ma tablette"**
- Le script `deploy.command` bumpe automatiquement la version du cache.
- Si tu as poussé manuellement sans bump, désinstalle/réinstalle l'app sur la tablette pour vider le cache.

**"`./deploy.command` me dit Permission denied"**
- Ouvre Terminal, va dans le dossier, tape : `chmod +x deploy.command`
- Re-double-clic sur le script.
