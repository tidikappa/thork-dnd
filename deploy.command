#!/bin/bash
# === deploy.command — Met à jour l'app sur GitHub Pages ===
# Double-clic ou ./deploy.command depuis le terminal.
# Le script :
#   1. Bumpe automatiquement le numéro de CACHE_VERSION dans sw.js
#   2. Git add tous les fichiers modifiés
#   3. Git commit + push vers GitHub
#   4. GitHub Pages re-déploie automatiquement en ~30 secondes

set -e
cd "$(dirname "$0")"

echo ""
echo "════════════════════════════════════════════════"
echo "   ✦ DÉPLOIEMENT D&D — Thork ✦"
echo "════════════════════════════════════════════════"
echo ""

# --- 1. Vérifier qu'on est dans un repo git ---
if [ ! -d ".git" ]; then
  echo "❌ Ce dossier n'est pas (encore) un repo Git."
  echo "   Suis MISE-EN-LIGNE-GITHUB.md pour la 1ʳᵉ initialisation."
  echo ""
  read -p "Appuie sur Entrée pour fermer..."
  exit 1
fi

# --- 2. Bumper la version du cache dans sw.js ---
CURRENT=$(grep -oE "thork-pwa-v[0-9]+" sw.js | head -1 | grep -oE "[0-9]+$")
if [ -z "$CURRENT" ]; then
  echo "⚠️  Impossible de lire CACHE_VERSION dans sw.js"
  CURRENT=1
fi
NEXT=$((CURRENT + 1))

echo "→ Bump CACHE_VERSION : v${CURRENT} → v${NEXT}"
sed -i.bak "s/thork-pwa-v${CURRENT}/thork-pwa-v${NEXT}/g" sw.js
rm -f sw.js.bak

# --- 3. Git add / commit / push ---
echo "→ Git add ."
git add .

if git diff --cached --quiet; then
  echo "ℹ️  Aucune modification à pousser."
  echo "   (sw.js a quand même été bumpé, je le commit quand même)"
fi

echo "→ Git commit"
MSG="Mise à jour v${NEXT} — $(date '+%Y-%m-%d %H:%M')"
git commit -m "$MSG" || echo "ℹ️  Rien à commiter"

echo "→ Git push origin main"
if ! git push origin main 2>&1; then
  echo ""
  echo "❌ Le push a échoué."
  echo "   Vérifie que ton remote 'origin' est bien configuré et"
  echo "   que tu es authentifié (token ou SSH)."
  read -p "Appuie sur Entrée pour fermer..."
  exit 1
fi

echo ""
echo "════════════════════════════════════════════════"
echo "   ✓ Déployé en v${NEXT}"
echo "════════════════════════════════════════════════"
echo ""
echo "GitHub Pages re-déploie automatiquement en ~30 sec."
echo "Sur ta tablette, à la prochaine ouverture de l'app,"
echo "la bannière 'Mise à jour disponible' apparaîtra en bas."
echo ""
read -p "Appuie sur Entrée pour fermer..."
