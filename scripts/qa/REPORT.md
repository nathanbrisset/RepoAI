# Contrôle des fiches actives

Généré le 2026-10-21.

| Compteur | Nombre |
| --- | ---: |
| Fiches actives contrôlées | 465 |
| Conformes | 458 |
| Encore en échec | 7 |
| Corrections appliquées pendant ce passage | 0 |

## Échecs restants par raison

- 1 × capture suspecte (13624 octets, sous 15 Ko)
- 4 × capture absente
- 1 × capture suspecte (10500 octets, sous 15 Ko)
- 1 × capture suspecte (8490 octets, sous 15 Ko)

## Fiches non corrigées

| id | nom | raison |
| --- | --- | --- |
| autoregex | AutoRegex | capture suspecte (13624 octets, sous 15 Ko) |
| brainly | Brainly | capture absente |
| chatcode | ChatCode | capture suspecte (10500 octets, sous 15 Ko) |
| perplexity-ai | Perplexity | capture suspecte (8490 octets, sous 15 Ko) |
| perplexity-comet | Perplexity Comet | capture absente |
| quizlet | Quizlet | capture absente |
| tensor-art | Tensor.Art | capture absente |

## Notes

Le compteur « Encore en échec » est 7, égal aux 7 lignes du tableau. DeepSeek n'y est plus : la capture reprise de `edab3013` fait 21 682 octets.

Perplexity et Perplexity Comet ont leur champ `image` sur les PNG de ce commit (`/tool-screenshots/perplexity-ai.png`, `/tool-screenshots/perplexity-comet.png`). Ce contrôle lit encore `public/screenshots/<id>.webp` : le WebP Perplexity reste à 8 490 octets, et Comet n'a pas de WebP à cet emplacement.
