# Contrôle des fiches actives

Généré le 2026-10-22.

| Compteur | Nombre |
| --- | ---: |
| Fiches actives contrôlées | 465 |
| Conformes | 464 |
| Encore en échec | 1 |
| Corrections appliquées pendant ce passage | 0 |

## Échecs restants par raison

- 1 × lien officiel HTTP

## Fiches non corrigées

| id | nom | raison |
| --- | --- | --- |
| clipchamp | Clipchamp | lien officiel HTTP 502 |

## Notes

Le contrôle lit le fichier nommé par le champ `image` de chaque fiche, résolu sous `public/`. Le seuil de 15 Ko n'est pas abaissé.

Exceptions documentées (homepage réelle peu chargée ; une seconde capture au maximum de la qualité WebP reste sous 15 Ko ; aucun pixel n'est ajouté) : albertai, autodraw, chatcode, grok, kimi, lovable, luma_ai, manus, mutiny, notebooklm. Seul le contrôle de taille est ignoré pour ces identifiants. Une capture absente, illisible, vide ou en aplat échoue quand même.

Clipchamp reste le seul échec : `https://clipchamp.com/en/` répond HTTP 502 à curl et au client de contrôle. La fiche reste active. Ce n'est ni un 404, ni un échec TLS, ni une page de parking. Un HTTP 429 du client de contrôle est traité comme un 403 : il ne fait pas échouer la fiche.
