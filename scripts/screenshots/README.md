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
node scripts/screenshots/capture.mjs --ids udio,mp3tomidi --retries 2 --timeout 50000
```

`--retries` relance une fiche après un échec (timeout, page vide, captcha, erreur). `--timeout` est le délai de navigation en millisecondes. Le script attend aussi le chargement de la page et des images, ferme les bannières cookies, et utilise un user-agent desktop.

`--ids` ne traite que ces fiches. `--missing` ne traite que les fiches qui n'ont pas encore de fichier `public/screenshots/<id>.webp` (les nouvelles fiches, ou un passage interrompu). Les deux options se combinent.

`--prune-orphans` supprime, après la passe, les PNG de `public/tool-screenshots` qu'aucune fiche ne référence plus.

Le rapport des captures ratées est réécrit dans `scripts/screenshots/REPORT.md`. L'audit des images d'origine (manquantes, 404, partagées, hors sujet) est dans `scripts/screenshots/AUDIT.md`.

`node scripts/catalog-qa.mjs` (ou `npm run catalog:qa`) échoue si une fiche hors sunset a une capture locale sous 15 Ko, sauf les pages peu denses déjà revues dans le script, ou si un How To Use pointe vers YouTube ou un guide tiers (`yeschat.ai`, `cococlip.ai`, `fahimai.com`). Il échoue aussi si une URL du catalogue ou de `app/` utilise encore `aidungeon.io`, `useblackbox.io`, `cursor.sh`, `chat.openai.com` ou `lensa-ai.com`.

`xvfb-run -a node scripts/screenshots/recover.mjs` est une passe manuelle (Chrome fenêtré, page officielle alternative, puis image `og:image` assez grande). Le workflow mensuel ne l'appelle pas. Une page captcha, connexion, 404 ou erreur n'est pas publiée.

## Workflow mensuel

`.github/workflows/screenshots.yml` tourne le 1er de chaque mois à 06:00 UTC, et à la demande avec `workflow_dispatch`. Il installe les dépendances et Chromium (`npx playwright install --with-deps chromium`), relance la capture sur les fiches hors sunset, puis ne conserve que les captures **réussies** dont l'image diffère vraiment de celle déjà versionnée (écart absolu moyen d'au moins 8 sur une réduction 64×40, voir `keep-changed.mjs`).

Le job ouvre, ou met à jour, une pull request de la branche `screenshots/monthly` vers `restore3-new`, avec ces images et `scripts/screenshots/REPORT.md`. Il ne pousse ni sur `restore3-new` ni sur `main`, et il ne merge rien.

Le `GITHUB_TOKEN` du workflow n'a que `contents: write` (pousser la branche du bot) et `pull-requests: write` (ouvrir ou éditer la PR).

À activer dans le dépôt (Settings → Actions → General) :

- **Workflow permissions** : « Read and write permissions ». Le réglage « Read repository contents » bloque le push de `screenshots/monthly` même si le workflow demande `contents: write`.
- **Allow GitHub Actions to create and approve pull requests**. Sans cette case, le `GITHUB_TOKEN` ne peut pas ouvrir la PR.

Le cron GitHub part uniquement de la branche par défaut du dépôt (`main`). Le fichier de workflow doit donc y être présent pour que le mois se déclenche. `workflow_dispatch` apparaît dans l'onglet Actions une fois ce fichier sur cette branche. La branche `restore3-new` doit exister : c'est la base de la PR automatique.
