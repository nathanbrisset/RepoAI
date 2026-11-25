# Lot du 25 novembre 2026 — 24 outils publiables (sur 25)

- logos/{slug}.png 128×128 -> public/logos/{id}.png
- screenshots/{slug}.webp 1440×900 (≥15 Ko) -> public/screenshots/{id}.webp — recadrage 1,6:1 depuis les PNG 1920×1072, qualité 80. Recadrage centre pour 23 outils ; recadrage calé à gauche pour **dippr** (retire la bulle de chat en bas à droite, le cube 3D du hero reste entier)
- lot-24.csv : 24 lignes publiables ; `category` = catégories publiques (25, taxonomy `/tmp/r3n-1125/content/taxonomy.json`, identique au jeu public) ; short_description (EN) et short_description_fr remplis (textes de copy-24.json, tutoiement, sans $ ni £) ; `features` = points clés EN sans montants en devise étrangère ; colonne `howTo` vidée (remplacée par copy-24.json) ; long_description vide ; `hqCountry` rempli uniquement pour les 6 sièges confirmés par une source officielle (Chat with Work Germany, Hydrilla India, Toone Portugal, Teaflask United States, frwrd.to Austria, Incredible Sweden). AlterContacts reste vide (demande PM : Singapour non confirmé). Les autres restent vides.
- copy-24.json : 24 publiables + 1 hold (Glassmail, `publishable=false`) ; pricing_fr / pricing_en en € uniquement (affichage site), howTo_en / howTo_fr (tutoiement), features_en / features_fr, short_en / short_fr, category, official_url / official_url_final ; pricing_usd_official = montant officiel en $ ou note officielle (vérif, NE PAS afficher)
- features-fr-24.json / features-en-24.json (24 publiables seulement)
- fx-notes.md : taux BCE du 24/11/2026, 1 € = 1,0963 $ et 1 € = 0,83700 £
- md5.json (logos + screenshots des 24 publiables)

## Hold

**Glassmail** (`glassmail`) : `publishable=false`. Revérifié le 25 nov. 2026 sur glassmail.app : l’accueil affiche encore « Launch price $29 once. The price goes up as people buy » / « Early price · Next 50 buyers ». La page publique mélange aussi un brouillon de grille. Ce n’est pas un prix de liste stable. Demande PM : en cas de doute, hold. Aucun montant affiché. Pas de logo ni de capture dans ce livrable (fichiers conservés dans `_work`). Pas de remplacement depuis la réserve (TestSprite, Agenda Hero, SparrowDesk, Webless, OpenVorld) : le hold est un doute sur le prix, pas un outil mort.

## Promos (jamais affichées comme prix normal)

Motionflare (Black Friday −50 % le 1er mois Pro/Max jusqu’au 1er déc.), Granular.Build (−50 % sur Pro), Toone (−80 % sur Lifetime), Clam AI (première année à tarif réduit si souscription annuelle avant fin 2026), DeskMagic (−40 % sur Pro jusqu’au 1er déc., trouvée sur la page officielle en plus de la liste Chercheur). Glassmail : hold, voir ci-dessus.

## Produits relancés, conservés (demande PM)

Modem (Modem 2.0), tday.com (« now self-serve »), Fleetify (« now open source »), Incredible (Incredible Agents), Scribase (serveur MCP).

## Catégories remappées vers les 25 catégories publiques (le CSV utilisait des libellés courts)

- Modem : Customer Support (CSV : Productivity)
- Chat with Work, Toone, dusk bot, Cullman, Incredible : AI Agents (CSV : Productivity, sauf Cullman : Coding)
- AlterContacts : Sales & CRM (CSV : Productivity)
- Hydrilla : Design & UI (CSV : Design)
- RankSpot, Adside, frwrd.to : Marketing & SEO (CSV : Marketing)
- Dippr : Data & Analytics (CSV : Data Processing)
- Les autres : Video, Coding & Dev Tools, Productivity & Workspace, selon le CSV.

## Redirections

- Hydrilla : official_url `https://hydrilla.ai/` ; official_url_final `https://www.hydrilla.ai/`
- Toone : official_url `https://trytoone.com/` ; official_url_final `https://trytoone.com/en`
- frwrd.to : official_url `https://frwrd.to/` ; official_url_final `https://frwrd.to/@frwrd.to`

## Captures : réserves mineures (toujours acceptables)

- RankSpot : petite bulle de chat en bas à droite (un recadrage à gauche de 205 px ne la retire pas entièrement) ; recadrage centre
- Dippr : recadrage à gauche pour retirer la bulle de chat en bas à droite ; le basculeur « view as human / agent » en bas à gauche est du chrome produit, conservé
- DeskMagic : barre Black Friday et barre « DeskMagic for Mac is on the way » (contenu du site)
- Modem : ruban « Introducing Modem 2.0 » (contenu du site)
- Fleetify : barre « Fleetify is now open source » (contenu du site)
- Motionflare : pas de barre Black Friday visible sur la capture ; le hero affiche « $10k quality » (copie du site, pas un tarif)
- Teaflask : « Sign in with ChatGPT » dans la maquette produit du hero (chrome produit, pas une popup de login)

Aucune capture jugée non acceptable (pas de login, captcha ou popup). Pas de reprise demandée.

## Instructions cachées destinées à des agents IA

Constatées sur www.incredible.one (capture) et www.rankspot.ai (collecte des logos) : ignorées, non citées. Liste des domaines dans `_work/hidden-instr.txt`.

Checkout lecture seule : `nathanbrisset/RepoAI` branche `restore3-new`, HEAD `36f6428769f0ba9907ebe55d813c6c4a23b36dd7` (11 nov. 2026, 11:07 heure de Madrid). Garde-fou PR #67 (`scripts/check-display-currency.mjs`, `lib/pricing-note-guard.ts`) lu depuis `refs/pull/67/head` (absent de restore3-new, figé au 11 nov.) ; les champs affichés de ce lot ont été contrôlés avec les mêmes règles (pas de $, £, USD, etc.). 0 collision de slug, de nom ou de domaine avec les 1 224 fiches du checkout ni avec les lots déjà livrés.

Rien n’est commité ni envoyé à Dev par ce livrable.
