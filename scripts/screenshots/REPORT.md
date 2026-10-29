# Captures d'écran du catalogue

Généré le 2026-10-29. Les fiches sunset sont exclues. Les captures ratées ne sont pas publiées.

## Audit des images avant remplacement

| Constat | Nombre |
| --- | ---: |
| Fiches hors sunset | 487 |
| Actives | 469 |
| Renommées (conservées dans le catalogue) | 16 |
| Image locale présente | 260 |
| Champ image vide | 227 |
| Fichier image manquant (404 local) | 0 |
| Images partagées entre plusieurs fiches | 0 |
| Poids des images alors référencées | 150.4 Mio |

Aucune. Chaque fichier présent a un chemin et un hash SHA-256 qui lui sont propres.

Fiches sans image : abridge, activepieces, ada-health, adcreative-ai, aider, aikido, akiflow, alphasense, altered, amp, anything, apollo-io, arcads, assemblyai, attio, augment-code, bardeen, base44, beautiful-ai, better-analyst-formerly-formula-bot, bland-ai, bolt, botpress, brainly, brisk-teaching, browser-use, bubble, buffer, captions, cartesia, character-ai, chatbase, claude-code, clay, cleo, cline, clipchamp, cocounsel, coda, coderabbit, cohere, connected-papers, consensus, craft, creatify, crewai, decagon, deepgram, deepl, deepseek, devin, dia, dify, digits, dreamina, duolingo, durable, eightfold-ai, elicit, exa, factory, fal, fathom, figma-make, firebase-studio, fiscal-ai, fish-audio, flutterflow, flux, folk, freed, gamma, gauth, gemini-cli, genspark, glean, glide, gong, google-ai-studio, google-antigravity, google-flow-music, google-stitch, granola, graphite, greptile, grok, groq, gumloop, hailuo-ai, happy, harvey, hebbia, hedra, heidi-health, hex, higgsfield, hirevue, huggingchat, hume-ai, ifttt, instantly, intercom-fin, jan, juicebox, jules, kagi, kapwing, khanmigo, kilo-code, kimi, kiro, kittl, kling, knowt, krea, lakera, landr, langchain, langflow, legora, lemlist, lindy, llama, lm-studio, lovable, ltx-studio, luminance, macwhisper, magicschool, make, manus, meta-ai, metaview, microsoft-365-copilot, microsoft-designer, microsoft-power-automate, mistral, moises, mp3tomidi, msty, mubert, n8n, nabla, napkin-ai, notebooklm, notta, novelai, ollama, openevidence, openhands, openrouter, paradox, perplexity-comet, photomath, pi, pika, pipedream, pitch, pixverse, plus-ai, poe, polymer, predis-ai, profound, quizlet, raycast, read-ai, readwise-reader, recapo, relevance-ai, researchrabbit, retell-ai, retool, reve, robin-ai, rogo, roomote-roo-code, rork, rows, rytr, scispace, scite, semantic-scholar, semgrep, shortwave, sierra, skyvern, smartlead, socket, softr, soundful, speak, spellbook, stable-audio, submagic, sunsama, supabase, superhuman, superwhisper, tana, taplio, tavily, tempo, tensor-art, textio, tl-dv, topaz-labs, trae, turbolearn, typecast, typefully, typingmind, udio, undermind, vapi, veo, vidu, viggle, vizcom, voiceflow, warp, webflow, windsurf, wispr-flow, you-com, z-ai-glm, zed.

Les fichiers manquants : aucun.

Les PNG historiques dans `public/tool-screenshots` sont des captures plein cadre, souvent 1920×1080, sans format commun. L'audit visuel (OCR) des pages 404, captchas et murs de connexion déjà stockés est repris dans la section suivante quand une nouvelle capture échoue : une image actuelle qui est elle-même une 404, un captcha, une connexion ou une page vide n'est pas conservée.

## Résultat de la passe

| Issue | Nombre |
| --- | ---: |
| Captures réussies | 628 |
| Captures ratées | 7 |
| Image actuelle conservée | 5 |
| Visuel de repli (logo) | 2 |
| Poids de public/screenshots | 34.0 Mio |
| Poids restant de public/tool-screenshots | 38.0 Mio |

Ratées par type : error 2, captcha 5.

## Images publiées avec une note

| id | note |
| --- | --- |
| adobe-marketo-engage | Capture de https://business.adobe.com/products/marketo.html, URL finale du navigateur. |
| autoregex | Page produit visible. Un iframe captcha est dans le DOM mais ne couvre pas la page. |
| character-ai | Capture de character.ai. |
| claude-3 | Capture de claude.com, le site marketing officiel. claude.ai répond 403. |
| clipdroprelight | Image officielle og:image de clipdrop.co/relight. La page elle-même est un interstitiel. |
| codepal | Image officielle og:image de codepal.ai. La page elle-même est un captcha. |
| deepseek | Capture de la homepage après chargement des visuels, avant le plantage JavaScript. |
| gamma | Capture de help.gamma.app. gamma.app, /pricing et /templates restent derrière un captcha. |
| ideogram | Image officielle about.ideogram.ai, pas une capture du navigateur. ideogram.ai reste derrière un captcha. |
| neurallove | Capture de https://neural.love/video. |
| perplexity-comet | PNG 1024×594 capturé dans un navigateur réel, fourni dans l'agent store (shots/). |
| pictory | Image officielle og:image de pictory.ai. La page elle-même est un captcha. |
| quillbot | PNG 1024×594 capturé dans un navigateur réel, fourni dans l'agent store (shots/). |
| semrushwritingassistant | Capture de https://www.semrush.com/swa/. |
| wellsaid | Capture de wellsaid.io/ai-voice-pricing. La homepage est un captcha. |
| zonos | Capture du HTML de zonosai.com sans JavaScript. Avec JavaScript la page est un captcha. |

## Captures ratées

| id | nom | type | détail | décision |
| --- | --- | --- | --- | --- |
| claude | Claude | error | HTTP 403 | image actuelle |
| codeassist | CodeAssist | captcha | Cloudflare : blocage dur (Sorry, you have been blocked) | image actuelle |
| growthbar | GrowthBar | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| lovo | LOVO | error | HTTP 402 | image actuelle |
| perplexity-ai | Perplexity | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| remini | Remini | captcha | Captcha ou interstitiel anti-bot | repli logo |
| ttsmaker | TTSMaker | captcha | Captcha ou interstitiel anti-bot | repli logo |
