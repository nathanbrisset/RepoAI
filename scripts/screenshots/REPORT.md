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
| Captures réussies | 360 |
| Captures ratées | 127 |
| Image actuelle conservée | 72 |
| Visuel de repli (logo) | 55 |
| Poids de public/screenshots | 14.7 Mio |
| Poids restant de public/tool-screenshots | 246.8 Mio |

Ratées par type : error 92, captcha 33, empty 1, cookie 1.

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
| cleanvoice | Cleanvoice AI | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| clearscope | Clearscope | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| cleo | Cleo | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| clickup-ai | ClickUp AI | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| cline | Cline | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| clipchamp | Clipchamp | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| clipdroprelight | ClipDrop Relight | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| clonedub | CloneDub | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| cocounsel | CoCounsel | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| coda | Coda | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| codeassist | CodeAssist | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| codegeex | CodeGeeX | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| codegen | CodeGen | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| codepal | CodePal | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| coderabbit | CodeRabbit | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| codet5 | CodeT5 | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| codetree | Codetree | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| codify | Codify | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| codiga | Codiga | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| codiumai | CodiumAI | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| cogram | Cogram | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| cohere | Cohere | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| colossyan | Colossyan | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| comfyui | ComfyUI | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| craiyon | Craiyon | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| crewai | CrewAI | captcha | Captcha ou interstitiel anti-bot | repli logo |
| deep-nostalgia | Deep Nostalgia | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| duolingo | Duolingo | captcha | Captcha ou interstitiel anti-bot | repli logo |
| dynamicyield | Dynamic Yield | cookie | Mur de cookies | image actuelle |
| gamma | Gamma | captcha | Captcha ou interstitiel anti-bot | repli logo |
| gong | Gong | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| google_cloud_automl | Google Cloud AutoML | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| google-ai-studio | Google AI Studio | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| google-antigravity | Google Antigravity | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| google-flow-music | Google Flow Music | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| google-stitch | Google Stitch | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| grammarly | Grammarly | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| granola | Granola | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| graphite | Graphite | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| greptile | Greptile | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| grok | Grok | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| groq | Groq | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| growthbar | GrowthBar | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| ideogram | Ideogram | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| illustroke | Illustroke | error | page.screenshot: Timeout 10000ms exceeded. | image actuelle |
| influencity | Influencity | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| instantly | Instantly | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| intercom-fin | Intercom Fin | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| interior_ai | Interior AI | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| invideo | InVideo | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| izotope-cascadia | Izotope Cascadia | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| jamie | Jamie AI | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| jasper-art | Jasper Art | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| juicebox | Juicebox | error | page.screenshot: Timeout 10000ms exceeded. | repli logo |
| kaggle_kernels | Kaggle Kernels | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| leonardo_ai | Leonardo.Ai | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| looka | Looka | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| lovable | Lovable | captcha | Captcha ou interstitiel anti-bot | repli logo |
| manychat | ManyChat | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| midjourney | Midjourney | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| ml-net | ML.NET | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| mobilemonkey | MobileMonkey | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| moises | Moises | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| motion | Motion | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| mp3tomidi | MP3 to MIDI (mp3tomidi.io) | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| msty | Msty | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| mubert | Mubert | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| munch | Munch | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| murf-ai | Murf.ai | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| mutiny | Mutiny | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| myedit | MyEdit | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| n8n | n8n | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| neurallove | Neural.love Video Enhancer | error | Page 404 | image actuelle |
| nightcafe | NightCafe | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| novelai | NovelAI | captcha | Captcha ou interstitiel anti-bot | repli logo |
| perplexity-ai | Perplexity | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| perplexity-comet | Perplexity Comet | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| persado | Persado | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| photomath | Photomath | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| photoroom | Photoroom | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| phrasee | Phrasee | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| picsart_ai | Picsart AI | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| pictory | Pictory | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| poe | Poe | captcha | Captcha ou interstitiel anti-bot | repli logo |
| power-bi | Microsoft Power BI | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| quillbot | QuillBot | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| quizlet | Quizlet | captcha | Captcha ou interstitiel anti-bot | repli logo |
| raycast | Raycast | error | page.screenshot: Timeout 10000ms exceeded. | repli logo |
| readwise-reader | Readwise Reader | captcha | Captcha ou interstitiel anti-bot | repli logo |
| retell-ai | Retell AI | error | page.screenshot: Timeout 10000ms exceeded. | repli logo |
| skyvern | Skyvern | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| smartlead | Smartlead | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| socket | Socket | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| softr | Softr | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| sonix | Sonix | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| soundful | Soundful | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| spellbook | Spellbook | captcha | Captcha ou interstitiel anti-bot | repli logo |
| stockimg_ai | Stockimg.AI | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| submagic | Submagic | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| suno | Suno | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| sunsama | Sunsama | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| supabase | Supabase | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| superhuman | Superhuman | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| surfer-seo | Surfer SEO | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| synthesia | Synthesia | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| synthesys | Synthesys | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| tableau | Tableau | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| tavus | Tavus | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| teleporthq | TeleportHQ | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| tensor-art | Tensor.Art | captcha | Captcha ou interstitiel anti-bot | repli logo |
| uxpin | UXPin | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| vizcom | Vizcom | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| voice-ai | Voice.ai | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| voiceflow | Voiceflow | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| warp | Warp | error | page.goto: Timeout 22000ms exceeded. | repli logo |
| watson_studio | IBM Watson Studio | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| wavtool | WavTool | error | page.goto: Timeout 22000ms exceeded. | image actuelle |
| webflow | Webflow | captcha | Captcha ou interstitiel anti-bot | repli logo |
| wellsaid | WellSaid Labs | captcha | Captcha ou interstitiel anti-bot | image actuelle |
| zonos | Zonos AI | captcha | Captcha ou interstitiel anti-bot | image actuelle |
