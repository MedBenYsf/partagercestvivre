# Site de l'association Partager C'est Vivre

Site statique (HTML / CSS / JS, sans framework ni build) pour l'association.
Contenu basé sur le dossier de sponsoring du Gala 4ème édition (`docs/`).

## Structure

```
index.html              Page d'accueil
qui-sommes-nous.html     Présentation de l'association (histoire, valeurs, chiffres clés)
evenements.html          Événements à venir / passés + offres de sponsoring du Gala 2026
actualites.html          Actualités : réalisations et projets de l'association
contact.html             Coordonnées et formulaire de contact
css/style.css            Styles du site
js/main.js               Menu mobile, affichage des événements/actualités, formulaire de contact
data/events.json         Liste des événements (voir ci-dessous)
data/actualites.json     Liste des actualités (voir ci-dessous)
assets/logo.png          Logo officiel de l'association
assets/gala1.jpg, gala2.jpg, gala3.jpg   Affiches des 3 premières éditions du Gala
docs/                    Dossier de sponsoring source (ne pas publier sur le site public)
```

## Modifier le contenu

- **Textes des pages** : à éditer directement dans les fichiers `.html`.
- **Coordonnées** : dans `contact.html` (adresse, téléphone) et `CONTACT_EMAIL` en haut du fichier `js/main.js`.
- **Logo / couleurs** : `assets/logo.png` et les variables en haut de `css/style.css` (`--color-primary`, `--color-accent`, etc.).

## Ajouter / modifier un événement

Éditer `data/events.json`. Chaque événement est un objet avec ces champs :

```json
{
  "id": "identifiant-unique-sans-espace",
  "title": "Titre de l'événement",
  "date": "2026-10-04",
  "time": "10h00 - 16h00",
  "location": "Lieu de l'événement",
  "description": "Description courte de l'événement",
  "image": "assets/mon-image.jpg",
  "link": "https://www.facebook.com/asso.partager.c.est.vivre",
  "ticketLink": "https://my.weezevent.com/mon-evenement"
}
```

Le site classe automatiquement les événements en "à venir" ou "passés" selon la date du jour. Les champs `image` et `ticketLink` sont optionnels (mettre `null` ou retirer le champ si non applicable) — `ticketLink` affiche un bouton "🎟️ Réserver mes billets" sur la carte de l'événement.

## Ajouter / modifier une actualité

Éditer `data/actualites.json`. Chaque actualité est un objet avec ces champs :

```json
{
  "id": "identifiant-unique-sans-espace",
  "title": "Titre de l'actualité",
  "date": "2026-08-20",
  "excerpt": "Texte de l'actualité",
  "link": "https://www.facebook.com/asso.partager.c.est.vivre"
}
```

Les actualités s'affichent sur `actualites.html`, triées de la plus récente à la plus ancienne.

## Icônes réseaux sociaux dans le menu

Le menu affiche Facebook, Instagram et WhatsApp (`nav-social` dans chaque page `.html`). Le lien WhatsApp pointe vers `https://wa.me/33664002165` (numéro principal) — à mettre à jour dans toutes les pages (nav + footer) si le numéro change. Pour ajouter un autre réseau, dupliquer la ligne `<a>` dans le bloc `nav-social` de chaque page (et dans le footer).

La page `actualites.html` affiche aussi les événements à venir en haut de page (conteneur `#actu-upcoming-events`, alimenté par `data/events.json` via `renderUpcomingEventsInto()` dans `js/main.js`), en plus du fil d'actualités.

## Offres de sponsoring (page Événements)

Le tableau des formules de sponsoring (Officiel / Platinium / Gold / Silver / Solidaire) pour le Gala 2026 est codé en dur dans `evenements.html` (`.sponsor-table`). Pensez à le mettre à jour ou à le retirer une fois l'événement passé.

## Formulaire de contact

Le formulaire ouvre directement la messagerie email du visiteur avec le message pré-rempli (aucune donnée n'est stockée ni envoyée à un serveur, ce qui convient à un site 100% statique). Si vous préférez un vrai envoi silencieux depuis le formulaire, il faudra brancher un service comme [Formspree](https://formspree.io) (gratuit pour un usage associatif basique).

## Tester le site en local

Comme le site charge les fichiers `data/*.json` via `fetch`, il faut le servir via un petit serveur local (le simple double-clic sur `index.html` ne fonctionnera pas à cause des restrictions de sécurité des navigateurs). Depuis le dossier du projet :

```bash
python -m http.server 8000
```

puis ouvrir http://localhost:8000 dans un navigateur.

## Déployer sur GitHub Pages

1. Pousser ce dépôt sur GitHub (s'il ne l'est pas déjà).
2. Dans les paramètres du dépôt GitHub : **Settings > Pages**.
3. Source : sélectionner la branche `main` et le dossier `/ (root)`.
4. Le site sera disponible à l'adresse indiquée par GitHub (généralement `https://<utilisateur>.github.io/<nom-du-depot>/`).

Le dossier `docs/` (dossier de sponsoring original, avec des informations bancaires/administratives) est volontairement exclu de ce dépôt via `.gitignore` — voir note de sécurité ci-dessous.

## Domaine personnalisé (partagercestvivre.com)

Le fichier `CNAME` à la racine du dépôt indique à GitHub Pages le domaine personnalisé à utiliser. Une fois le domaine acheté, configurez chez votre registrar :

| Type | Nom | Valeur |
|------|-----|--------|
| A | @ (ou vide) | 185.199.108.153 |
| A | @ (ou vide) | 185.199.109.153 |
| A | @ (ou vide) | 185.199.110.153 |
| A | @ (ou vide) | 185.199.111.153 |
| CNAME | www | `<utilisateur>.github.io` |

Puis dans **Settings > Pages** du dépôt GitHub, renseigner `partagercestvivre.com` comme domaine personnalisé et cocher **Enforce HTTPS** une fois la propagation DNS terminée (peut prendre jusqu'à 24-48h).

## Référencement (SEO)

Le site inclut `robots.txt`, `sitemap.xml`, des balises `<link rel="canonical">` sur chaque page et des données structurées JSON-LD (type `NGO`) sur la page d'accueil. Un site tout juste mis en ligne n'apparaît pas immédiatement dans Google : l'indexation prend généralement de quelques jours à quelques semaines. Pour l'accélérer :

1. Créer un compte sur [Google Search Console](https://search.google.com/search-console) avec le compte Google de l'association.
2. Ajouter la propriété `partagercestvivre.com` (vérification par enregistrement DNS TXT chez GoDaddy, ou par le fichier CNAME déjà en place).
3. Soumettre `https://partagercestvivre.com/sitemap.xml` dans l'onglet **Sitemaps**.
4. Utiliser **Inspection d'URL** sur la page d'accueil puis cliquer **Demander une indexation**.

Faire la même démarche sur [Bing Webmaster Tools](https://www.bing.com/webmasters) (utilisé aussi par Yahoo et en partie par ChatGPT/Copilot) est également recommandé.

## Note de sécurité : ne pas publier le RIB

Le PDF source (`docs/Dossier Sponsoring Gala PCV 4eme Edition.pdf`) contient le RIB bancaire de l'association. Il n'a volontairement pas été repris sur le site public — ce type d'information ne doit être communiqué aux sponsors que par un canal direct et sécurisé (email, téléphone), jamais publié sur une page web accessible à tous. Si ce dossier PDF est déployé tel quel sur GitHub Pages (dans le dossier `docs/`), il redeviendrait public : pensez à l'exclure du déploiement ou à le retirer du dépôt s'il n'est pas censé être accessible à tous.

## À faire avant mise en ligne

- [ ] Vérifier les dates/heures encore incertaines (ex. horaires exacts des éditions passées du Gala)
- [ ] Décider si `docs/` (dossier de sponsoring, contient un RIB) doit être exclu du déploiement public
- [ ] Mettre à jour le tableau de sponsoring une fois le Gala 2026 passé
- [ ] Vérifier que www.partagercestvivre.com (mentionné dans le dossier) ne référence pas un autre site existant
