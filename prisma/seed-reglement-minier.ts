import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6jKorn4YUIRe@ep-dry-math-agmjjbbe-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// ─── Données ─────────────────────────────────────────────────────────────────

const titresData = [
  { id: "t1", numero: "Ier", titre: "DES GENERALITES" },
]

const chapitresData = [
  { id: "ch1", numero: "I", titre: "DU CHAMP D'APPLICATION ET DES DEFINITIONS DES TERMES", titreId: "t1" },
]

const articlesData = [
  // ── Article 1er ──────────────────────────────────────────────────────────────
  {
    id: "art1", numero: "1er", titre: "Du champ d'application",
    chapitreId: "ch1", titreId: "t1",
    keywords: ["champ d'application", "loi", "code minier", "modalités", "conditions"],
    paragraphes: [
      {
        id: "p1_1", numero: "", ordre: 1,
        contenu: "Le présent Décret fixe les modalités et les conditions d'application de la loi n°007/2002 du 11 Juillet 2002 portant Code minier telle que modifiée et complétée par la Loi n°18/001 du 09 Mars 2018.",
      },
      {
        id: "p1_2", numero: "", ordre: 2,
        contenu: "Il réglemente en outre les matières connexes non expressément prévues, définies ou réglées par les dispositions de la loi n°007/2002 du 11 Juillet 2002 portant Code minier telle que modifiée et complétée par la Loi n°18/001 du 09 Mars 2018.",
      },
    ],
  },

  // ── Article 2 ─────────────────────────────────────────────────────────────────
  {
    id: "art2", numero: "2", titre: "Des définitions des termes",
    chapitreId: "ch1", titreId: "t1",
    keywords: [
      "définitions", "termes", "administration", "mines", "aires protégées", "autorité",
      "bureau", "cadastre", "cahier des charges", "carré", "code minier", "compensation",
      "concentration", "contrat", "déplacement", "développement durable", "direction",
      "droits", "erreur manifeste", "entités", "indemnisation", "industrie extractive",
      "matériaux", "milieu sensible", "minéraux industriels", "mine distincte", "moyen",
      "partie prenante", "pays", "poste", "plan", "personne publique", "PGES",
      "pleine concurrence", "projet", "quotité", "règles", "réinstallation", "service",
      "services techniques", "site minier", "sous-traitant", "terrain", "transparence",
      "travaux", "titre", "zones",
    ],
    paragraphes: [
      {
        id: "p2_1", numero: "", ordre: 1,
        contenu: "Outre les définitions des termes repris dans la loi n°007/2002 du 11 Juillet 2002 portant Code minier telle que modifiée et complétée par la Loi n°18/001 du 09 Mars 2018 qui gardent le même sens dans le présent Décret, on entend par :",
      },
      {
        id: "p2_2", numero: "•", ordre: 2,
        contenu: "Administration des douanes : administration ou organisme public chargé de l'application de la législation douanière et de la perception des droits et taxes à l'importation et à l'exportation et qui est également chargé de l'application d'autres lois et règlements relatifs à l'importation et à l'exportation ;",
      },
      {
        id: "p2_3", numero: "•", ordre: 3,
        contenu: "Administration des Mines : l'Administration des Mines comprend le Secrétariat général, les directions, les divisions et autres services administratifs du ministère en charge des mines, y compris ceux qui interviennent dans l'administration du Code minier et de toutes ses mesures d'application. Ils sont régis conformément aux textes légaux et réglementaires en vigueur relatifs à l'Administration publique. Les directions techniques qui interviennent dans le processus de l'octroi des droits miniers et/ou de carrières sont : - la Direction de Géologie ; - la Direction des Mines ; - la Direction de Protection de l'Environnement Minier ; - la Direction des Carrières ;",
      },
      {
        id: "p2_4", numero: "•", ordre: 4,
        contenu: "Aire protégée : toute aire géographique délimitée en surface et constituant un parc national, un domaine de chasse, un jardin zoologique et/ou botanique ou encore un secteur sauvegardé ;",
      },
      {
        id: "p2_5", numero: "•", ordre: 5,
        contenu: "Autorité de certification : les autorités administratives habilitées à contrôler, valider et délivrer le Certificat d'origine, à savoir le Ministre et le Directeur général du CEEC. En l'absence du Ministre, le Vice-Ministre ou le Secrétaire Général agissent en ses lieu et place ;",
      },
      {
        id: "p2_6", numero: "•", ordre: 6,
        contenu: "Autorité d'importation ou Autorité importatrice: organisme officiel de régulation ou de contrôle du pays vers lequel les produits sont exportés;",
      },
      {
        id: "p2_7", numero: "•", ordre: 7,
        contenu: "Bureau d'études géologiques : cabinet qui réalise l'ensemble des études de recherches visant à démontrer l'existence d'un gisement et la faisabilité ou non de sa mise en exploitation. Ce Bureau intègre les branches de recherches et développement des gisements miniers, des études techniques portant sur l'extraction minière, les traitements minéralurgiques et métallurgiques ainsi que les études économico-financières portant sur le projet minier ;",
      },
      {
        id: "p2_8", numero: "•", ordre: 8,
        contenu: "Cadastre Minier central : la Direction Générale du Cadastre Minier ;",
      },
      {
        id: "p2_9", numero: "•", ordre: 9,
        contenu: "Cadastre Minier provincial : la Direction provinciale du Cadastre Minier ;",
      },
      {
        id: "p2_10", numero: "•", ordre: 10,
        contenu: "Cahier des charges : ensemble d'engagements périodiques négociés et pris entre le titulaire de droit minier d'exploitation ou de l'autorisation d'exploitation de carrière permanente et les communautés locales affectées par le projet minier, pour la réalisation des projets de développement communautaire durable, au sens de l'article 285 septies du Code minier ;",
      },
      {
        id: "p2_11", numero: "•", ordre: 11,
        contenu: "Carré : l'unité cadastrale minimum octroyable, de caractère indivisible, délimitée par les méridiens et les parallèles du système des coordonnées de la carte de retombes minières, ayant une superficie de 84,95 Ha;",
      },
      {
        id: "p2_12", numero: "•", ordre: 12,
        contenu: "Code minier : la loi n°007/2002 du 11 Juillet 2002 portant Code minier telle que modifiée et complétée par la Loi n°18/001 du 09 Mars 2018 dont le champ d'application couvre les mines et les carrières ;",
      },
      {
        id: "p2_13", numero: "•", ordre: 13,
        contenu: "Compensation : remplacement en nature de certains biens spécifiques, notamment les logements et autres biens immeubles perdus par les communautés affectées par les activités du projet minier ;",
      },
      {
        id: "p2_14", numero: "•", ordre: 14,
        contenu: "Concentration : le processus par lequel les substances minérales sont séparées de la gangue et rassemblées de façon à augmenter la teneur en éléments valorisables en vue d'obtenir un produit marchand ;",
      },
      {
        id: "p2_15", numero: "•", ordre: 15,
        contenu: "Contrat : - le texte intégral de tout contrat, concession, ou autre accord conclu par ou avec le gouvernement congolais et fixant les conditions d'exploitation de ressources minières; - le texte intégral de tout addenda, annexe ou avenant fixant les détails relatifs aux droits d'exploitation mentionnés au point a ou à leur exécution ; - le texte intégral de toute modification ou de tout amendement des documents décrits aux points a et b ;",
      },
      {
        id: "p2_16", numero: "•", ordre: 16,
        contenu: "Déplacement des populations : délocalisation des populations due au besoin de l'exploitation minière pouvant impliquer la perte de l'environnement naturel, du patrimoine culturel et matériel ;",
      },
      {
        id: "p2_17", numero: "•", ordre: 17,
        contenu: "Développement durable : toute approche de la croissance ayant pour objectif principal de concilier le progrès économique et social avec la préservation de l'environnement en vue d'assurer le progrès actuel sans compromettre celui des générations futures ;",
      },
      {
        id: "p2_18", numero: "•", ordre: 18,
        contenu: "Direction chargée de la Protection de l'Environnement Minier : service chargé de la Protection de l'Environnement Minier ;",
      },
      {
        id: "p2_19", numero: "•", ordre: 19,
        contenu: "Droit de carrières de recherches: l'Autorisation de Recherches des produits de carrières ;",
      },
      {
        id: "p2_20", numero: "•", ordre: 20,
        contenu: "Droit de carrières d'exploitation : l'Autorisation d'Exploitation de Carrières Permanente et l'Autorisation d'Exploitation de Carrières Temporaire ;",
      },
      {
        id: "p2_21", numero: "•", ordre: 21,
        contenu: "Droit minier de recherches : le Permis de Recherches ;",
      },
      {
        id: "p2_22", numero: "•", ordre: 22,
        contenu: "Droit minier d'exploitation : le Permis d'Exploitation, le Permis d'Exploitation des Rejets ou le Permis d'Exploitation de Petite Mine;",
      },
      {
        id: "p2_23", numero: "•", ordre: 23,
        contenu: "Erreur manifeste : une erreur évidente qui apparaît sans analyse ;",
      },
      {
        id: "p2_24", numero: "•", ordre: 24,
        contenu: "Entités Territoriales Décentralisées : les entités territoriales dotées de la personnalité en vertu de la constitution et de la loi ;",
      },
      {
        id: "p2_25", numero: "•", ordre: 25,
        contenu: "Indemnisation : paiement effectué par le titulaire et, le cas échéant, l'entité de traitement ou de transformation en faveur de la personne affectée pour la perte d'un bien matériel ou immatériel ou en réparation d'un préjudice physique ou moral ;",
      },
      {
        id: "p2_26", numero: "•", ordre: 26,
        contenu: "Industrie Extractive : Toute unité d'extraction, de transformation et de commercialisation œuvrant dans le secteur des mines conformément au Code minier et ses mesures d'application. Il s'agit des titulaires des droits miniers d'exploitation et de petite mine, des coopératives minières, des négociants, des comptoirs agréés, des marchés boursiers ainsi que des centres de négoces ;",
      },
      {
        id: "p2_27", numero: "•", ordre: 27,
        contenu: "Matériaux de construction à usage courant : toutes substances minérales non métalliques de faible valeur, classées en carrières et utilisées dans l'industrie du bâtiment comme matériaux ordinaires non décoratifs, exploitées intensivement ou à petite échelle, tels qu'énumérés par voie règlementaire. Il s'agit notamment de : - argiles à brique ; - sables ; - grès ; - calcaire à moellon ; - marne ; - quartzite ; - craie ; - gravier alluvionnaire ; - latérites ; - basaltes ;",
      },
      {
        id: "p2_28", numero: "•", ordre: 28,
        contenu: "Milieu sensible : le milieu ambiant ou écosystème dont les caractéristiques le rendent particulièrement vulnérable aux impacts négatifs des opérations des mines ou de carrières, conformément à l'annexe XI du présent Décret ;",
      },
      {
        id: "p2_29", numero: "•", ordre: 29,
        contenu: "Minéraux industriels : les substances minérales classées en carrières et utilisées comme intrants dans l'industrie légère ou lourde. Il s'agit notamment de : - gypse ; - kaolin ; - dolomie ; - calcaire à ciment ; - sables de verrerie ; - fluorine ; - diatomites ; - montmorillonite ; - barytine ; - Calcaire à chaux.",
      },
      {
        id: "p2_30", numero: "•", ordre: 30,
        contenu: "Mine distincte : mine distincte d'une autre mine existante et de ce fait nouvelle, qui fait l'objet d'un nouveau droit minier d'exploitation ou d'un contrat d'amodiation, dès lors qu'elle concerne un gisement distinct nécessitant des méthodes d'exploitation et des procédés de traitement séparés ainsi que des moyens de production nettement individualisés, ou du fait de leur éloignement ou de leurs conditions d'exploitation, nécessitant la création d'installations minières distinctes ;",
      },
      {
        id: "p2_31", numero: "•", ordre: 31,
        contenu: "Moyen le plus rapide et le plus fiable : le moyen de communication qui permet la transmission la plus rapide de l'information écrite par l'expéditeur au destinataire sans distorsion du contenu et avec confirmation de réception, notamment fax et courrier électronique ;",
      },
      {
        id: "p2_32", numero: "•", ordre: 32,
        contenu: "Partie prenante : Acteur ou groupe d'acteurs impliqués ou ayant des intérêts dans le secteur minier, notamment le gouvernement, les industries extractives du secteur minier ainsi que de la société civile, partenaire dans le cadre de l'ITIE ou de toute autre initiative similaire ;",
      },
      {
        id: "p2_33", numero: "•", ordre: 33,
        contenu: "Pays de destination : Pays de destination finale de tout lot des substances minérales et/ou produits miniers marchands exportés de la République Démocratique du Congo ;",
      },
      {
        id: "p2_34", numero: "•", ordre: 34,
        contenu: "Pays de transit : c'est l'ensemble des pays à travers lesquels tout lot des substances minérales et/ou produits miniers marchands exportés de la République Démocratique du Congo traverse avant d'arriver au pays de destination finale ;",
      },
      {
        id: "p2_35", numero: "•", ordre: 35,
        contenu: "Poste frontalier : le poste placé sur un point de la frontière séparant deux Etats.",
      },
      {
        id: "p2_36", numero: "•", ordre: 36,
        contenu: "Poste frontière : le poste à l'intérieur du territoire national qui enregistre les mouvements, soit vers d'autres postes de l'intérieur, soit de l'extérieur vers l'intérieur ou de l'intérieur vers l'extérieur ;",
      },
      {
        id: "p2_37", numero: "•", ordre: 37,
        contenu: "Plan d'Ajustement Environnemental : la description de l'état du lieu d'implantation de l'opération minière et de ses environs à la date de la publication du présent Décret ainsi que des mesures de protection de l'environnement déjà réalisées ou envisagées et de leur mise en œuvre progressive. Ces mesures visent l'atténuation des impacts négatifs de l'opération minière sur l'environnement et la réhabilitation du lieu d'implantation et de ses environs en conformité avec les directives et normes environnementales applicables pour le type d'opération minière concerné ;",
      },
      {
        id: "p2_38", numero: "•", ordre: 38,
        contenu: "Personne publique : toute personne morale de droit public constituant, aux termes de la loi, une entité dotée de la personnalité juridique ou un service public personnalisé ;",
      },
      {
        id: "p2_39", numero: "•", ordre: 39,
        contenu: "PGES, Plan de Gestion Environnementale et Sociale : le programme de mise en œuvre et de suivi des mesures envisagées par l'EIES pour atténuer et le cas échéant supprimer les conséquences dommageables du projet minier sur l'environnement, réhabiliter les sites affectés par le projet minier, indemniser, compenser et réinstaller les personnes affectées par le projet minier. Ces documents contiennent : - la description du milieu ambiant ; - la description des travaux de mines ou de carrières considérés ; - l'analyse des impacts des opérations de mines ou de carrières sur ce milieu ambiant ; - les mesures d'atténuation et de réhabilitation; - l'engagement à respecter les termes du plan et de mettre en œuvre les mesures d'atténuation et de réhabilitation proposées ;",
      },
      {
        id: "p2_40", numero: "•", ordre: 40,
        contenu: "Pleine concurrence : principe selon lequel les prix pratiqués pour des transactions entre sociétés affiliées ou toutes autres conditions convenues qui s'appliquent auxdites transactions, doivent être établis par référence aux prix pratiqués sur le marché par des entreprises indépendantes ;",
      },
      {
        id: "p2_41", numero: "•", ordre: 41,
        contenu: "Projet ou Projet minier : tout projet mis sur pied par le titulaire, visant une ou plusieurs activités minières ou de carrières, en vue de la découverte ou de l'exploitation d'un gisement et la commercialisation des produits marchands ;",
      },
      {
        id: "p2_42", numero: "•", ordre: 42,
        contenu: "Projet minier d'exploitation : projet mis sur pied par le titulaire d'un droit minier d'exploitation visant l'exploitation soit d'une ou plusieurs mines se trouvant dans le même périmètre minier soit d'une mine distincte ;",
      },
      {
        id: "p2_43", numero: "•", ordre: 43,
        contenu: "Projet minier de recherches : tout projet mis sur pied par le titulaire d'un ou de plusieurs droits miniers de recherches visant la recherche d'une ou plusieurs substances minérales ;",
      },
      {
        id: "p2_44", numero: "•", ordre: 44,
        contenu: "Quotité : la part minimale des recettes d'exportation que tout titulaire des droits miniers et des Autorisations d'Exploitation des Carrières Permanente de production de ciment, qui est en phase d'amortissement de ses investissements, a l'obligation de rapatrier au pays dans le délai règlementaire ou à garder à l'étranger dans son compte principal ;",
      },
      {
        id: "p2_45", numero: "•", ordre: 45,
        contenu: "Règles de l'art des mines : ensemble de mesures, conditions techniques, méthodes de recherches, d'exploitation ainsi que des procédés des traitements minéralurgiques et métallurgiques requis servant à valoriser le gisement et optimiser le rendement global d'extraction dans le respect des règles de sécurité, d'hygiène et de protection de l'environnement ;",
      },
      {
        id: "p2_46", numero: "•", ordre: 46,
        contenu: "Réinstallation : processus de relocalisation des communautés affectées par le déplacement dû aux activités minières ;",
      },
      {
        id: "p2_47", numero: "•", ordre: 47,
        contenu: "Service chargé de l'Administration du Code minier : tout service chargé, conformément à ses attributions, de l'application d'une ou des dispositions du Code minier et de ses mesures d'application ;",
      },
      {
        id: "p2_48", numero: "•", ordre: 48,
        contenu: "Services techniques spécialisés : les services techniques créés par les pouvoirs publics pour intervenir dans la gestion du secteur minier tels que : - la Cellule Technique de Coordination et de Planification Minière « C.T.C.P.M.» ; - le Centre d'Evaluation, d'Expertise et de Certification des substances minérales précieuses et semi-précieuses « CEEC » ; - le Service d'Assistance et d'Encadrement de l'Exploitation Minière Artisanale et à Petite échelle \" SAEMAPE\" ; - le Cadastre Minier \"CAMI\" ; - Service Géologique National du Congo \"SGNC\" ;",
      },
      {
        id: "p2_49", numero: "•", ordre: 49,
        contenu: "Site minier : tout gisement couvert par un titre minier conféré à un particulier ou toute zone ouverte à l'exploitation minière artisanale ;",
      },
      {
        id: "p2_50", numero: "•", ordre: 50,
        contenu: "Sous-traitant : toute personne qui contracte directement avec le titulaire des droits miniers ou des carrières, en application des articles 1er, point 48, 108 quinquies et 219 du Code minier ;",
      },
      {
        id: "p2_51", numero: "•", ordre: 51,
        contenu: "Terrain constituant une rue, une route, une autoroute : tout espace établi par l'autorité administrative compétente comme constituant une rue, y compris les côtés sur une distance de cinq mètres de part et d'autre de la rue ; toute zone établie par l'autorité administrative compétente comme constituant une route, y compris les côtés sur une distance de vingt mètres de part et d'autre de la route ; et toute zone établie par l'autorité administrative compétente comme constituant une autoroute, y compris les côtés sur une distance de cinquante mètres de part et d'autre de l'autoroute ;",
      },
      {
        id: "p2_52", numero: "•", ordre: 52,
        contenu: "Terrain contenant des vestiges archéologiques ou un monument national : tout espace terrestre institué par toute autorité administrative compétente en zone contenant des vestiges archéologiques ou un monument national ;",
      },
      {
        id: "p2_53", numero: "•", ordre: 53,
        contenu: "Terrain faisant partie d'un aéroport ou zone aéroportuaire : tout espace établi et reconnu par l'autorité administrative compétente comprenant toutes les installations nécessaires au fonctionnement d'un aéroport, y compris les installations d'embarquement, les terminaux, les pistes, les routes d'accès et les parkings ;",
      },
      {
        id: "p2_54", numero: "•", ordre: 54,
        contenu: "Terrain proche des installations de la Défense Nationale : tout espace terrestre situé à moins de mille mètres d'une installation de la Défense Nationale identifiée comme telle par des clôtures et/ou des panneaux d'avertissement ;",
      },
      {
        id: "p2_55", numero: "•", ordre: 55,
        contenu: "Terrain réservé à la pépinière pour forêt ou à la plantation des forêts : tout espace réservé par l'autorité administrative compétente à la pépinière pour forêt ou à la plantation des forêts, selon les procédures administratives en vigueur ;",
      },
      {
        id: "p2_56", numero: "•", ordre: 56,
        contenu: "Terrain réservé au cimetière : tout espace terrestre réservé par l'autorité administrative compétente à l'enterrement des morts ;",
      },
      {
        id: "p2_57", numero: "•", ordre: 57,
        contenu: "Terrain réservé au projet de chemin de fer : toute portion de terre réservée, par l'autorité administrative compétente, à un projet de chemin de fer, selon les procédures administratives en vigueur ;",
      },
      {
        id: "p2_58", numero: "•", ordre: 58,
        contenu: "Transparence : ensemble de règles, mécanismes et pratiques rendant obligatoires les déclarations et les publications, de la part de l'Etat et des entreprises extractives, en particulier celles de l'industrie minière, des revenus et paiements de tout genre, comprenant, notamment les revenus des exploitations et des transactions minières, la publication des statistiques de production et de vente, la publication des contrats et la divulgation des propriétaires réels des actifs miniers ainsi que les données sur l'allocation des ressources provenant du secteur minier. Elle s'étend également au respect des obligations de procédures d'acquisition et d'aliénation des droits miniers ;",
      },
      {
        id: "p2_59", numero: "•", ordre: 59,
        contenu: "Travaux de développement et de construction : ensemble d'opérations comprenant les travaux d'accès au gisement, des travaux préparatoires de la mine, d'extraction minière de roulage, de stockage ainsi que d'implantation des installations des traitements minéralurgiques et métallurgiques, en ce compris, les travaux de construction d'immeubles par incorporation et par destination, situés dans le périmètre minier ou affectés à l'exploitation minière, ainsi que les travaux directement liés à la mise en route du projet minier ;",
      },
      {
        id: "p2_60", numero: "•", ordre: 60,
        contenu: "Travaux d'infrastructures : activités de mise en place des infrastructures d'appui à la production minière notamment les : - installations de desserte d'eau industrielle, d'électricité et de gaz ; - installations de production de vapeur, installations de séchage des minerais et des produits marchands ; - installations de stockage et de distribution de carburant ; - installations de transport et voies de communication dans le périmètre minier ou des carrières comprenant notamment des routes d'accès à la mine ou à la carrière et d'évacuation des minerais et produits miniers, des pistes d'atterrissage, chemin de fer, port minéralier, équipements de téléphonie dans les sites miniers, équipements de télé contrôle de processus, garages pour engins miniers ; - ateliers de rénovation et de maintenance des équipements mécaniques et électriques ; - ateliers de chaudronneries et de tuyauteries ; - bassins de confinement et bassins de sédimentation ; - aires d'accumulation et parcs à rejets miniers ;",
      },
      {
        id: "p2_61", numero: "•", ordre: 61,
        contenu: "Travaux de l'art des mines : activités relatives à la recherche minière, aux travaux de génie minier et de génie minéralurgique et métallurgique ;",
      },
      {
        id: "p2_62", numero: "•", ordre: 62,
        contenu: "Titre : - le texte intégral de tout bail, titre ou permis par lequel le gouvernement octroie à une ou plusieurs sociétés, ou à un, les droits afférents à la recherche ou à l'exploitation des ressources minières ; - le texte intégral de tout addenda, annexe ou avenant fixant les détails relatifs aux droits de recherches ou d'exploitation ; - le texte intégral de toute modification ou de tout amendement des documents décrits aux points a et b ;",
      },
      {
        id: "p2_63", numero: "•", ordre: 63,
        contenu: "Zones à haut risque : celles qui caractérisent par l'instabilité politique ou la répression, la faiblesse des institutions, l'insécurité, l'effondrement des infrastructures civiles ou une violence généralisée, mais aussi des atteintes systématiques aux droits de l'homme et des violations du droit national et international ;",
      },
      {
        id: "p2_64", numero: "•", ordre: 64,
        contenu: "Zones de conflit : celles qui se caractérisent par l'existence d'un conflit armé, d'une violence généralisée ou d'autres risques d'atteinte aux populations. Il existe plusieurs types de conflits armés à savoir : les conflits internationaux impliquant deux ou plusieurs États ou non, les guerres de libération, les insurrections, les guerres civiles ;",
      },
      {
        id: "p2_65", numero: "•", ordre: 65,
        contenu: "Zone de réserve : toute portion du territoire national classée en réserve telle que: - les réserves naturelles intégrales constituées selon les dispositions de la Loi n° 14/003 du 11 février 2014 relative à la conservation de la nature ; - les réserves de la biosphère établies par l'UNESCO et gérées par le Secrétariat National du Programme MAB au Congo rattaché au Ministère de l'Environnement ; - les réserves forestières gérées par la Direction de Gestion des Ressources Naturelles et Renouvelables du Ministère de l'Environnement ;",
      },
      {
        id: "p2_66", numero: "•", ordre: 66,
        contenu: "Zone de restriction : toute portion du territoire national dont l'occupation à des fins minières est conditionnée par l'autorisation préalable de l'autorité compétente, du propriétaire ou de l'occupant légal telle que : - terrain réservé au cimetière ; - terrain contenant des vestiges archéologiques ou un monument national ; - terrain proche des installations de la Défense Nationale ; - terrain faisant partie notamment d'un aéroport ; - terrain réservé au projet de chemin de fer ; - terrain réservé à la pépinière pour forêt ou à la plantation des forêts ; - terrain situé à moins de nonante mètres des limites d'un village, d'une cité, d'une commune ou d'une ville; - terrain situé à moins de nonante mètres d'un barrage ou d'un bâtiment appartenant à l'Etat; - terrain compris dans un parc national ; - terrain constituant une rue, une route, une autoroute ainsi que les autres. - terrains cités à l'article 279 du Code minier ;",
      },
      {
        id: "p2_67", numero: "•", ordre: 67,
        contenu: "Zone d'interdiction : toute aire géographique située autour des sites d'opérations minières ou de travaux de carrières établie par arrêté ministériel pris à la demande du titulaire du droit minier d'exploitation ou d'une autorisation d'exploitation de carrières permanente empêchant les tiers d'y circuler ou d'y effectuer des travaux quelconques;",
      },
      {
        id: "p2_68", numero: "•", ordre: 68,
        contenu: "Zone interdite : toute aire géographique où les activités minières sont interdites pour des raisons de sûreté nationale, de sécurité des populations, d'une incompatibilité avec d'autres usages existants ou planifiés du sol ou du sous-sol et de la protection de l'environnement.",
      },
    ],
  },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Début du seed — Règlement Minier…")

  await prisma.reglementParagraphe.deleteMany()
  await prisma.reglementArticle.deleteMany()
  await prisma.reglementChapitre.deleteMany()
  await prisma.reglementTitre.deleteMany()
  console.log("🗑️  Tables vidées")

  for (const t of titresData) {
    await prisma.reglementTitre.create({ data: { id: t.id, numero: t.numero, titre: t.titre } })
  }
  console.log(`✅ ${titresData.length} titre(s) inséré(s)`)

  for (const ch of chapitresData) {
    await prisma.reglementChapitre.create({
      data: { id: ch.id, numero: ch.numero, titre: ch.titre, titreId: ch.titreId },
    })
  }
  console.log(`✅ ${chapitresData.length} chapitre(s) inséré(s)`)

  let totalParagraphes = 0
  for (const art of articlesData) {
    const { paragraphes, ...artData } = art
    await prisma.reglementArticle.create({
      data: {
        id: artData.id,
        numero: artData.numero,
        titre: artData.titre,
        chapitreId: artData.chapitreId,
        titreId: artData.titreId,
        keywords: artData.keywords,
      },
    })
    for (const para of paragraphes) {
      await prisma.reglementParagraphe.create({
        data: {
          id: para.id,
          numero: para.numero,
          contenu: para.contenu,
          ordre: para.ordre,
          articleId: artData.id,
        },
      })
      totalParagraphes++
    }
  }
  console.log(`✅ ${articlesData.length} articles insérés avec ${totalParagraphes} paragraphes`)

  console.log("\n🎉 Seed terminé avec succès !")
  console.log(`   Titres      : ${titresData.length}`)
  console.log(`   Chapitres   : ${chapitresData.length}`)
  console.log(`   Articles    : ${articlesData.length}`)
  console.log(`   Paragraphes : ${totalParagraphes}`)
}

main()
  .catch((e) => { console.error("❌ Erreur :", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect(); await pool.end() })
