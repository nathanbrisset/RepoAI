# Conversion des prix — lot du 25 novembre 2026, 24 outils publiables (1 hold)

- **Source:** ECB eurofxref-daily (https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml)
- **Date du taux:** 2026-11-24 (dernier jour ouvrable avant le 25 novembre 2026 ; le taux du 25 n’était pas encore le taux de référence du jour au moment de la livraison, le matin heure de Madrid / Europe/Madrid, UTC+1)
- **Taux USD:** 1 EUR = 1,0963 USD  (donc 1 USD = 0.912158 EUR)
- **Taux GBP:** 1 EUR = 0,83700 GBP  (donc 1 GBP = 1.194743 EUR) — aucun prix GBP à convertir dans ce lot.
- **Récupéré:** 2026-11-25 au matin, Europe/Madrid.
- **Arrondi:** à l’euro le plus proche, 0,5 arrondi au-dessus (`ROUND_HALF_UP`), uniquement pour les montants convertis depuis l’USD.
- Les champs affichés (`pricing_en`, `pricing_fr`, `short_*`, `features_*`, `howTo_*`, et les colonnes visibles du CSV) n’ont que des euros, sans $, £, USD, GBP ni « ≈ ». Le montant officiel dans la devise d’origine est dans `pricing_usd_official` (référence, NE PAS afficher ; l’import Dev le refuse dans content/tools).
- Les prix déjà publiés en euros sont repris tels quels, sans conversion : Chat with Work, Toone, frwrd.to.
- Les micro-montants USD qui arrondiraient à 0 € restent seulement dans `pricing_usd_official` (RankSpot, Manufact, Tabstack, Cullman, Dippr).

## Table de conversion USD (montants utilisés dans ce lot)

| USD officiel | EUR exact (USD ÷ 1,0963) | EUR affiché | Usage |
|---:|---:|---:|---|
| 0 $ | 0.0000 € | 0 € | Offres gratuites (Modem, tday, Hydrilla, AlterContacts, Teaflask, Manufact, dusk bot, Fleetify, Dippr Community, DeskMagic) |
| 1 $ | 0.9122 € | 1 € | Modem, overage / 1 000 events ; RankSpot, crédit de bienvenue une fois |
| 2,99 $ | 2.7274 € | 3 € | Clam, Starter / mois |
| 3 $ | 2.7365 € | 3 € | Hydrilla Hourly ; RankSpot, un article |
| 5 $ | 4.5608 € | 5 € | Hydrilla Starter ; Modem overage / 1 000 crédits ; Manufact crédits Free / mois ; Scribase Hobby / projet / mois |
| 6,99 $ | 6.3760 € | 6 € | Clam, Pro / mois |
| 7,99 $ | 7.2882 € | 7 € | Juncts, Starter / mois |
| 8 $ | 7.2973 € | 7 € | Hydrilla Hourly Pro ; Cullman, ligne d’évaluation en plus |
| 10 $ | 9.1216 € | 9 € | RankSpot, recharge dès ; Tabstack Starter / mois ; Manufact pay as you go inclus |
| 12 $ | 10.9459 € | 11 € | Hydrilla Pro (API) ; dusk bot, licence Pro seule / mois |
| 12,99 $ | 11.8489 € | 12 € | Granular Pro / mois |
| 14,50 $ | 13.2263 € | 13 € | Motionflare, promo 1er mois Pro (pas le prix de liste) |
| 15 $ | 13.6824 € | 14 € | Motionflare, pack 40 crédits ; AlterContacts Starter / mois |
| 19,99 $ | 18.2341 € | 18 € | Juncts, Pro / mois |
| 20 $ | 18.2432 € | 18 € | dusk bot Plus / mois ; Granular modèles hébergés palier 1 / mois ; dusk bot + membre équipe |
| 25 $ | 22.8040 € | 23 € | Incredible Starter / siège / mois ; Cullman crédits offerts ; Scribase Pro / projet / mois |
| 29 $ | 26.4526 € | 26 € | Motionflare Pro / mois ; DeskMagic Pro à vie (prix de liste) |
| 29,90 $ | 27.2736 € | 27 € | Clam, promo 1re année Starter (pas le prix de liste) |
| 30 $ | 27.3646 € | 27 € | dusk bot, licence équipe / mois |
| 39 $ | 35.5742 € | 36 € | tday Pro / mois |
| 49 $ | 44.6958 € | 45 € | AlterContacts Pro / mois |
| 49,50 $ | 45.1519 € | 45 € | Motionflare, promo 1er mois Max (pas le prix de liste) |
| 50 $ | 45.6080 € | 46 € | dusk bot Pro / mois ; Incredible Pro / siège / mois ; Granular modèles hébergés palier 2 / mois |
| 69,90 $ | 63.7599 € | 64 € | Clam, promo 1re année Pro (pas le prix de liste) |
| 80 $ | 72.9727 € | 73 € | Modem Startup / mois |
| 99 $ | 90.3037 € | 90 € | Motionflare Max / mois ; AlterContacts Power / mois ; Tabstack Team / mois |
| 100 $ | 91.2159 € | 91 € | Adside, crédits créa / mois inclus ; Granular modèles hébergés palier 3 / mois |
| 129 $ | 117.6685 € | 118 € | Granular Pro / an (tarif annuel officiel) |
| 149 $ | 135.9117 € | 136 € | tday Growth / mois |
| 150 $ | 136.8239 € | 137 € | Dippr Team / mois |
| 179 $ | 163.2765 € | 163 € | Incredible Max / siège / mois |
| 199 $ | 181.5197 € | 182 € | AlterContacts Power Plus / mois ; Scribase Studio / mois |
| 250 $ | 228.0398 € | 228 € | Modem Scale / mois ; Manufact Pro / mois |
| 259 $ | 236.2492 € | 236 € | Granular Pro à vie |
| 490 $ | 446.9579 € | 447 € | Adside AI Agency / mois en prépaiement annuel |
| 499 $ | 455.1674 € | 455 € | Tabstack Pro / mois |
| 500 $ | 456.0795 € | 456 € | Incredible Ultra / siège / mois |
| 950 $ | 866.5511 € | 867 € | Motionflare Ultra / mois |
| 990 $ | 903.0375 € | 903 € | Adside AI Agency / marque / mois |
| 2 500 $ | 2280.3977 € | 2 280 € | Adside Managed, départ / mois |
| 3 000 $ | 2736.4772 € | 2 736 € | Manufact Pro / an (tarif annuel officiel) |
| 6 000 $ | 5472.9545 € | 5 473 € | Dippr Enterprise, départ / an |

Les micro-montants non affichés (détail seulement dans `pricing_usd_official`) : RankSpot check de visibilité IA 0,004 $ ; Manufact usage 0,10 $ / 1 000 appels ; Tabstack overage 0,30 $ ou 0,25 $ / 1 000 crédits ; Cullman production 0,06 $/min, simulation voix 0,25 $/min, simulation texte 0,025 $/réponse ; Dippr crédit supplémentaire 0,40 $ (0,32 $ en Enterprise).

## Outils par devise officielle

- **Déjà en euros (affichage = tarif officiel, pas de conversion) :** Chat with Work (Personal TTC, Team HT, ×10 par an officiel pour Personal), Toone (TVA incluse : 9,99 € / 79,99 € / 199,99 €), frwrd.to (0 € et 5 €/mois HT).
- **Convertis depuis l’USD au taux du 24/11/2026 :** Motionflare, Modem, Clam AI, Granular.Build, tday.com, Hydrilla, AlterContacts, RankSpot, Adside, Teaflask, Manufact, Tabstack, dusk bot, Fleetify, Juncts, Cullman, Dippr, DeskMagic, Scribase, Incredible.
- **Aucun montant à convertir :** tensorViz (gratuit, MIT).
- **Hold, non converti pour l’affichage :** Glassmail (prix de lancement 29 $ qui « increases as people buy », instable).

## Promotions (jamais affichées comme prix de liste)

- Motionflare : Black Friday −50 % le 1er mois de Pro/Max jusqu’au 1er déc. 2026 (13 € puis 26 €/mois, ou 45 € puis 90 €/mois).
- Granular.Build : Black Friday −50 % sur Pro ; le montant réduit n’a pas été isolé comme tarif de liste séparé, donc non inventé, seulement labellisé.
- Toone : Black Friday −80 % sur Lifetime, vu sur la page d’accueil ; le montant réduit n’a pas été isolé comme tarif de liste séparé, donc non inventé.
- Clam AI : première année 27 € / 64 € (deux mois offerts) si souscription annuelle avant fin 2026 — promo, pas le prix de liste.
- Glassmail : prix de lancement instable → hold, pas de montant affiché.
- DeskMagic (trouvée sur la page officielle, en plus de la liste Chercheur) : Black Friday −40 % sur Pro jusqu’au 1er déc. 2026, barre du site ; montant réduit non isolé, non inventé. Le prix de liste reste 26 € à vie.
