#!/usr/bin/env bash
# Refresh screenshots from origin/restore3-new and open or update a PR.
# Never pushes to restore3-new or main, and never merges.
set -euo pipefail

if [[ "${GITHUB_ACTIONS:-}" != "true" ]]; then
  echo "Ce script ne pousse une branche que dans GitHub Actions."
  exit 1
fi

BASE_BRANCH="${SCREENSHOTS_BASE:-restore3-new}"
HEAD_BRANCH="${SCREENSHOTS_HEAD:-screenshots/monthly}"

case "$HEAD_BRANCH" in
  main|master|restore3-new|"$BASE_BRANCH")
    echo "Refus de pousser sur ${HEAD_BRANCH}."
    exit 1
    ;;
esac

cd "$(dirname "$0")/../.."
export SCREENSHOTS_BROWSER=chromium

git fetch origin "$BASE_BRANCH"
tool="$(mktemp -d)"
cp -a scripts/screenshots/. "$tool/"

git checkout -B "$HEAD_BRANCH" "origin/${BASE_BRANCH}"
mkdir -p scripts/screenshots
cp -a "$tool/." scripts/screenshots/

node scripts/screenshots/capture.mjs --concurrency 3
node scripts/screenshots/keep-changed.mjs

reports="$(mktemp -d)"
cp scripts/screenshots/REPORT.md scripts/screenshots/capture-report.json scripts/screenshots/publish-summary.json "$reports/"
if git cat-file -e "HEAD:scripts/screenshots/capture.mjs" 2>/dev/null; then
  git checkout HEAD -- scripts/screenshots
fi
mkdir -p scripts/screenshots
cp "$reports/REPORT.md" "$reports/capture-report.json" scripts/screenshots/

git add -- content/tools public/screenshots scripts/screenshots/REPORT.md scripts/screenshots/capture-report.json

if git diff --cached --quiet -- content/tools public/screenshots; then
  echo "Aucune capture réussie modifiée. Pas de push, pas de PR."
  exit 0
fi

git -c user.name="github-actions[bot]" \
  -c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
  commit -m "Update tool screenshots that actually changed."

if git fetch origin "refs/heads/${HEAD_BRANCH}:refs/remotes/origin/${HEAD_BRANCH}" 2>/dev/null; then
  git push --force-with-lease origin "HEAD:${HEAD_BRANCH}"
else
  git push origin "HEAD:${HEAD_BRANCH}"
fi

read_count() {
  SUMMARY="$reports/publish-summary.json" FIELD="$1" node --input-type=module -e 'import fs from "fs"; const s=JSON.parse(fs.readFileSync(process.env.SUMMARY,"utf8")); const v=s[process.env.FIELD]; console.log(Array.isArray(v)?v.length:v)'
}
published="$(read_count published)"
unchanged="$(read_count unchanged)"
failed="$(read_count discarded)"

title="Captures d'écran mensuelles"
body="$(cat <<EOF
Mise à jour automatique des captures réussies qui diffèrent de l'image déjà dans \`${BASE_BRANCH}\`.

- Republiées : ${published}
- Réussies mais inchangées (non commitées) : ${unchanged}
- Ratées (non publiées) : ${failed}

Le détail des échecs est dans \`scripts/screenshots/REPORT.md\`.

Cette PR est ouverte ou mise à jour par GitHub Actions. Elle n'est pas mergée automatiquement.
EOF
)"

existing="$(gh pr list --base "$BASE_BRANCH" --head "$HEAD_BRANCH" --state open --json number --jq '.[0].number')"
if [[ -n "$existing" && "$existing" != "null" ]]; then
  gh pr edit "$existing" --title "$title" --body "$body"
  echo "PR mise à jour : #${existing}"
else
  gh pr create --base "$BASE_BRANCH" --head "$HEAD_BRANCH" --title "$title" --body "$body"
fi
