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
| Captures réussies | 251 |
| Captures ratées | 55 |
| Image actuelle conservée | 45 |
| Visuel de repli (logo) | 10 |
| Poids de public/screenshots | 10.6 Mio |
| Poids restant de public/tool-screenshots | 37.8 Mio |

Ratées par type : error 24, captcha 30, empty 1.

## Captures ratées

| id | nom | type | détail | décision |
| --- | --- | --- | --- | --- |
| alphacode | AlphaCode | error | page.goto: net::ERR_CONNECTION_CLOSED at https://alphacode.deepmind.com/ | image actuelle |
| autoregex | AutoRegex | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| character-ai | Character.ai | captcha | Captcha ou interstitiel anti-bot | repli logo |
| chatcode | ChatCode | empty | Page vide | image actuelle |
| claude-3 | Claude | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| clearscope | Clearscope | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| clipdroprelight | ClipDrop Relight | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| codeassist | CodeAssist | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| codepal | CodePal | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| craiyon | Craiyon | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| deep-nostalgia | Deep Nostalgia | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| dubverse | Dubverse | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| dynamicyield | Dynamic Yield | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| elaiio | Elai.io | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| elevenlabs | ElevenLabs | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| elicit | Elicit | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| faceapp | FaceApp | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| fal | fal | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| fathom | Fathom | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| fronty | Fronty | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| gamma | Gamma | captcha | Captcha ou interstitiel anti-bot | repli logo |
| gling | Gling | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| growthbar | GrowthBar | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| ideogram | Ideogram | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| kaggle_kernels | Kaggle Kernels | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| leonardo_ai | Leonardo.Ai | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| looka | Looka | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| lovable | Lovable | captcha | Captcha ou interstitiel anti-bot | repli logo |
| manus | Manus | captcha | Captcha ou interstitiel anti-bot | repli logo |
| manychat | ManyChat | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| midjourney | Midjourney | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| mindsdb | MindsDB | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| mp3tomidi | MP3 to MIDI (mp3tomidi.io) | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| munch | Munch | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| murf-ai | Murf.ai | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| mutiny | Mutiny | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| neurallove | Neural.love Video Enhancer | error | Page 404 | image actuelle |
| perplexity-ai | Perplexity | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| perplexity-comet | Perplexity Comet | captcha | Captcha ou interstitiel anti-bot | repli logo |
| pictory | Pictory | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| power-bi | Microsoft Power BI | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| quillbot | QuillBot | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| stable-diffusion | Stable Diffusion | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| suno | Suno | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| tavus | Tavus | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| teleporthq | TeleportHQ | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| thoughtspot | ThoughtSpot | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| tidio | Tidio | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| trint | Trint | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| uberduck | Uberduck | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| udio | Udio | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| uizard | Uizard | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| uxpin | UXPin | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| wellsaid | WellSaid Labs | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| zonos | Zonos AI | captcha | Captcha ou interstitiel anti-bot | image actuelle |
