# TODO — Feuille de route de l'application

Référentiel des fonctionnalités : **À faire** (priorisé P1→P5), **Idée** (piste non priorisée), **Fait** (livré, en fin de fichier pour mémoire).

## À faire

### P1 — Essentiel pour la préparation de l'oral (à faire en premier)

- [ ] **Minuteur d'oral blanc** : chronomètre configurable (préparation X min / passage Y min) dans la vue détail d'un numéro de leçon de la section Oral ; alerte visuelle au passage préparation→exposé ; persisté dans les préférences.
- [ ] **Mode révision — masquage des démonstrations** : bascule globale « afficher / masquer toutes les démonstrations » (onglets notions, fiches compactes des plans/développements) pour s'auto-tester avant l'oral ; état persisté.
- [ ] **Tirage aléatoire de notions** : bouton « Une notion au hasard » filtré par matière / nature / leçon d'oral, pour l'entraînement de mémoire type oral ; ouvre la notion tirée dans un onglet.
- [ ] **Favoris / notions à revoir** : épingler des notions (stockage dans les préférences, jamais dans les `.tex`), filtre « Favoris » dans la sidebar Notions, badge épinglé sur les cartes, compteur.



### P2 — Confort quotidien

- [ ] **Marque-pages / reprise de lecture PDF** : mémoriser la dernière page consultée de chaque cours (préférences), proposition de reprise à la réouverture ; indicateur de progression dans la liste des cours.
- [ ] **Historique de navigation des notions** : boutons précédent / suivant façon navigateur (pile des notions ouvertes), `Alt+←` / `Alt+→`.
- [ ] **Restauration de session** : réouvrir au démarrage les onglets de notions et la section qui étaient ouverts à la fermeture (préférences).
- [ ] **Synchronisation notion ↔ PDF** : bouton « voir dans le cours » depuis une notion — ouvre le PDF correspondant à la bonne page (titre cherché dans la couche texte du PDF ; `.synctex.gz` exploitables en complément).
- [ ] **Statistiques de révision** : compteur de vues par notion (préférences), badge « souvent revue » sur les cartes, tri « les moins vues d'abord » pour cibler les révisions.
- [ ] **Surlignage persistant des PDF** : annotations colorées par page (palette de couleurs, suppression), stockées en JSON dans les préférences — jamais dans le PDF.
- [ ] **Recherche globale** (`Ctrl+Shift+F`) : chercher un terme sur **toutes** les sections à la fois (notions, plans, développements, titres de leçons) avec résultats groupés par section.

### P3 — Rédaction des plans et développements

- [ ] **Modèles de plan** : à la création d'un plan, partir d'un squelette (intro / développement / conclusion, `\chapter`/`\section` prêts) ou d'un plan existant comme modèle ; modèles par défaut + « enregistrer comme modèle ».
- [ ] **Compteur de temps de lecture estimé** : longueur du plan (mots / formules) → estimation « ≈ X min d'exposé », affichée dans la toolbar de l'éditeur Plans ; seuil d'alerte par rapport au temps d'oral réglementaire.
- [ ] **Dupliquer un plan / un développement** : bouton sur les cartes d'accueil — copie complète (contenu + métadonnées) avec titre « copie de … » ; utile pour décliner un plan par niveau de détail.
- [ ] **Statistiques des numéros de leçon** : dans la section Oral, indicateurs de couverture — numéros sans plan rédigé, numéros sans développement, tri par « à travailler en priorité ».
- [ ] **Import de `.tex` externe** : importer un plan/développement rédigé ailleurs (boîte de dialogue native) → création dans `lecons/` ou `developpements/` avec métadonnées propres à l'app.

### P4 — Interface / polish

- [ ] **Personnalisation de la taille de police du rendu** (KaTeX et code) : réglage + / − dans la toolbar des notions, persisté ; utile pour la projection ou le confort visuel.
- [ ] **Épinglage d'onglets de notions** : épingler les notions clés (restent en tête de rangée, protégées de « fermer tous »).
- [ ] **Aperçu compact plein écran d'une leçon** : mode « fiche de révision » imprimable (rendu fiche compact existant, sans chrome d'application) — impression ou capture avant l'oral.
- [ ] **Zoom global de l'interface** : `Ctrl+plus` / `Ctrl+moins` (taille de police racine), persisté.
- [ ] **Animations de transition** légères entre sections et vues (fondu discret) pour la fluidité perçue.

### P5 — Technique / robustesse

- [ ] **Multi-dossiers de cours** : plusieurs racines (ex. L3/M1/M2 **et** dossier agrégation) avec bascule rapide depuis la sidebar ; liste des racines dans les préférences.
- [ ] **Sauvegarde / export des données de l'app** : exporter toutes les préférences (favoris, thèmes, marque-pages, statistiques) en un fichier JSON restaurable — utile en cas de changement de machine.
- [ ] **Vérification d'intégrité au démarrage** : scan de `oral/lessons.json` et des métadonnées des plans/développements au lancement ; réparation ou signalement des entrées orphelines/incohérentes.
- [ ] **CI de tests** : workflow GitHub Actions qui lance `npm test` à chaque push/PR — protège contre les régressions du parsing et des fichiers (les 61 tests existants).

### Idées (non priorisées)

- Variantes de logo (∫ au lieu de Σ, version avec titre).
- Coloration syntaxique dans le panneau « Code source » de la section Cours si des `.tex` y deviennent lisibles.
- Support de l'anglais (interface bilingue) — peu probable avant l'oral.
- Mode « tableau noir » pour réviser : notions affichées une par une en très grand format.

## Fait (v0.2.x — pour mémoire)

- [x] **Raccourcis clavier globaux** : `Ctrl+F` focus recherche de la section active (Notions, Cours/PDF, Oral, Plans, Développements), `Ctrl+W` fermer l'onglet de notion actif, `Ctrl+Tab` / `Ctrl+Maj+Tab` onglet de notion suivant/précédent, `F11` plein écran (IPC `app:toggle-fullscreen`), `Échap` retour à l'accueil de la section courante (vue détail leçons/développements/oral) ; raccourcis affichés dans les info-bulles et placeholders des champs de recherche.
- [x] **Test de compilation d'une notion** : bouton **« Vérifier »** dans l'onglet d'une notion — `lib/compile-check.js` (Node pur, testé) extrait les `\macro` et environnements du corps (commentaires ignorés), les compare aux définitions du `settings.tex` et aux commandes standard LaTeX/KaTeX ; affiche « ✓ Compile seule » ou la liste des macros/environnements manquants — pour repérer les problèmes **avant** l'oral.

- [x] **Thème clair / sombre commutable** : bouton « Thème » en bas de la barre latérale — bascule instantanée via `html[data-theme="light"]` (jeu complet de variables CSS claires, code couleur des natures et couleurs de tokens adaptés), préférence persistée via IPC génériques `app:get-pref` / `app:set-pref`.
- [x] **Coloration syntaxique** du code source des notions **et en direct dans les éditeurs Plans / Développements** (surligneur derrière textarea transparent, synchronisation saisie + défilement, insertion au curseur incluse) : tokenizer `lib/latex-highlight.js` (Node pur, testé, double usage Node/window) — commentaires, commandes, environnements, accolades, mode math, spéciaux ; couleurs `--tok-*` adaptées aux deux thèmes.
- [x] **Export `.tex` autonome compilable** des plans et développements : bouton « Exporter .tex » (dialogue natif, préambule du `settings.tex` ou de repli, métadonnées internes retirées, titre échappé) ; `lib/tex-export.js` (Node pur, testé).
- [x] **Dialogues applicatifs maison** (correctif Renommer/Retirer/Supprimer — `window.prompt`/`confirm` inopérants dans Electron) : `showAppDialog()`, validation Entrée, annulation Échap.
- [x] **Fiches compactes généralisées** à tous les aperçus (Plans, Développements, Oral) : noms des notions masqués, « ‹Type› : ‹corps› » en un seul flux dense ; correctif anti-troncature (`flex-shrink: 0`, `overflow-x` local).
- [x] **Oral — aperçus intégrés** : clic sur un plan ou un développement → aperçu dans la section Oral (boutons flèche retour et crayon en icônes SVG).
- [x] **Ergonomie** : recherches (Oral / Plans / Développements), menu ⋯ sur les cartes Oral, section « Leçons » renommée « Plans », flèches retour stylées.
- [x] **Aperçus « dans l'ordre du document »** : titres `\chapter`/`\section`/`\subsection`/`\subsubsection` et texte libre entre les blocs ; mini-sommaires sous les plans de la section Oral.
- [x] **Oral — titres modifiables et registre** : section registre des numéros de leçon (`oral/lessons.json`, Node pur, testé), titres officiels modifiables, « Retirer » sans toucher aux plans/développements.
- [x] **Plans — section complète** : création à numéro seul (plusieurs plans par numéro, titre auto « Plan N »), éditeur LaTeX avec bibliothèque de notions (insertion au curseur), identifiant stable `% lesson-meta:`, autosauvegarde `lecons/`, renommage auto, suppression confirmée.
- [x] **Développements — section complète** : éditeur LaTeX, « Leçons compatibles » (cases à cocher + numéros libres `12, 142, 158`), bibliothèque de notions, métadonnées `% dev-meta:`, autosauvegarde `developpements/`.
- [x] **Recherche dans le corps des notions** : titre / nature / matière / corps (démonstrations incluses), tri par pertinence, cartes à titre concordant encadrées.
- [x] **Notions — extraction et fusion** : tous les `.tex` du dossier, fusion par titre **et** nature, démonstrations couplées et repliées, filtres (nommées/anonymes, matières, natures), code couleur par nature, recherche insensible accents/casse.
- [x] **Lecteur PDF pdf.js embarqué** : zoom, ajustement largeur, Ctrl+molette, sommaire interactif avec suivi de lecture, liens cliquables, rendu virtuel.
- [x] **Recherche texte dans les PDF** : insensible casse/accents, occurrences surlignées (courante jaune, autres orange), navigation ▲▼ / Entrée / Maj+Entrée, compteur.
- [x] **Onglets de notions persistants** (cache de rendu), bouton « fermer tous », badge « avec démonstration » sur les cartes.
- [x] **Rechargement automatique du dossier** (watch) avec préservation du contexte (onglets, filtres, PDF à la page courante).
- [x] **Logo** (livre + Σ) : SVG source + PNG/ICO pour fenêtre, installateur, accueil.
- [x] **Installateur Windows automatique** (GitHub Actions, tag `v*` → release) et **mise à jour automatique** de l'app installée (electron-updater, bannière « Redémarrer », `latest.yml` joint).
- [x] **Version dans le titre de la fenêtre**, lue dynamiquement depuis `package.json`.
- [x] **Suite de tests unitaires** (`npm test`) : 61 tests — parsing `settings.tex`, extraction des notions, modèle (nommage, preuves, fusion), fichiers de leçons/développements, registre oral, export `.tex`, coloration syntaxique, watcher — sans Electron.
