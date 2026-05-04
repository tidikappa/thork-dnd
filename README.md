# Assistant D&D 5e — Thork 

Application web personnelle pour gérer le personnage **Thork** (Demi-orc Clerc Tempête, niv 4) en sessions de Donjons & Dragons 5e (édition 2024).

**Hébergée en PWA installable** sur GitHub Pages — fonctionne sur Mac, Android, iPad, hors-ligne après le 1ᵉʳ chargement.

## Fonctionnalités

- 📜 Fiche de personnage complète : caractéristiques, sauvegardes, compétences
- ❤️ Tracker temps réel : PV, dés de vie, emplacements de sorts, états, repos courts/longs
- ✨ Bibliothèque de sorts (~120 sorts FR), gestion préparation et lancement avec consommation de slots
- ⚡ Capacités & traits avec charges récupérables
- 🎒 Inventaire, armes (jets d'attaque/dégâts/critique), monnaie
- 🛡️ Calcul automatique de la CA depuis l'équipement (armure + bouclier + DEX + bonus magique)
- 🎖️ Wizard de passage de niveau (calcul auto PV, bonus de maîtrise, etc.)

## Stack

- HTML/CSS/JS dans un seul fichier `index.html`
- React 18 (CDN) + Tailwind CSS (CDN)
- Service Worker pour cache offline et mises à jour
- Stockage local via `localStorage` du navigateur

## Mise à jour

Lance `./deploy.command` depuis le terminal Mac :
- Le script bumpe automatiquement le numéro de version dans `sw.js`
- Commit & push sur GitHub
- GitHub Pages re-déploie en ~30 secondes
- À la prochaine ouverture sur la tablette, une bannière signale la mise à jour

## Synchronisation entre appareils

Les données sont stockées dans le navigateur de chaque appareil. Pour transférer entre Mac et tablette :
- **Onglet Réglages → Exporter JSON** sur la source
- AirDrop / mail / Drive vers l'autre appareil
- **Onglet Réglages → Importer JSON** sur la cible
