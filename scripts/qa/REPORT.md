# Contrôle des fiches actives

Généré le 2026-10-22.

| Compteur | Nombre |
| --- | ---: |
| Fiches actives contrôlées | 465 |
| Conformes | 465 |
| Encore en échec | 0 |
| Corrections appliquées pendant ce passage | 0 |

## Échecs restants par raison

Aucun.

## Fiches non corrigées

| id | nom | raison |
| --- | --- | --- |
| — | — | — |

## Notes

Le contrôle lit le fichier nommé par le champ `image` de chaque fiche, résolu sous `public/`. Le seuil de 15 Ko n'est pas abaissé.

Exceptions documentées (homepage réelle peu chargée ; une seconde capture au maximum de la qualité WebP reste sous 15 Ko ; aucun pixel n'est ajouté) : autoregex, chatcode. Seul le contrôle de taille est ignoré pour ces identifiants. Une capture absente, illisible, vide ou en aplat échoue quand même.
