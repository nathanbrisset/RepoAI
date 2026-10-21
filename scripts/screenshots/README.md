# Captures d'écran

Capture le site officiel de chaque fiche non sunset (`content/tools/*.json`, champ `status`) en 1280×800, tente de fermer la bannière cookies, enregistre un WebP optimisé dans `public/screenshots/<id>.webp`, puis met à jour le champ `image`.

Les fiches `sunset` sont ignorées. Une capture ratée (captcha, page de connexion, page vide, erreur) n'est pas publiée. Si l'image actuelle est un fichier local lisible et qui n'est pas lui-même une 404, un captcha ou une page de connexion, elle est conservée. Sinon le script écrit un visuel de repli : logo centré, ou initiales si le logo manque, et le nom de l'outil.

## Prérequis

```bash
npm install
npx playwright install chromium
```

Si Google Chrome est installé, le script l'utilise. Sinon il lance le Chromium de Playwright.

## Commandes

Depuis la racine du dépôt :

```bash
node scripts/screenshots/capture.mjs
node scripts/screenshots/capture.mjs --ids zapier,notion-ai
node scripts/screenshots/capture.mjs --missing
node scripts/screenshots/capture.mjs --concurrency 4
```

`--ids` ne traite que ces fiches. `--missing` ne traite que les fiches qui n'ont pas encore de fichier `public/screenshots/<id>.webp` (les nouvelles fiches, ou un passage interrompu). Les deux options se combinent.

`--prune-orphans` supprime, après la passe, les PNG de `public/tool-screenshots` qu'aucune fiche ne référence plus.

Le rapport des captures ratées est réécrit dans `scripts/screenshots/REPORT.md`. L'audit des images d'origine (manquantes, 404, partagées, hors sujet) est dans `scripts/screenshots/AUDIT.md`.
