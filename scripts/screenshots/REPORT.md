# Captures d'écran du catalogue

Généré le 2026-10-21. Les fiches sunset sont exclues. Les captures ratées ne sont pas publiées.

## Audit des images avant remplacement

| Constat | Nombre |
| --- | ---: |
| Fiches hors sunset | 306 |
| Actives | 290 |
| Renommées (conservées dans le catalogue) | 16 |
| Image locale présente | 260 |
| Champ image vide | 46 |
| Fichier image manquant (404 local) | 0 |
| Images partagées entre plusieurs fiches | 0 |
| Poids des images alors référencées | 150.4 Mio |

Aucune. Chaque fichier présent a un chemin et un hash SHA-256 qui lui sont propres.

Fiches sans image : altered, bolt, captions, character-ai, claude-code, clay, cline, deepl, deepseek, devin, dify, elicit, fal, fathom, firebase-studio, flux, gamma, genspark, google-ai-studio, granola, grok, hailuo-ai, happy, hedra, higgsfield, jules, kimi, kling, krea, lindy, llama, lovable, manus, mistral, mp3tomidi, n8n, napkin-ai, notebooklm, perplexity-comet, pika, recapo, udio, veo, warp, windsurf, wispr-flow.

Les fichiers manquants : aucun.

Les PNG historiques dans `public/tool-screenshots` sont des captures plein cadre, souvent 1920×1080, sans format commun. L'audit visuel (OCR) des pages 404, captchas et murs de connexion déjà stockés est repris dans la section suivante quand une nouvelle capture échoue : une image actuelle qui est elle-même une 404, un captcha, une connexion ou une page vide n'est pas conservée.

## Résultat de la passe

| Issue | Nombre |
| --- | ---: |
| Captures réussies | 289 |
| Captures ratées | 17 |
| Image actuelle conservée | 14 |
| Visuel de repli (logo) | 3 |
| Poids de public/screenshots | 12.0 Mio |
| Poids restant de public/tool-screenshots | 37.8 Mio |

Ratées par type : error 5, captcha 12.

## Captures ratées

| id | nom | type | détail | décision |
| --- | --- | --- | --- | --- |
| alphacode | AlphaCode | error | page.goto: net::ERR_CONNECTION_CLOSED at https://alphacode.deepmind.com/ | image actuelle |
| autoregex | AutoRegex | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| character-ai | Character.ai | error | page.evaluate: Execution context was destroyed, most likely because of a navigation | repli logo |
| claude-3 | Claude | error | HTTP 403 | image actuelle |
| clipdroprelight | ClipDrop Relight | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| codeassist | CodeAssist | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| codepal | CodePal | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| gamma | Gamma | error | HTTP 403 | repli logo |
| growthbar | GrowthBar | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| ideogram | Ideogram | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| neurallove | Neural.love Video Enhancer | error | Page 404 | image actuelle |
| perplexity-ai | Perplexity | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| perplexity-comet | Perplexity Comet | captcha | Captcha ou interstitiel anti-bot | repli logo |
| pictory | Pictory | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| quillbot | QuillBot | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| wellsaid | WellSaid Labs | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| zonos | Zonos AI | captcha | Captcha ou interstitiel anti-bot | image actuelle |
