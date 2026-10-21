# Contrôle des fiches actives

Généré le 2026-10-21.

| Compteur | Nombre |
| --- | ---: |
| Fiches actives contrôlées | 468 |
| Conformes | 460 |
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

Les HTTP 403 du client de contrôle ne sont pas un échec. Ces fiches restent actives quand la capture est valable.

Mem : `https://mem.ai/` est l'application et affiche une page de connexion aux visiteurs anonymes. Le site public du même produit est `https://get.mem.ai/` (la page tarifaire de la fiche y pointait déjà). L'URL de visite et le lien How To Use pointent maintenant vers `https://get.mem.ai/`, avec une capture de cette page.

Les huit échecs restants :

- Brainly, Quizlet, Tensor.Art, Perplexity Comet : Chrome fenêtré, pages officielles alternatives (`/subjects`, `/features`, `/explore` quand elle existe) et lecture du HTML. Cloudflare ou un captcha répond, sans `og:image`. Le seul miroir joignable de Comet (`comet-framer-prod.perplexity.ai`) est un logo et une liste d'attente, non publié.
- AutoRegex (13 624 o), ChatCode (10 500 o), DeepSeek (11 904 o), Perplexity (8 490 o) : la page officielle est réelle et simple. Une seconde capture, ou un encodage WebP en qualité maximale, reste sous 15 Ko. L'image sociale de DeepSeek est un logo, elle n'a pas remplacé la homepage. Les nouvelles visites d'AutoRegex et de Perplexity ont été arrêtées par un captcha, donc la capture réelle précédente est conservée.

DeepBrain conserve `https://docs.deepbrain.io` : c'est la documentation officielle du produit, à côté de `https://www.aistudios.com/`.

AlphaCode reste inactif : `https://alphacode.deepmind.com/` échoue au handshake SSL. Aucune URL de remplacement n'a été inventée.
