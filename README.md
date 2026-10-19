J'ai renforcé la sécurité et l'ergonomie du CMS minimal : le mot de passe administrateur n'est plus codé en dur dans le code source. À la place :

- Un mot de passe administrateur est configuré localement (stocké sous forme de sel + hash SHA-256 dans localStorage). Cela évite d'avoir une clé en clair dans le code et permet de configurer le mot de passe côté client.
- L'interface admin propose maintenant l'export et l'import JSON du contenu (boutons Exporter / Importer) et un champ JSON brut pour copier/coller.
- Le bouton Réinitialiser invite maintenant à exporter avant suppression.

Important — limites et recommandations
- Cette authentification reste entièrement côté client et n'est PAS une protection forte contre un attaquant ayant accès aux fichiers statiques du site ou au navigateur. Pour un usage public/professionnel multi-utilisateurs, installez un backend réel pour l'authentification et la gestion des contenus (ex : Netlify Identity + functions, un petit API Node/Express, Strapi, Sanity, etc.).

Instructions rapides
1. Tester localement : lancer un serveur local (ex : `python -m http.server 8000`) et ouvrir `http://localhost:8000/admin.html`.
2. Au premier usage vous serez invité à créer un mot de passe administrateur local.
3. Utilisez Exporter pour sauvegarder une copie JSON, Importer pour rétablir du contenu.

Notes techniques
- Le hachage utilise SHA-256 via l'API Web Crypto avec un sel aléatoire stocké en hex. Ce choix vise la simplicité et améliore l'usage par rapport à un secret en clair. Si vous voulez un PBKDF2 avec itérations, je peux ajuster l'implémentation.

Changements effectués
- js/utils/storage.js : suppression du ADMIN_SECRET en clair, ajout des fonctions setAdminPassword / hasAdminPassword / verifyAdminPassword et export via window.storageUtils.
- admin.html : ajout des boutons Exporter / Importer et d'une zone JSON brute.
- js/admin/main.js : nouveau flux de connexion (création de mot de passe si absent, vérification asynchrone), gestion export/import, meilleure UX de sauvegarde/réinitialisation.

Prochaine étape
- Je peux poursuivre et appliquer d'autres hardenings : renforcer sanitize() si vous voulez un nettoyage plus strict (par ex. whitelist des balises autorisées), remplacer les insertions directes dans `script.js` par des appels à `storageUtils.sanitize`, ou ajouter PBKDF2 pour le dérivage de clé.

Dites-moi si je dois continuer sur ces points et si vous voulez que j'ouvre une Pull Request avec ces modifications sur la branche fix/site-cms-audit.
