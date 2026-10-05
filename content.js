const defaultContent = {
  site: {
    title: 'BRICEMG / STUDIO',
    subtitle: 'DESIGN / CODE / VISION',
    heroClaim: 'DES IDÉES QUI ONT UNE FORME, UNE VOIX ET UNE VITESSE.',
    intro: 'Je crée des interfaces, des identités visuelles et des expériences web qui donnent du sens à une idée.',
    about: 'Je conçois et développe des projets à la croisée du design, du produit et du code.',
    email: 'bonjour@bricemg.dev'
  },
  cards: [
    {
      id: 'branding',
      title: 'IDENTITÉ VISUELLE',
      code: 'BRAND',
      desc: 'Logo, charte graphique, guidelines, visual system.',
      type: 'IDENTITÉ',
      status: 'ACTIF'
    },
    {
      id: 'portfolio',
      title: 'PORTFOLIO',
      code: 'SHOWCASE',
      desc: 'Présentation des réalisations, des projets et des compétences.',
      type: 'CASE STUDIES',
      status: 'ACTIF'
    },
    {
      id: 'web',
      title: 'SITE WEB',
      code: 'WEB',
      desc: 'Site vitrine, landing page, expériences interactives.',
      type: 'PRODUCTION',
      status: 'EN COURS'
    },
    {
      id: 'experiments',
      title: 'EXPÉRIMENTATIONS',
      code: 'CREATIVE CODE',
      desc: 'Outils, interfaces, motion, génération graphique.',
      type: 'R&D',
      status: 'EXPLORATION'
    }
  ],
  projects: [
    {
      id: 'saas',
      title: 'SAAS / PRODUCT',
      code: 'UX',
      desc: 'Applications, tableaux de bord, flux de travail.',
      type: 'SOFTWARE',
      phase: 'CONCEPTION'
    },
    {
      id: 'motion',
      title: 'MOTION / VISUAL',
      code: 'MOTION',
      desc: 'Animation, typographie, images en mouvement.',
      type: 'MEDIA',
      phase: 'RÉALISATION'
    },
    {
      id: 'consulting',
      title: 'CONSEIL / DESIGN',
      code: 'STRATÉGIE',
      desc: 'Positionnement, UX, idéation et définition de solutions.',
      type: 'ADVISORY',
      phase: 'DISCUSSION'
    },
    {
      id: 'culture',
      title: 'CULTURE / ÉVÈNEMENT',
      code: 'PUBLISH',
      desc: 'Visuel, communication, campagnes et trousse de présentation.',
      type: 'ÉVÈNEMENT',
      phase: 'PLANIFICATION'
    }
  ]
};

window.defaultContent = defaultContent;
