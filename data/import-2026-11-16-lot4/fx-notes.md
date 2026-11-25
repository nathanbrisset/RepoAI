# Conversion des prix — lot 4, 8 outils (16 novembre 2026)

- **Source:** ECB eurofxref-daily (https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml)
- **Date du taux:** 2026-11-13
- **Taux USD:** 1 EUR = 1,1052 USD  (donc 1 USD = 0.904814 EUR)
- **Taux GBP:** 1 EUR = 0,83559 GBP  (donc 1 GBP = 1.196759 EUR) — aucun prix GBP à convertir dans ce lot.
- **Récupéré:** 2026-11-16 en fin de matinée, Europe/Madrid. Le taux du lundi 16 novembre n’était pas encore publié (la BCE le diffuse en général vers 16:00 CET) ; le dernier taux de référence est celui du vendredi 13 novembre 2026, le même que pour les lots 1, 2 et 3 du jour.
- **Arrondi:** à l’euro le plus proche, 0,5 arrondi au-dessus (`ROUND_HALF_UP`), uniquement pour les montants convertis depuis l’USD.
- Les champs `pricing_en` et `pricing_fr` n’affichent que des euros, sans $, £, USD, GBP ni « ≈ ». Le montant officiel dans la devise d’origine est dans `pricing_usd_official`.
- Aucun outil de ce lot n’affiche un tarif officiel déjà en euros : les 8 grilles publiques isolées sont en USD. La page allemande AMBOSS pour les médecins existe en euros, mais sa grille n’a pas été isolée proprement et n’est pas utilisée (demande PM : convertir les prix USD officiels).
- Les micro-montants USD qui arrondiraient à 0 €, ou qui seraient trompeurs une fois arrondis (crédits Wren à 0,10 $, overages Algolia à 0,60 $ / 0,80 $, tarifs à l’unité d’AI or Not), restent seulement dans `pricing_usd_official`.

## Table de conversion USD (montants utilisés dans ce lot)

| USD officiel | EUR exact (USD ÷ 1,1052) | EUR affiché | Usage |
|---:|---:|---:|---|
| 0 $ | 0.0000 € | 0 € | Plans gratuits (GitGuardian, Algolia, Count, UX Pilot, BigML, crédits de départ) |
| 0,10 $ | 0.0905 € | 0 € | Wren AI, crédit additionnel — non affiché |
| 0,60 $ | 0.5429 € | 1 € | Algolia, overage recommandations / 1 000 — non affiché |
| 0,80 $ | 0.7239 € | 1 € | Algolia, overage crawler / 1 000 — non affiché |
| 5 $ | 4.5241 € | 5 € | AI or Not, crédits de départ Free et Pro mensuel |
| 10 $ | 9.0481 € | 9 € | AI or Not, crédits inclus Pro / mois |
| 12,50 $ | 11.3102 € | 11 € | AMBOSS, Yearly Membership étudiant / mois facturé à l’année |
| 19,99 $ | 18.0872 € | 18 € | AMBOSS, Monthly Membership / Access étudiant |
| 21,58 $ | 19.5259 € | 20 € | AMBOSS, Yearly Access praticien / mois facturé à l’année |
| 22 $ | 19.9059 € | 20 € | UX Pilot, Pro / mois |
| 29,99 $ | 27.1354 € | 27 € | AMBOSS, Monthly Access praticien |
| 30 $ | 27.1444 € | 27 € | BigML, départ officiel des abonnements / mois |
| 31 $ | 28.0492 € | 28 € | UX Pilot, Teams / utilisateur / mois |
| 49 $ | 44.3359 € | 44 € | Count, Pro / éditeur / mois |
| 50 $ | 45.2407 € | 45 € | AI or Not, Pro / an |
| 100 $ | 90.4814 € | 90 € | AI or Not, Business / mois et crédits Business |
| 149 $ | 134.8172 € | 135 € | AMBOSS, renouvellement annuel du bundle Qbank |
| 179 $ | 161.9616 € | 162 € | Wren AI, Essential Cloud / mois facturé à l’année |
| 259 $ | 234.3467 € | 234 € | Wren AI, Essential Cloud mois par mois |
| 448 $ | 405.3565 € | 405 € | AMBOSS, Yearly Membership + Qbank Bundle / an |
| 559 $ | 505.7908 € | 506 € | Wren AI, Enterprise Cloud / mois facturé à l’année |
| 799 $ | 722.9461 € | 723 € | Wren AI, Enterprise Cloud mois par mois |
| 1 000 $ | 904.8136 € | 905 € | AI or Not, Business / an ; BigML Lite / mois |
| 1 199 $ | 1084.8715 € | 1 085 € | AMBOSS, Student Life |
| 5 000 $ | 4524.0680 € | 4 524 € | AI or Not, plafond revendeur Business / mois |
| 10 000 $ | 9048.1361 € | 9 048 € | BigML Lite / an et setup Bronze Enterprise |
| 45 000 $ | 40716.6124 € | 40 717 € | BigML Bronze Enterprise / an |

Les tarifs à l’unité d’AI or Not (0,005 $ / 0,01 $ / 0,015 $ / 0,02 $) arrondiraient tous à 0 € : non convertis pour l’affichage, détail seulement dans `pricing_usd_official`. Extra Support BigML (3 000 $/mois) et les formations / certifications de la même page restent également dans les notes officielles.

## Outils par devise officielle

- **8 / 8 outils** avec au moins un montant USD converti : GitGuardian, Algolia, Count, Wren AI, AI or Not, UX Pilot, BigML, AMBOSS.
- **0 outil** déjà tarifé en euros pour l’affichage.
- **GitGuardian** : seul le Starter 0 $ a un prix de liste public ; les offres payantes sont sur devis, sans montant inventé.
- **Algolia** : Grow / Grow Plus « Starting at 0 $/month » affichés à 0 €/mois. Les overages recommandations et crawler restent dans les notes officielles. L’overage des requêtes de recherche n’a pas été isolé comme prix de liste public.
- **Count** : seul le 49 $ / éditeur / mois est converti (44 €). Pas de total annuel inventé.
- **Wren AI** : les quatre tarifs cloud publics (179 / 259 / 559 / 799 $) sont convertis. Le 0,10 $ par crédit additionnel n’est pas affiché.
- **AMBOSS** : uniquement les prix USD des pages US / International, convertis. La grille allemande en euros n’est pas utilisée.
- **UX Pilot** : uniquement les prix structurés de `/plans` (0 / 22 / 31 $), convertis. Pas de prix annuel inventé.
