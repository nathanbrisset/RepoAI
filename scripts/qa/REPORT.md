# Contrôle des fiches actives

Généré le 2026-10-29.

| Compteur | Nombre |
| --- | ---: |
| Fiches actives contrôlées | 703 |
| Conformes | 676 |
| Encore en échec | 27 |
| Corrections appliquées pendant ce passage | 0 |

## Échecs restants par raison

- 1 × capture suspecte (5630 octets, sous 15 Ko)
- 1 × capture suspecte (4120 octets, sous 15 Ko)
- 1 × capture suspecte (3700 octets, sous 15 Ko)
- 6 × le texte de la page officielle ne recoupe ni le nom ni la description
- 5 × How To Use absent ou pas cohérent avec la description
- 1 × capture suspecte (4928 octets, sous 15 Ko)
- 1 × lien How To Use hors domaine officiel ((url)
- 5 × lien officiel HTTP
- 1 × capture suspecte (5874 octets, sous 15 Ko)
- 1 × capture suspecte (5294 octets, sous 15 Ko)
- 1 × capture suspecte (4364 octets, sous 15 Ko)
- 1 × capture suspecte (3626 octets, sous 15 Ko)
- 1 × capture suspecte (5078 octets, sous 15 Ko)
- 1 × capture suspecte (5156 octets, sous 15 Ko)
- 1 × lien officiel injoignable (fetch failed)
- 1 × capture suspecte (5286 octets, sous 15 Ko)
- 1 × capture suspecte (4808 octets, sous 15 Ko)
- 1 × capture suspecte (4048 octets, sous 15 Ko)
- 1 × capture suspecte (4362 octets, sous 15 Ko)

## Fiches non corrigées

| id | nom | raison |
| --- | --- | --- |
| chatgpt-atlas | ChatGPT Atlas | capture suspecte (5630 octets, sous 15 Ko) |
| civitai | Civitai | capture suspecte (4120 octets, sous 15 Ko) |
| clio | Clio | capture suspecte (3700 octets, sous 15 Ko) |
| codeassist | CodeAssist | le texte de la page officielle ne recoupe ni le nom ni la description |
| codetree | Codetree | le texte de la page officielle ne recoupe ni le nom ni la description |
| copyleaks | Copyleaks | How To Use absent ou pas cohérent avec la description |
| doubao | Doubao | le texte de la page officielle ne recoupe ni le nom ni la description; capture suspecte (4928 octets, sous 15 Ko) |
| drift | Salesloft Drift | lien How To Use hors domaine officiel (https://www.drift.com) |
| dust | Dust | How To Use absent ou pas cohérent avec la description |
| freepik-ai | Freepik AI | le texte de la page officielle ne recoupe ni le nom ni la description |
| freshdesk-freddy | Freshdesk Freddy | lien officiel HTTP 404; capture suspecte (5874 octets, sous 15 Ko) |
| gptzero | GPTZero | How To Use absent ou pas cohérent avec la description |
| hugging-face-transformers | Hugging Face Transformers | lien officiel HTTP 404 |
| hunyuan-video | Hunyuan Video (Tencent) | le texte de la page officielle ne recoupe ni le nom ni la description |
| jenni-ai | Jenni AI | capture suspecte (5294 octets, sous 15 Ko) |
| lavender | Lavender | capture suspecte (4364 octets, sous 15 Ko) |
| liner | Liner | lien officiel HTTP 410; capture suspecte (3626 octets, sous 15 Ko) |
| lovo | LOVO | lien officiel HTTP 402 |
| magnific | Magnific AI | capture suspecte (5078 octets, sous 15 Ko) |
| opera-aria | Opera Aria | lien officiel HTTP 404; capture suspecte (5156 octets, sous 15 Ko) |
| publer | Publer | lien officiel injoignable (fetch failed) |
| scispace | SciSpace | le texte de la page officielle ne recoupe ni le nom ni la description |
| sora | Sora | How To Use absent ou pas cohérent avec la description; capture suspecte (5286 octets, sous 15 Ko) |
| turboscribe | TurboScribe | capture suspecte (4808 octets, sous 15 Ko) |
| wan | Wan | capture suspecte (4048 octets, sous 15 Ko) |
| winston-ai | Winston AI | How To Use absent ou pas cohérent avec la description |
| zerogpt | ZeroGPT | capture suspecte (4362 octets, sous 15 Ko) |

## Notes

Le contrôle lit le fichier nommé par le champ `image` de chaque fiche, résolu sous `public/`. Le seuil de 15 Ko n'est pas abaissé.

Exceptions documentées (homepage réelle peu chargée ; une seconde capture au maximum de la qualité WebP reste sous 15 Ko ; aucun pixel n'est ajouté) : albertai, autodraw, chatcode, grok, kimi, lovable, luma_ai, manus, mutiny, notebooklm. Seul le contrôle de taille est ignoré pour ces identifiants. Une capture absente, illisible, vide ou en aplat échoue quand même.
