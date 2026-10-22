# Contrôle des fiches actives

Généré le 2026-10-22.

| Compteur | Nombre |
| --- | ---: |
| Fiches actives contrôlées | 465 |
| Conformes | 461 |
| Encore en échec | 4 |
| Corrections appliquées pendant ce passage | 0 |

## Échecs restants par raison

- 1 × capture suspecte (13624 octets, sous 15 Ko)
- 1 × capture suspecte (10500 octets, sous 15 Ko)
- 1 × capture suspecte (8490 octets, sous 15 Ko)
- 1 × capture absente

## Fiches non corrigées

| id | nom | raison |
| --- | --- | --- |
| autoregex | AutoRegex | capture suspecte (13624 octets, sous 15 Ko) |
| chatcode | ChatCode | capture suspecte (10500 octets, sous 15 Ko) |
| perplexity-ai | Perplexity | capture suspecte (8490 octets, sous 15 Ko) |
| perplexity-comet | Perplexity Comet | capture absente |

## Notes

Le compteur « Encore en échec » est 4, égal aux 4 lignes du tableau. Brainly, Quizlet et Tensor.Art ont maintenant une capture 1280×800 issue des fichiers `shots/`.

Perplexity et Perplexity Comet pointent vers les PNG de `edab3013`. Ce contrôle lit encore `public/screenshots/<id>.webp`.
