# Contrôle des fiches actives

Généré le 2026-10-21.

| Compteur | Nombre |
| --- | ---: |
| Fiches actives contrôlées | 469 |
| Conformes | 434 |
| Encore en échec parmi les fiches restées actives | 34 |
| Passée en inactif après ce contrôle | 1 (AlphaCode, échec SSL de https://alphacode.deepmind.com/) |

## Échecs restants par raison

- 1 × capture suspecte (7160 octets, sous 15 Ko)
- 19 × capture absente
- 1 × capture suspecte (13624 octets, sous 15 Ko)
- 17 × lien officiel HTTP
- 1 × capture suspecte (9534 octets, sous 15 Ko)
- 1 × capture suspecte (11904 octets, sous 15 Ko)
- 1 × le texte de la page officielle ne recoupe ni le nom ni la description
- 1 × capture suspecte (8490 octets, sous 15 Ko)

## Fiches non corrigées

| id | nom | raison |
| --- | --- | --- |
| anything | Anything | capture suspecte (7160 octets, sous 15 Ko) |
| attio | Attio | capture absente |
| autoregex | AutoRegex | capture suspecte (13624 octets, sous 15 Ko) |
| brainly | Brainly | lien officiel HTTP 403; capture absente |
| character-ai | Character.ai | lien officiel HTTP 403; capture absente |
| chatcode | ChatCode | capture absente |
| clipdroprelight | ClipDrop Relight | capture suspecte (9534 octets, sous 15 Ko) |
| cocounsel | CoCounsel | capture absente |
| codeassist | CodeAssist | lien officiel HTTP 403 |
| codepal | CodePal | capture absente |
| craiyon | Craiyon | lien officiel HTTP 403 |
| crewai | CrewAI | capture absente |
| deepseek | DeepSeek | capture suspecte (11904 octets, sous 15 Ko) |
| duolingo | Duolingo | capture absente |
| gamma | Gamma | lien officiel HTTP 403; capture absente |
| google-stitch | Google Stitch | capture absente |
| ideogram | Ideogram | lien officiel HTTP 403 |
| leonardo_ai | Leonardo.Ai | lien officiel HTTP 403 |
| manychat | ManyChat | lien officiel HTTP 403 |
| mem | Mem | le texte de la page officielle ne recoupe ni le nom ni la description |
| meta-ai | Meta AI | lien officiel HTTP 403 |
| midjourney | Midjourney | lien officiel HTTP 403 |
| novelai | NovelAI | capture absente |
| perplexity-ai | Perplexity | lien officiel HTTP 403; capture suspecte (8490 octets, sous 15 Ko) |
| perplexity-comet | Perplexity Comet | lien officiel HTTP 403; capture absente |
| poe | Poe | lien officiel HTTP 403; capture absente |
| power-bi | Microsoft Power BI | lien officiel HTTP 403 |
| quillbot | QuillBot | lien officiel HTTP 403 |
| quizlet | Quizlet | lien officiel HTTP 403; capture absente |
| readwise-reader | Readwise Reader | capture absente |
| retell-ai | Retell AI | capture absente |
| spellbook | Spellbook | capture absente |
| tensor-art | Tensor.Art | lien officiel HTTP 403; capture absente |
| webflow | Webflow | capture absente |

## Notes

AlphaCode a été passé en inactif après le contrôle : `https://alphacode.deepmind.com/` échoue au handshake SSL. Aucune URL officielle de remplacement n'a été inventée.

Les HTTP 403 viennent d'un blocage du client HTTP. Ces fiches restent actives.

Les captures absentes sont des visites qui ont fini en captcha, page vide ou erreur, après une seconde tentative. Le visuel de repli (plaque logo) n'est pas publié.

Anything (7 Ko) et DeepSeek (12 Ko) sont de vraies homepages. Une seconde capture, encodée en WebP qualité maximale, reste sous 15 Ko parce que la page est très simple. AutoRegex, ClipDrop Relight et Perplexity gardent une capture précédente sous 15 Ko : la nouvelle visite a été bloquée par un captcha.

Mem répond, mais le texte récupéré ne recoupe ni le nom ni la description de la fiche.
