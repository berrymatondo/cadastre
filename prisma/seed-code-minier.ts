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

const chapitresData = [
  { id: "ch1",    numero: "Ier",   titre: "DES DÉFINITIONS DES TERMES, DU CHAMP D'APPLICATION ET DES PRINCIPES FONDAMENTAUX" },
  { id: "ch2",    numero: "II",    titre: "DU CADASTRE MINIER" },
  { id: "ch3",    numero: "III",   titre: "DES DROITS MINIERS ET DES AUTORISATIONS DE CARRIÈRES" },
  { id: "ch4",    numero: "IV",    titre: "DES PERMIS D'EXPLOITATION" },
  { id: "ch5",    numero: "V",     titre: "DISPOSITIONS FISCALES ET DOUANIÈRES" },
  { id: "ch_p3",  numero: "III",   titre: "DES PARTENARIATS AVEC L'ÉTAT" },
  { id: "ch_p4",  numero: "IV",    titre: "DE LA MISE EN APPLICATION DE NOUVELLES DISPOSITIONS" },
  { id: "ch_p17", numero: "XVII",  titre: "DES DISPOSITIONS ABROGATOIRES ET FINALES" },
]

const sectionsData = [
  { id: "s1_1",     numero: "I",    titre: "Des définitions des termes et du champ d'application",               chapitreId: "ch1" },
  { id: "s1_2",     numero: "II",   titre: "Des principes fondamentaux",                                          chapitreId: "ch1" },
  { id: "s2_1",     numero: "I",    titre: "Organisation et fonctionnement",                                      chapitreId: "ch2" },
  { id: "s2_2",     numero: "II",   titre: "Des attributions du Cadastre Minier",                                 chapitreId: "ch2" },
  { id: "s3_1",     numero: "I",    titre: "Des droits miniers",                                                  chapitreId: "ch3" },
  { id: "s3_2",     numero: "II",   titre: "Des autorisations de carrières",                                      chapitreId: "ch3" },
  { id: "s4_1",     numero: "I",    titre: "Des conditions d'octroi",                                             chapitreId: "ch4" },
  { id: "s4_2",     numero: "II",   titre: "De la durée et du renouvellement",                                    chapitreId: "ch4" },
  { id: "s5_1",     numero: "I",    titre: "Du régime fiscal",                                                    chapitreId: "ch5" },
  { id: "s5_2",     numero: "II",   titre: "Des droits superficiaires et taxes",                                  chapitreId: "ch5" },
  { id: "s_p3_1",   numero: "I",    titre: "Des partenariats conclus avec l'État",                                chapitreId: "ch_p3" },
  { id: "s_p4_1",   numero: "I",    titre: "Des modalités d'application et de la suspension des demandes",        chapitreId: "ch_p4" },
  { id: "s_p4_2",   numero: "II",   titre: "Des droits existants, validations et conventions minières",           chapitreId: "ch_p4" },
  { id: "s_p4_3",   numero: "III",  titre: "De la garantie de stabilité et du traitement local",                  chapitreId: "ch_p4" },
  { id: "s_p17_1",  numero: "I",    titre: "Des dispositions abrogatoires et de l'entrée en vigueur",             chapitreId: "ch_p17" },
]

const articlesData = [
  // ── Chapitre I, Section I ──────────────────────────────────────────────────
  {
    id: "art1", numero: "1er", titre: "Des définitions",
    sectionId: "s1_1", chapitreId: "ch1",
    modification: "modifié par l'article 1er de la Loi n° 18/001 du 09 mars 2018",
    introduction: "Aux termes du présent Code, on entend par :",
    keywords: ["définitions", "acheteur", "ACE", "activités minières", "administration"],
    paragraphes: [
      {
        id: "p1_1", numero: "1", ordre: 1,
        contenu: "Acheteur (modifié) : tout employé agréé d'un comptoir d'achat, d'une entité de traitement d'or, de diamant et d'autres substances minérales d'exploitation artisanale, qui exerce ses activités conformément aux dispositions du présent Code.",
        note: "Le Législateur souligne l'agrément des acheteurs employés non seulement de Comptoirs d'achat, mais aussi d'Entités de traitement. Par ailleurs, il élargit la notion de l'acheteur en incluant les employés des entités de traitement.",
      },
      {
        id: "p1_2", numero: "1 bis", ordre: 2,
        contenu: "ACE, Agence Congolaise de l'Environnement (inséré) : établissement public à caractère technique et scientifique, créé par Décret n° 14/030 du novembre 2014, exerçant les activités d'évaluation et d'approbation des études environnementales et sociales ainsi que le suivi de leur mise en œuvre.",
        note: "Il était logique que la révision du Code Minier intègre cet Établissement public, étant donné que la Loi qui le crée, postérieure au Code minier de 2002, lui confère notamment la protection de l'environnement minier.",
      },
      {
        id: "p1_3", numero: "2", ordre: 3,
        contenu: "Activités minières (modifié) : tous services, fournitures ou travaux de l'art des mines directement liés à la recherche, à l'exploitation minières et au traitement et/ou transformation des substances minérales, y compris les travaux de développement, de construction et d'infrastructure.",
        note: "Le Législateur supprime la prospection comme activité minière et adapte ce littera à la logique de la révision ayant débouché à l'abrogation des articles 17 à 22.",
      },
      {
        id: "p1_4", numero: "3", ordre: 4,
        contenu: "Administration des Mines (modifié) : ensemble des directions, divisions et autres services publics des mines et des carrières.",
        note: "Le Législateur précise désormais que l'Administration des Mines ne comprend que les Directions, les Divisions et autres Services publics non personnifiés. Cette nouvelle définition est plus précise et restrictive.",
      },
      {
        id: "p1_5", numero: "4", ordre: 5,
        contenu: "Amodiation : un louage pour une durée déterminée ou indéterminée, sans faculté de sous-louage, de tout ou partie des droits attachés à un droit minier ou une autorisation de carrières moyennant une rémunération fixée par accord entre l'amodiant et l'amodiataire.",
      },
      {
        id: "p1_6", numero: "5", ordre: 6,
        contenu: "Ayant-droit (remplace l'ancien point 5) : toute personne physique de nationalité congolaise ayant la jouissance du sol en vertu du droit coutumier ou toute personne physique ou morale occupant le sol en vertu d'un titre foncier.",
        note: "Le Législateur précise le contenu de la notion de l'ayant-droit, en vue de mieux prévenir, éviter et gérer d'éventuels conflits entre le droit foncier et le droit minier.",
      },
    ],
  },
  {
    id: "art2", numero: "2", titre: "Du champ d'application",
    sectionId: "s1_1", chapitreId: "ch1",
    contenu: "Le présent Code régit la recherche, l'exploitation, la transformation et le transport des substances minérales sur l'ensemble du territoire national. Il s'applique à toute personne physique ou morale, de droit public ou privé, qui entreprend des activités minières.",
    keywords: ["champ application", "territoire", "substances minérales"],
    paragraphes: [],
  },
  // ── Chapitre I, Section II ─────────────────────────────────────────────────
  {
    id: "art3", numero: "3", titre: "Des principes fondamentaux",
    sectionId: "s1_2", chapitreId: "ch1",
    introduction: "Les principes fondamentaux régissant le présent Code sont :",
    keywords: ["principes", "souveraineté", "transparence", "développement durable"],
    paragraphes: [
      { id: "p3_1", numero: "1", ordre: 1, contenu: "La souveraineté permanente de l'État sur les ressources naturelles minières." },
      { id: "p3_2", numero: "2", ordre: 2, contenu: "La transparence dans la gestion des ressources minières conformément aux standards internationaux." },
      { id: "p3_3", numero: "3", ordre: 3, contenu: "Le développement durable et la protection de l'environnement dans l'exercice des activités minières." },
    ],
  },
  // ── Chapitre IV ────────────────────────────────────────────────────────────
  {
    id: "art68", numero: "68", titre: "Conditions d'octroi du permis d'exploitation",
    sectionId: "s4_1", chapitreId: "ch4",
    introduction: "Le permis d'exploitation est accordé sous les conditions suivantes :",
    keywords: ["permis", "exploitation", "conditions", "titulaire"],
    paragraphes: [
      { id: "p68_1", numero: "1", ordre: 1, contenu: "Le demandeur doit être titulaire d'un permis de recherche ayant conduit à la découverte d'un gisement économiquement exploitable." },
      { id: "p68_2", numero: "2", ordre: 2, contenu: "Le demandeur doit démontrer ses capacités techniques et financières pour mener l'exploitation." },
      { id: "p68_3", numero: "3", ordre: 3, contenu: "Le demandeur doit remplir toutes les conditions prévues par le présent Code et ses mesures d'exécution." },
    ],
  },
  {
    id: "art69", numero: "69", titre: "Durée et renouvellement",
    sectionId: "s4_2", chapitreId: "ch4",
    introduction: "Le permis d'exploitation est soumis aux règles suivantes concernant sa durée :",
    keywords: ["durée", "renouvellement", "validité", "25 ans"],
    paragraphes: [
      { id: "p69_1", numero: "1", ordre: 1, contenu: "Le permis d'exploitation est accordé pour une durée maximale de vingt-cinq (25) ans." },
      { id: "p69_2", numero: "2", ordre: 2, contenu: "Il est renouvelable par périodes successives de quinze (15) ans, sous réserve du respect des obligations légales." },
      { id: "p69_3", numero: "3", ordre: 3, contenu: "La demande de renouvellement doit être introduite au moins six (6) mois avant l'expiration du titre en cours." },
    ],
  },
  // ── Chapitre V ─────────────────────────────────────────────────────────────
  {
    id: "art220", numero: "220", titre: "Régime fiscal",
    sectionId: "s5_1", chapitreId: "ch5",
    introduction: "Les titulaires de droits miniers sont soumis aux obligations fiscales ci-après :",
    keywords: ["fiscal", "redevance", "taxes", "droits superficiaires"],
    paragraphes: [
      { id: "p220_1", numero: "1", ordre: 1, contenu: "Le régime fiscal de droit commun, sous réserve des dispositions particulières du présent Code." },
      { id: "p220_2", numero: "2", ordre: 2, contenu: "La redevance minière, calculée sur la valeur marchande des substances minérales extraites." },
      { id: "p220_3", numero: "3", ordre: 3, contenu: "Les droits superficiaires annuels par carré cadastral, dont le montant est fixé par voie réglementaire." },
      { id: "p220_4", numero: "4", ordre: 4, contenu: "Les taxes à l'exportation conformément aux dispositions légales et réglementaires en vigueur." },
    ],
  },
  // ── Titre XVI — Chapitre III ───────────────────────────────────────────────
  {
    id: "art_331", numero: "331", titre: "De la faculté de maintenir les partenariats conclus avec l'État",
    sectionId: "s_p3_1", chapitreId: "ch_p3",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["partenariats", "État", "abrogé"],
    paragraphes: [],
  },
  {
    id: "art_332", numero: "332", titre: "Des reconductions des droits miniers ou de carrières",
    sectionId: "s_p3_1", chapitreId: "ch_p3",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["reconduction", "droits miniers", "carrières", "abrogé"],
    paragraphes: [],
  },
  {
    id: "art_333", numero: "333", titre: "De l'établissement de nouveaux titres",
    sectionId: "s_p3_1", chapitreId: "ch_p3",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["nouveaux titres", "abrogé"],
    paragraphes: [],
  },
  // ── Titre XVI — Chapitre IV, Section I ────────────────────────────────────
  {
    id: "art_334", numero: "334", titre: "Des modalités d'application de la présente loi",
    sectionId: "s_p4_1", chapitreId: "ch_p4",
    modification: "modifié par l'article 16 de la Loi n° 18/001 du 09 mars 2018",
    keywords: ["modalités", "application", "règlement minier", "décrets", "90 jours"],
    paragraphes: [
      {
        id: "p334_1", numero: "Al. 1", ordre: 1,
        contenu: "Les modalités d'application des dispositions du présent Code sont fixées par le Règlement minier tel que modifié et complété et par d'autres décrets d'application pris dans les 90 jours suivant la promulgation de la présente loi.",
      },
      {
        id: "p334_2", numero: "Al. 2", ordre: 2,
        contenu: "En attendant la publication des mesures prévues à l'alinéa précédent du présent article, les modalités d'application urgentes peuvent être prises par voie d'arrêté ministériel ou interministériel, le cas échéant.",
      },
      {
        id: "p334_3", numero: "Al. 3", ordre: 3,
        contenu: "Les modalités d'application du présent Code sont fixées par le Règlement Minier révisé, tel que modifié et complété et par d'autres décrets d'application pris dans les 90 jours suivant la promulgation de la Loi n° 18/001 du 09 mars 2018. En attendant la publication du Règlement Minier révisé, les modalités d'application urgentes pouvaient être prises par Arrêté Ministériel ou Interministériel, le cas échéant.",
      },
    ],
  },
  {
    id: "art_335", numero: "335",
    titre: "De la suspension des demandes des droits miniers et de carrières, des cartes d'exploitation artisanale et d'agrément",
    sectionId: "s_p4_1", chapitreId: "ch_p4",
    modification: "modifié par l'article 16 de la Loi n° 18/001 du 09 mars 2018",
    keywords: ["suspension", "demandes", "droits miniers", "règlement minier révisé", "commission ad hoc"],
    paragraphes: [
      {
        id: "p335_1", numero: "Al. 1", ordre: 1,
        contenu: "Les nouvelles demandes d'octroi de droits miniers et de carrières de recherches, des cartes d'exploitant artisanal et de négociant ainsi que les demandes d'agrément au titre de comptoirs d'achat et de vente des substances minérales, des entités de traitement, des coopératives minières agréées sont suspendues pendant la période qui court de la promulgation de la présente loi à l'entrée en vigueur du Règlement minier révisé.",
      },
      {
        id: "p335_2", numero: "Al. 2", ordre: 2,
        contenu: "Les demandes d'octroi des droits miniers ou de carrières d'exploitation, les demandes de renouvellement, de mutations, d'amodiation, d'extension, de sûretés relatives aux droits miniers ou des carrières en cours de validité, la réalisation de tous autres actes et procédés juridiques concernant de tels droits se font au cours de la période visée à l'alinéa précédent conformément aux dispositions du présent Code et des autres règlements en vigueur.",
      },
      {
        id: "p335_3", numero: "Al. 3", ordre: 3,
        contenu: "Au cours de la période visée par le premier alinéa du présent article, une commission ad hoc instituée par le ministre procède à l'inventaire des gisements miniers dont les droits miniers et des carrières ont été versés dans le domaine public conformément aux dispositions du présent Code.",
        note: "Le Législateur suspend, entre le 09 mars 2018 et l'entrée en vigueur du Règlement Minier révisé (08 juin 2018), toutes les nouvelles demandes de droits miniers et de carrières, des cartes d'exploitation artisanale et de négociant ainsi que les demandes d'agrément. Les demandes introduites avant le 09 mars 2018 se déroulent conformément aux versions 2002 du Code Minier et 2003 du Règlement Minier. Enfin, le Législateur instruit le Ministre des Mines de mettre en place une commission ad hoc chargée de l'inventaire des gisements miniers versés dans le domaine public.",
      },
    ],
  },
  // ── Titre XVI — Chapitre IV, Section II ───────────────────────────────────
  {
    id: "art_336", numero: "336", titre: "De la validation des droits miniers et de carrières en vigueur",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["validation", "droits miniers", "abrogé"],
    paragraphes: [],
  },
  {
    id: "art_337", numero: "337", titre: "De la procédure de validation des droits miniers et de carrières en vigueur",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["procédure", "validation", "abrogé"],
    paragraphes: [],
  },
  {
    id: "art_338", numero: "338", titre: "De la commission de validation des droits miniers et de carrières",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["commission", "validation", "abrogé"],
    paragraphes: [],
  },
  {
    id: "art_339", numero: "339", titre: "De la transformation des droits miniers ou de carrières existants",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["transformation", "droits existants", "abrogé"],
    paragraphes: [],
  },
  {
    id: "art_340", numero: "340", titre: "De la validité des conventions minières",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "modifié par l'article 16 de la Loi n° 18/001 du 09 mars 2018",
    keywords: ["conventions minières", "régime conventionnel", "application immédiate"],
    paragraphes: [
      {
        id: "p340_1", numero: "Al. 1", ordre: 1,
        contenu: "Toutes les conventions minières en vigueur à la promulgation de la présente loi sont régies par les dispositions du présent Code.",
        note: "Le Législateur abolit le régime conventionnel et opte pour l'application immédiate des dispositions du présent Code. Ainsi, tous les titulaires sont soumis à l'ensemble des obligations, notamment celles liées au maintien de validité de leurs droits à peine de déchéance.",
      },
    ],
  },
  {
    id: "art_341", numero: "341", titre: "De l'agrément des Mandataires en mines et carrières",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["agrément", "mandataires", "mines", "abrogé"],
    paragraphes: [],
  },
  {
    id: "art_342", numero: "342", titre: "Des droits miniers et des carrières se trouvant dans le cas de force majeure",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["force majeure", "droits miniers", "abrogé"],
    paragraphes: [],
  },
  // ── Titre XVI — Chapitre IV, Section III ──────────────────────────────────
  {
    id: "art_342bis", numero: "342 bis", titre: "De la garantie de stabilité",
    sectionId: "s_p4_3", chapitreId: "ch_p4",
    modification: "inséré par l'article 30 de la Loi n° 18/001 du 09 mars 2018",
    keywords: ["garantie", "stabilité", "régime fiscal", "douanier", "change", "5 ans"],
    paragraphes: [
      {
        id: "p342b_1", numero: "Al. 1", ordre: 1,
        contenu: "Les dispositions de la présente loi sont d'application immédiate à l'ensemble des titulaires des droits miniers valides à la date de son entrée en vigueur.",
      },
      {
        id: "p342b_2", numero: "Al. 2", ordre: 2,
        contenu: "En cas de modification législative dans les cinq ans à dater de l'entrée en vigueur du présent Code, les titulaires des droits miniers visés à l'alinéa précédent bénéficient de la garantie de stabilité du régime fiscal, douanier et de change du présent Code.",
        note: "Le Législateur garantit la stabilité du régime fiscal, douanier et de change du présent Code, en cas de modification législative dans les cinq (05) ans à dater de l'entrée en vigueur du présent Code révisé. Dès lors, une révision au-delà de ce terme est directement et indistinctement applicable à tous. Il convient de noter que cet article figure dans la version coordonnée du Journal Officiel comme étant l'article 342 et non 342 bis.",
      },
    ],
  },
  {
    id: "art_342ter", numero: "342 ter",
    titre: "Du délai d'application de l'obligation de traitement et de transformation en RDC pour les titulaires actuels des droits miniers",
    sectionId: "s_p4_3", chapitreId: "ch_p4",
    modification: "inséré par l'article 30 de la Loi n° 18/001 du 09 mars 2018",
    keywords: ["traitement", "transformation", "délai", "trois ans", "RDC", "Parlement"],
    paragraphes: [
      {
        id: "p342t_1", numero: "Al. 1", ordre: 1,
        contenu: "Les titulaires des droits miniers en cours de validité disposent d'un délai de trois ans pour procéder, sur le territoire de la République Démocratique du Congo, au traitement et à la transformation des substances minérales par eux exploitées.",
      },
      {
        id: "p342t_2", numero: "Al. 2", ordre: 2,
        contenu: "Le délai prévu à l'alinéa premier du présent article ne peut être réduit ou prorogé que par une modification de la présente disposition par les deux chambres du Parlement.",
      },
      {
        id: "p342t_3", numero: "Al. 3", ordre: 3,
        contenu: "La présente disposition produit ses effets dès l'entrée en vigueur de la présente loi.",
        note: "Le Législateur accorde un délai de trois (03) ans aux titulaires des droits miniers pour procéder, sur le territoire de la RDC, au traitement et à la transformation des substances minérales par eux exploitées, à dater du 09 mars 2018. Cette disposition est à combiner avec les articles 108 bis à 108 quater. Il convient de noter que cet article figure dans la version coordonnée du Journal Officiel comme étant l'article 342 bis et non 342 ter.",
      },
    ],
  },
  // ── Titre XVII ─────────────────────────────────────────────────────────────
  {
    id: "art_343", numero: "343", titre: "Des dispositions abrogatoires",
    sectionId: "s_p17_1", chapitreId: "ch_p17",
    introduction: "Sont abrogées à la date, selon le cas, de la promulgation ou de l'entrée en vigueur de la présente loi :",
    keywords: ["dispositions abrogatoires", "abrogation", "ordonnance-loi", "décrets abrogés"],
    paragraphes: [
      { id: "p343_a", numero: "a", ordre: 1, contenu: "Ordonnance-Loi n°81-013 du 2 avril 1981 portant législation générale sur les mines et les hydrocarbures telle que modifiée et complétée à ce jour, à l'exception des dispositions applicables aux hydrocarbures, et sauf en ce qui concerne les conventions minières dûment signées et approuvées à la promulgation du présent Code." },
      { id: "p343_b", numero: "b", ordre: 2, contenu: "L'article 4 de la Loi n°77-027 du 17 novembre 1977 portant mesures générales de rétrocession des biens zaïrianisés ou radicalisés en ce qui concerne les mines et les carrières." },
      { id: "p343_c", numero: "c", ordre: 3, contenu: "La Loi n°74-019 du 15 septembre 1974 portant création d'une brigade minière." },
      { id: "p343_d", numero: "d", ordre: 4, contenu: "L'Ordonnance-Loi n°72-005 du 14 janvier 1972 tendant à renforcer la protection de certaines substances contre le vol." },
      { id: "p343_e", numero: "e", ordre: 5, contenu: "L'Ordonnance n°84-082 du 30 mars 1984 portant règlement des activités des comptoirs d'achat des substances minérales précieuses." },
      { id: "p343_f", numero: "f", ordre: 6, contenu: "Le Décret n°0012 du 22 janvier 1997 instituant un nouveau tarif des droits et taxes à l'importation en ce qui concerne les mines et carrières." },
      { id: "p343_g", numero: "g", ordre: 7, contenu: "Le Décret n°121 du 11 septembre 1998 portant création d'un service public à caractère social dénommé Service d'Achats des Substances Minérales Précieuses « S.A.S.M.I.P. » et ses mesures d'exécution." },
      { id: "p343_h", numero: "h", ordre: 8, contenu: "La Loi n°78-017 du 11 juillet 1978, en ce qui concerne les emprunts destinés à financer les activités minières des sociétés privées dans le cadre de la jouissance de leurs droits miniers." },
      { id: "p343_i", numero: "i", ordre: 9, contenu: "Toutes dispositions légales et réglementaires contraires aux dispositions du présent Code." },
    ],
  },
  {
    id: "art_344", numero: "344", titre: "De l'entrée en vigueur du présent Code minier",
    sectionId: "s_p17_1", chapitreId: "ch_p17",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018. Fait à Lubumbashi, le 11 juillet 2002, modifiée et complétée à Kinshasa, le 09 mars 2018.",
    keywords: ["entrée en vigueur", "abrogé", "Lubumbashi", "Kinshasa", "2002", "2018"],
    paragraphes: [],
  },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Début du seed — Code Minier…")

  // Nettoyage préalable (ordre inverse des dépendances)
  await prisma.codeMinierParagraphe.deleteMany()
  await prisma.codeMinierArticle.deleteMany()
  await prisma.codeMinierSection.deleteMany()
  await prisma.codeMinierChapitre.deleteMany()
  console.log("🗑️  Tables vidées")

  // 1. Chapitres
  for (const ch of chapitresData) {
    await prisma.codeMinierChapitre.create({ data: { id: ch.id, numero: ch.numero, titre: ch.titre } })
  }
  console.log(`✅ ${chapitresData.length} chapitres insérés`)

  // 2. Sections
  for (const sec of sectionsData) {
    await prisma.codeMinierSection.create({
      data: { id: sec.id, numero: sec.numero, titre: sec.titre, chapitreId: sec.chapitreId },
    })
  }
  console.log(`✅ ${sectionsData.length} sections insérées`)

  // 3. Articles + paragraphes
  let totalParagraphes = 0
  for (const art of articlesData) {
    const { paragraphes, ...artData } = art
    await prisma.codeMinierArticle.create({
      data: {
        id: artData.id,
        numero: artData.numero,
        titre: artData.titre,
        sectionId: artData.sectionId,
        chapitreId: artData.chapitreId,
        modification: artData.modification ?? null,
        introduction: artData.introduction ?? null,
        contenu: artData.contenu ?? null,
        keywords: artData.keywords,
      },
    })
    for (const para of paragraphes) {
      await prisma.codeMinierParagraphe.create({
        data: {
          id: para.id,
          numero: para.numero,
          contenu: para.contenu,
          note: para.note ?? null,
          ordre: para.ordre ?? 0,
          articleId: artData.id,
        },
      })
      totalParagraphes++
    }
  }
  console.log(`✅ ${articlesData.length} articles insérés avec ${totalParagraphes} paragraphes`)

  console.log("\n🎉 Seed terminé avec succès !")
  console.log(`   Chapitres   : ${chapitresData.length}`)
  console.log(`   Sections    : ${sectionsData.length}`)
  console.log(`   Articles    : ${articlesData.length}`)
  console.log(`   Paragraphes : ${totalParagraphes}`)
}

main()
  .catch((e) => { console.error("❌ Erreur :", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect(); await pool.end() })
