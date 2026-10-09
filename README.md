# Bloc Sahel — site vitrine

Site statique, sans build. HTML + CSS + JS vanilla.

## Lancer en local
    python3 -m http.server 8000     # puis http://localhost:8000

## Structure
    index.html        structure et textes de la page (SEO : tout le contenu est dans le HTML)
    css/style.css     tokens de couleur/typo en tête de fichier (:root)
    js/content.js     numéros, liste de produits, messages WhatsApp (à modifier ici)
    js/main.js        logique : formulaire -> lien wa.me, boutons "Devis", copie des numéros
    img/              logo et photos

## Déploiement
Cloudflare Pages / Netlify / GitHub Pages : publier le dossier tel quel, aucune commande de build.

## À faire (voir le cahier des charges)
Photos réelles, prix (SB-03), livraison, horaires, liens TikTok/Facebook, domaine, version arabe (RTL).
