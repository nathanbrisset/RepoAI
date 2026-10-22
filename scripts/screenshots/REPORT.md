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
| Captures réussies | 303 |
| Captures ratées | 2 |
| Image actuelle conservée | 2 |
| Visuel de repli (logo) | 0 |
| Poids de public/screenshots | 12.6 Mio |
| Poids restant de public/tool-screenshots | 38.0 Mio |

Ratées par type : captcha 2.

## Images publiées avec une note

| id | note |
| --- | --- |
| adobe-marketo-engage | Capture de https://business.adobe.com/products/marketo.html, URL finale du navigateur. |
| autoregex | Page produit visible. Un iframe captcha est dans le DOM mais ne couvre pas la page. |
| character-ai | Capture de character.ai. |
| chatcode | Rendu attendu (fond #343541, titre, champ Ask Code). La page ne contient rien d'autre. |
| claude-3 | Capture de claude.com, le site marketing officiel. claude.ai répond 403. |
| clipdroprelight | Image officielle og:image de clipdrop.co/relight. La page elle-même est un interstitiel. |
| codepal | Image officielle og:image de codepal.ai. La page elle-même est un captcha. |
| deepseek | Capture de la homepage après chargement des visuels, avant le plantage JavaScript. |
| gamma | Capture de help.gamma.app. gamma.app, /pricing et /templates restent derrière un captcha. |
| ideogram | Image officielle about.ideogram.ai, pas une capture du navigateur. ideogram.ai reste derrière un captcha. |
| neurallove | Capture de https://neural.love/video. |
| perplexity-ai | PNG 1024×594 capturé dans un navigateur réel, fourni dans l'agent store (shots/). |
| perplexity-comet | PNG 1024×594 capturé dans un navigateur réel, fourni dans l'agent store (shots/). |
| pictory | Image officielle og:image de pictory.ai. La page elle-même est un captcha. |
| quillbot | PNG 1024×594 capturé dans un navigateur réel, fourni dans l'agent store (shots/). |
| semrushwritingassistant | Capture de https://www.semrush.com/swa/. |
| wellsaid | Capture de wellsaid.io/ai-voice-pricing. La homepage est un captcha. |
| zonos | Capture du HTML de zonosai.com sans JavaScript. Avec JavaScript la page est un captcha. |

## Captures ratées

| id | nom | type | détail | décision |
| --- | --- | --- | --- | --- |
| codeassist | CodeAssist | captcha | Cloudflare : blocage dur (Sorry, you have been blocked) | image actuelle |
| growthbar | GrowthBar | captcha | Captcha ou interstitiel anti-bot | image actuelle |

## Intégration avec le lot

Ce rapport est celui de la branche captures (`edab3013`) pour les fiches qui existaient déjà. Les fiches nouvelles du lot gardent leurs captures, de même que Brainly, Quizlet et Tensor.Art (`public/screenshots/brainly.webp`, `quizlet.webp`, `tensor-art.webp`). Le contrôle des fiches actives est `npm run catalog:qa`.
