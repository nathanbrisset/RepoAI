# Contrôle des fiches actives

Généré le 2026-10-21.

| Compteur | Nombre |
| --- | ---: |
| Fiches actives contrôlées | 465 |
| Conformes | 457 |
| Encore en échec | 8 |
| Corrections appliquées pendant ce passage | 0 |

## Échecs restants par raison

- 1 × capture suspecte (13624 octets, sous 15 Ko)
- 4 × capture absente
- 1 × capture suspecte (10500 octets, sous 15 Ko)
- 1 × capture suspecte (11904 octets, sous 15 Ko)
- 1 × capture suspecte (8490 octets, sous 15 Ko)

## Fiches non corrigées

| id | nom | raison |
| --- | --- | --- |
| autoregex | AutoRegex | capture suspecte (13624 octets, sous 15 Ko) |
| brainly | Brainly | capture absente |
| chatcode | ChatCode | capture suspecte (10500 octets, sous 15 Ko) |
| deepseek | DeepSeek | capture suspecte (11904 octets, sous 15 Ko) |
| perplexity-ai | Perplexity | capture suspecte (8490 octets, sous 15 Ko) |
| perplexity-comet | Perplexity Comet | capture absente |
| quizlet | Quizlet | capture absente |
| tensor-art | Tensor.Art | capture absente |

## Notes

Le compteur « Encore en échec » est 8, égal aux 8 lignes du tableau. Les HTTP 403 du client de contrôle ne sont pas comptés.

- Brainly, Quizlet, Tensor.Art, Perplexity Comet : Chrome fenêtré et pages officielles alternatives. Cloudflare ou un captcha répond, sans image officielle publiable. Le miroir joignable de Comet est un logo et une liste d'attente.
- AutoRegex (13 624 o), ChatCode (10 500 o), DeepSeek (11 904 o), Perplexity (8 490 o) : homepage officielle réelle. Une seconde capture reste sous 15 Ko. L'image sociale de DeepSeek est un logo et n'est pas utilisée.

Anything est la page tarifaire officielle, pas une page vide. Gauth est la homepage après masquage de la fenêtre d'abonnement. Mem reste actif : `https://get.mem.ai/` est le site public du produit (notes, réunions). `https://mem.ai/` est l'application, qui demande une connexion.
