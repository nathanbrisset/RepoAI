# Captures d'écran du catalogue

Généré le 2026-10-21. Les fiches sunset sont exclues. Les captures ratées ne sont pas publiées.

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
| Captures réussies | 435 |
| Captures ratées | 52 |
| Image actuelle conservée | 31 |
| Visuel de repli (logo) | 21 |
| Poids de public/screenshots | 19.4 Mio |
| Poids restant de public/tool-screenshots | 246.8 Mio |

Ratées par type : error 10, captcha 40, empty 2.

## Captures ratées

| id | nom | type | détail | décision |
| --- | --- | --- | --- | --- |
| alphacode | AlphaCode | error | page.goto: net::ERR_CONNECTION_CLOSED at https://alphacode.deepmind.com/ | image actuelle |
| attio | Attio | captcha | Captcha ou interstitiel anti-bot | repli logo |
| autoregex | AutoRegex | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| brainly | Brainly | captcha | Captcha ou interstitiel anti-bot | repli logo |
| character-ai | Character.ai | captcha | Captcha ou interstitiel anti-bot | repli logo |
| chatcode | ChatCode | empty | Page vide | image actuelle |
| claude-3 | Claude | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| clearscope | Clearscope | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| clipdroprelight | ClipDrop Relight | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| cocounsel | CoCounsel | captcha | Captcha ou interstitiel anti-bot | repli logo |
| codeassist | CodeAssist | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| codepal | CodePal | captcha | Captcha ou interstitiel anti-bot | repli logo |
| codiumai | CodiumAI | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| craiyon | Craiyon | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| crewai | CrewAI | captcha | Captcha ou interstitiel anti-bot | repli logo |
| deep-nostalgia | Deep Nostalgia | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| duolingo | Duolingo | captcha | Captcha ou interstitiel anti-bot | repli logo |
| gamma | Gamma | captcha | Captcha ou interstitiel anti-bot | repli logo |
| google_cloud_automl | Google Cloud AutoML | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| google-stitch | Google Stitch | empty | Page vide | repli logo |
| growthbar | GrowthBar | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| ideogram | Ideogram | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| kaggle_kernels | Kaggle Kernels | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| leonardo_ai | Leonardo.Ai | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| manychat | ManyChat | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| midjourney | Midjourney | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| mobilemonkey | MobileMonkey | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| munch | Munch | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| neurallove | Neural.love Video Enhancer | error | Page 404 | image actuelle |
| novelai | NovelAI | captcha | Captcha ou interstitiel anti-bot | repli logo |
| perplexity-ai | Perplexity | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| perplexity-comet | Perplexity Comet | captcha | Captcha ou interstitiel anti-bot | repli logo |
| phrasee | Phrasee | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| pictory | Pictory | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| poe | Poe | captcha | Captcha ou interstitiel anti-bot | repli logo |
| power-bi | Microsoft Power BI | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| quillbot | QuillBot | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| quizlet | Quizlet | captcha | Captcha ou interstitiel anti-bot | repli logo |
| raycast | Raycast | error | page.screenshot: Timeout 10000ms exceeded. | repli logo |
| readwise-reader | Readwise Reader | captcha | Captcha ou interstitiel anti-bot | repli logo |
| retell-ai | Retell AI | captcha | Captcha ou interstitiel anti-bot | repli logo |
| skyvern | Skyvern | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| smartlead | Smartlead | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| spellbook | Spellbook | captcha | Captcha ou interstitiel anti-bot | repli logo |
| suno | Suno | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| tavus | Tavus | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| teleporthq | TeleportHQ | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| tensor-art | Tensor.Art | captcha | Captcha ou interstitiel anti-bot | repli logo |
| uxpin | UXPin | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| webflow | Webflow | captcha | Captcha ou interstitiel anti-bot | repli logo |
| wellsaid | WellSaid Labs | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| zonos | Zonos AI | captcha | Captcha ou interstitiel anti-bot | image actuelle |
