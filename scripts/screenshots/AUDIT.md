# Audit des images avant recapture

Périmètre : fiches `content/tools/*.json` dont `status` n'est pas `sunset` (290 actives + 16 renommées = 306). Les 26 fiches sunset sont hors périmètre.

| Constat | Nombre |
| --- | ---: |
| Champ `image` vide | 46 |
| Fichier local manquant (404 du fichier) | 0 |
| Même chemin d'image pour plusieurs fiches | 0 |
| Même hash SHA-256 pour plusieurs fiches | 0 |
| Images quasi identiques (pHash, distance ≤ 6) | 0 |
| Poids des PNG alors référencés | 162 Mio |
| PNG de `public/tool-screenshots` sans aucune fiche | 122 fichiers, 84 Mio |

Les 260 fichiers présents sont des PNG hétérogènes, surtout 1920×1080, plus quelques fenêtres 1741×1010 et 1796×1210. Rien n'est au format 1280×800 ni en WebP.

Échantillons vérifiés à l'œil :

- `albertai` : l'ancien PNG est une page « 404 Page not found » de albert.ai. Le fichier existe, mais le visuel est cassé.
- `growthbar` : l'ancien PNG montre la page d'accueil SEOptimer, pas GrowthBar. L'URL officielle de la fiche est `https://www.seoptimer.com/growthbar/`.
- `chatgpt` et `perplexity-ai` : captures très sombres (environ 91 % et 86 % d'une seule couleur sur un aperçu réduit), peu lisibles comme vignette.
- `descript`, `zapier`, `sendinblue` (Brevo), `vidyoai` (quso.ai) : captures du site officiel, parfois déjà redirigé vers le successeur.

Il n'y a pas de visuel générique partagé entre plusieurs outils. Le problème principal est l'absence d'image (46 fiches) et, pour le stock existant, des PNG lourds dont certains ne montrent pas le produit (404, autre marque, interface quasi vide).
