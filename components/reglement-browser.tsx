"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  BookOpen,
  ChevronRight,
  Menu,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/use-role";
import { canAdd, canEdit, canDelete } from "@/lib/permissions";
import {
  exportArticlePdf,
  exportChapitrePdf,
} from "@/lib/pdf-export";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Paragraphe {
  id: string;
  numero: string;
  contenu: string;
  note?: string;
}

interface Article {
  id: string;
  numero: string;
  titre: string;
  chapitreId: string;
  titreId: string;
  paragraphes: Paragraphe[];
  keywords: string[];
}

interface Chapitre {
  id: string;
  numero: string;
  titre: string;
  titreId: string;
}

interface Titre {
  id: string;
  numero: string;
  titre: string;
}

type ArticleSaveData = Omit<Article, "id">;

// ─── Données initiales ────────────────────────────────────────────────────────

const initialTitres: Titre[] = [
  { id: "t1", numero: "Ier", titre: "DES GENERALITES" },
];

const initialChapitres: Chapitre[] = [
  {
    id: "ch1",
    numero: "I",
    titre: "DU CHAMP D'APPLICATION ET DES DEFINITIONS DES TERMES",
    titreId: "t1",
  },
];

const initialArticles: Article[] = [
  {
    id: "art1",
    numero: "1er",
    titre: "Du champ d'application",
    chapitreId: "ch1",
    titreId: "t1",
    paragraphes: [
      {
        id: "p1_1",
        numero: "",
        contenu:
          "Le présent Décret fixe les modalités et les conditions d'application de la loi n°007/2002 du 11 Juillet 2002 portant Code minier telle que modifiée et complétée par la Loi n°18/001 du 09 Mars 2018.",
      },
      {
        id: "p1_2",
        numero: "",
        contenu:
          "Il réglemente en outre les matières connexes non expressément prévues, définies ou réglées par les dispositions de la loi n°007/2002 du 11 Juillet 2002 portant Code minier telle que modifiée et complétée par la Loi n°18/001 du 09 Mars 2018.",
      },
    ],
    keywords: [
      "champ d'application",
      "loi",
      "code minier",
      "modalités",
      "conditions",
    ],
  },
  {
    id: "art2",
    numero: "2",
    titre: "Des définitions des termes",
    chapitreId: "ch1",
    titreId: "t1",
    paragraphes: [
      {
        id: "p2_1",
        numero: "",
        contenu:
          "Outre les définitions des termes repris dans la loi n°007/2002 du 11 Juillet 2002 portant Code minier telle que modifiée et complétée par la Loi n°18/001 du 09 Mars 2018 qui gardent le même sens dans le présent Décret, on entend par :",
      },
      {
        id: "p2_2",
        numero: "•",
        contenu:
          "Administration des douanes : administration ou organisme public chargé de l'application de la législation douanière et de la perception des droits et taxes à l'importation et à l'exportation et qui est également chargé de l'application d'autres lois et règlements relatifs à l'importation et à l'exportation ;",
      },
      {
        id: "p2_3",
        numero: "•",
        contenu:
          "Administration des Mines : l'Administration des Mines comprend le Secrétariat général, les directions, les divisions et autres services administratifs du ministère en charge des mines, y compris ceux qui interviennent dans l'administration du Code minier et de toutes ses mesures d'application. Ils sont régis conformément aux textes légaux et réglementaires en vigueur relatifs à l'Administration publique. Les directions techniques qui interviennent dans le processus de l'octroi des droits miniers et/ou de carrières sont : - la Direction de Géologie ; - la Direction des Mines ; - la Direction de Protection de l'Environnement Minier ; - la Direction des Carrières ;",
      },
      {
        id: "p2_4",
        numero: "•",
        contenu:
          "Aire protégée : toute aire géographique délimitée en surface et constituant un parc national, un domaine de chasse, un jardin zoologique et/ou botanique ou encore un secteur sauvegardé ;",
      },
      {
        id: "p2_5",
        numero: "•",
        contenu:
          "Autorité de certification : les autorités administratives habilitées à contrôler, valider et délivrer le Certificat d'origine, à savoir le Ministre et le Directeur général du CEEC. En l'absence du Ministre, le Vice-Ministre ou le Secrétaire Général agissent en ses lieu et place ;",
      },
      {
        id: "p2_6",
        numero: "•",
        contenu:
          "Autorité d'importation ou Autorité importatrice: organisme officiel de régulation ou de contrôle du pays vers lequel les produits sont exportés;",
      },
      {
        id: "p2_7",
        numero: "•",
        contenu:
          "Bureau d'études géologiques : cabinet qui réalise l'ensemble des études de recherches visant à démontrer l'existence d'un gisement et la faisabilité ou non de sa mise en exploitation. Ce Bureau intègre les branches de recherches et développement des gisements miniers, des études techniques portant sur l'extraction minière, les traitements minéralurgiques et métallurgiques ainsi que les études économico-financières portant sur le projet minier ;",
      },
      {
        id: "p2_8",
        numero: "•",
        contenu:
          "Cadastre Minier central : la Direction Générale du Cadastre Minier ;",
      },
      {
        id: "p2_9",
        numero: "•",
        contenu:
          "Cadastre Minier provincial : la Direction provinciale du Cadastre Minier ;",
      },
      {
        id: "p2_10",
        numero: "•",
        contenu:
          "Cahier des charges : ensemble d'engagements périodiques négociés et pris entre le titulaire de droit minier d'exploitation ou de l'autorisation d'exploitation de carrière permanente et les communautés locales affectées par le projet minier, pour la réalisation des projets de développement communautaire durable, au sens de l'article 285 septies du Code minier ;",
      },
      {
        id: "p2_11",
        numero: "•",
        contenu:
          "Carré : l'unité cadastrale minimum octroyable, de caractère indivisible, délimitée par les méridiens et les parallèles du système des coordonnées de la carte de retombes minières, ayant une superficie de 84,95 Ha;",
      },
      {
        id: "p2_12",
        numero: "•",
        contenu:
          "Code minier : la loi n°007/2002 du 11 Juillet 2002 portant Code minier telle que modifiée et complétée par la Loi n°18/001 du 09 Mars 2018 dont le champ d'application couvre les mines et les carrières ;",
      },
      {
        id: "p2_13",
        numero: "•",
        contenu:
          "Compensation : remplacement en nature de certains biens spécifiques, notamment les logements et autres biens immeubles perdus par les communautés affectées par les activités du projet minier ;",
      },
      {
        id: "p2_14",
        numero: "•",
        contenu:
          "Concentration : le processus par lequel les substances minérales sont séparées de la gangue et rassemblées de façon à augmenter la teneur en éléments valorisables en vue d'obtenir un produit marchand ;",
      },
      {
        id: "p2_15",
        numero: "•",
        contenu:
          "Contrat : - le texte intégral de tout contrat, concession, ou autre accord conclu par ou avec le gouvernement congolais et fixant les conditions d'exploitation de ressources minières; - le texte intégral de tout addenda, annexe ou avenant fixant les détails relatifs aux droits d'exploitation mentionnés au point a ou à leur exécution ; - le texte intégral de toute modification ou de tout amendement des documents décrits aux points a et b ;",
      },
      {
        id: "p2_16",
        numero: "•",
        contenu:
          "Déplacement des populations : délocalisation des populations due au besoin de l'exploitation minière pouvant impliquer la perte de l'environnement naturel, du patrimoine culturel et matériel ;",
      },
      {
        id: "p2_17",
        numero: "•",
        contenu:
          "Développement durable : toute approche de la croissance ayant pour objectif principal de concilier le progrès économique et social avec la préservation de l'environnement en vue d'assurer le progrès actuel sans compromettre celui des générations futures ;",
      },
      {
        id: "p2_18",
        numero: "•",
        contenu:
          "Direction chargée de la Protection de l'Environnement Minier : service chargé de la Protection de l'Environnement Minier ;",
      },
      {
        id: "p2_19",
        numero: "•",
        contenu:
          "Droit de carrières de recherches: l'Autorisation de Recherches des produits de carrières ;",
      },
      {
        id: "p2_20",
        numero: "•",
        contenu:
          "Droit de carrières d'exploitation : l'Autorisation d'Exploitation de Carrières Permanente et l'Autorisation d'Exploitation de Carrières Temporaire ;",
      },
      {
        id: "p2_21",
        numero: "•",
        contenu: "Droit minier de recherches : le Permis de Recherches ;",
      },
      {
        id: "p2_22",
        numero: "•",
        contenu:
          "Droit minier d'exploitation : le Permis d'Exploitation, le Permis d'Exploitation des Rejets ou le Permis d'Exploitation de Petite Mine;",
      },
      {
        id: "p2_23",
        numero: "•",
        contenu:
          "Erreur manifeste : une erreur évidente qui apparaît sans analyse ;",
      },
      {
        id: "p2_24",
        numero: "•",
        contenu:
          "Entités Territoriales Décentralisées : les entités territoriales dotées de la personnalité en vertu de la constitution et de la loi ;",
      },
      {
        id: "p2_25",
        numero: "•",
        contenu:
          "Indemnisation : paiement effectué par le titulaire et, le cas échéant, l'entité de traitement ou de transformation en faveur de la personne affectée pour la perte d'un bien matériel ou immatériel ou en réparation d'un préjudice physique ou moral ;",
      },
      {
        id: "p2_26",
        numero: "•",
        contenu:
          "Industrie Extractive : Toute unité d'extraction, de transformation et de commercialisation œuvrant dans le secteur des mines conformément au Code minier et ses mesures d'application. Il s'agit des titulaires des droits miniers d'exploitation et de petite mine, des coopératives minières, des négociants, des comptoirs agréés, des marchés boursiers ainsi que des centres de négoces ;",
      },
      {
        id: "p2_27",
        numero: "•",
        contenu:
          "Matériaux de construction à usage courant : toutes substances minérales non métalliques de faible valeur, classées en carrières et utilisées dans l'industrie du bâtiment comme matériaux ordinaires non décoratifs, exploitées intensivement ou à petite échelle, tels qu'énumérés par voie règlementaire. Il s'agit notamment de : - argiles à brique ; - sables ; - grès ; - calcaire à moellon ; - marne ; - quartzite ; - craie ; - gravier alluvionnaire ; - latérites ; - basaltes ;",
      },
      {
        id: "p2_28",
        numero: "•",
        contenu:
          "Milieu sensible : le milieu ambiant ou écosystème dont les caractéristiques le rendent particulièrement vulnérable aux impacts négatifs des opérations des mines ou de carrières, conformément à l'annexe XI du présent Décret ;",
      },
      {
        id: "p2_29",
        numero: "•",
        contenu:
          "Minéraux industriels : les substances minérales classées en carrières et utilisées comme intrants dans l'industrie légère ou lourde. Il s'agit notamment de : - gypse ; - kaolin ; - dolomie ; - calcaire à ciment ; - sables de verrerie ; - fluorine ; - diatomites ; - montmorillonite ; - barytine ; - Calcaire à chaux.",
      },
      {
        id: "p2_30",
        numero: "•",
        contenu:
          "Mine distincte : mine distincte d'une autre mine existante et de ce fait nouvelle, qui fait l'objet d'un nouveau droit minier d'exploitation ou d'un contrat d'amodiation, dès lors qu'elle concerne un gisement distinct nécessitant des méthodes d'exploitation et des procédés de traitement séparés ainsi que des moyens de production nettement individualisés, ou du fait de leur éloignement ou de leurs conditions d'exploitation, nécessitant la création d'installations minières distinctes ;",
      },
      {
        id: "p2_31",
        numero: "•",
        contenu:
          "Moyen le plus rapide et le plus fiable : le moyen de communication qui permet la transmission la plus rapide de l'information écrite par l'expéditeur au destinataire sans distorsion du contenu et avec confirmation de réception, notamment fax et courrier électronique ;",
      },
      {
        id: "p2_32",
        numero: "•",
        contenu:
          "Partie prenante : Acteur ou groupe d'acteurs impliqués ou ayant des intérêts dans le secteur minier, notamment le gouvernement, les industries extractives du secteur minier ainsi que de la société civile, partenaire dans le cadre de l'ITIE ou de toute autre initiative similaire ;",
      },
      {
        id: "p2_33",
        numero: "•",
        contenu:
          "Pays de destination : Pays de destination finale de tout lot des substances minérales et/ou produits miniers marchands exportés de la République Démocratique du Congo ;",
      },
      {
        id: "p2_34",
        numero: "•",
        contenu:
          "Pays de transit : c'est l'ensemble des pays à travers lesquels tout lot des substances minérales et/ou produits miniers marchands exportés de la République Démocratique du Congo traverse avant d'arriver au pays de destination finale ;",
      },
      {
        id: "p2_35",
        numero: "•",
        contenu:
          "Poste frontalier : le poste placé sur un point de la frontière séparant deux Etats.",
      },
      {
        id: "p2_36",
        numero: "•",
        contenu:
          "Poste frontière : le poste à l'intérieur du territoire national qui enregistre les mouvements, soit vers d'autres postes de l'intérieur, soit de l'extérieur vers l'intérieur ou de l'intérieur vers l'extérieur ;",
      },
      {
        id: "p2_37",
        numero: "•",
        contenu:
          "Plan d'Ajustement Environnemental : la description de l'état du lieu d'implantation de l'opération minière et de ses environs à la date de la publication du présent Décret ainsi que des mesures de protection de l'environnement déjà réalisées ou envisagées et de leur mise en œuvre progressive. Ces mesures visent l'atténuation des impacts négatifs de l'opération minière sur l'environnement et la réhabilitation du lieu d'implantation et de ses environs en conformité avec les directives et normes environnementales applicables pour le type d'opération minière concerné ;",
      },
      {
        id: "p2_38",
        numero: "•",
        contenu:
          "Personne publique : toute personne morale de droit public constituant, aux termes de la loi, une entité dotée de la personnalité juridique ou un service public personnalisé ;",
      },
      {
        id: "p2_39",
        numero: "•",
        contenu:
          "PGES, Plan de Gestion Environnementale et Sociale : le programme de mise en œuvre et de suivi des mesures envisagées par l'EIES pour atténuer et le cas échéant supprimer les conséquences dommageables du projet minier sur l'environnement, réhabiliter les sites affectés par le projet minier, indemniser, compenser et réinstaller les personnes affectées par le projet minier. Ces documents contiennent : - la description du milieu ambiant ; - la description des travaux de mines ou de carrières considérés ; - l'analyse des impacts des opérations de mines ou de carrières sur ce milieu ambiant ; - les mesures d'atténuation et de réhabilitation; - l'engagement à respecter les termes du plan et de mettre en œuvre les mesures d'atténuation et de réhabilitation proposées ;",
      },
      {
        id: "p2_40",
        numero: "•",
        contenu:
          "Pleine concurrence : principe selon lequel les prix pratiqués pour des transactions entre sociétés affiliées ou toutes autres conditions convenues qui s'appliquent auxdites transactions, doivent être établis par référence aux prix pratiqués sur le marché par des entreprises indépendantes ;",
      },
      {
        id: "p2_41",
        numero: "•",
        contenu:
          "Projet ou Projet minier : tout projet mis sur pied par le titulaire, visant une ou plusieurs activités minières ou de carrières, en vue de la découverte ou de l'exploitation d'un gisement et la commercialisation des produits marchands ;",
      },
      {
        id: "p2_42",
        numero: "•",
        contenu:
          "Projet minier d'exploitation : projet mis sur pied par le titulaire d'un droit minier d'exploitation visant l'exploitation soit d'une ou plusieurs mines se trouvant dans le même périmètre minier soit d'une mine distincte ;",
      },
      {
        id: "p2_43",
        numero: "•",
        contenu:
          "Projet minier de recherches : tout projet mis sur pied par le titulaire d'un ou de plusieurs droits miniers de recherches visant la recherche d'une ou plusieurs substances minérales ;",
      },
      {
        id: "p2_44",
        numero: "•",
        contenu:
          "Quotité : la part minimale des recettes d'exportation que tout titulaire des droits miniers et des Autorisations d'Exploitation des Carrières Permanente de production de ciment, qui est en phase d'amortissement de ses investissements, a l'obligation de rapatrier au pays dans le délai règlementaire ou à garder à l'étranger dans son compte principal ;",
      },
      {
        id: "p2_45",
        numero: "•",
        contenu:
          "Règles de l'art des mines : ensemble de mesures, conditions techniques, méthodes de recherches, d'exploitation ainsi que des procédés des traitements minéralurgiques et métallurgiques requis servant à valoriser le gisement et optimiser le rendement global d'extraction dans le respect des règles de sécurité, d'hygiène et de protection de l'environnement ;",
      },
      {
        id: "p2_46",
        numero: "•",
        contenu:
          "Réinstallation : processus de relocalisation des communautés affectées par le déplacement dû aux activités minières ;",
      },
      {
        id: "p2_47",
        numero: "•",
        contenu:
          "Service chargé de l'Administration du Code minier : tout service chargé, conformément à ses attributions, de l'application d'une ou des dispositions du Code minier et de ses mesures d'application ;",
      },
      {
        id: "p2_48",
        numero: "•",
        contenu:
          'Services techniques spécialisés : les services techniques créés par les pouvoirs publics pour intervenir dans la gestion du secteur minier tels que : - la Cellule Technique de Coordination et de Planification Minière « C.T.C.P.M.» ; - le Centre d\'Evaluation, d\'Expertise et de Certification des substances minérales précieuses et semi-précieuses « CEEC » ; - le Service d\'Assistance et d\'Encadrement de l\'Exploitation Minière Artisanale et à Petite échelle " SAEMAPE" ; - le Cadastre Minier "CAMI" ; - Service Géologique National du Congo "SGNC" ;',
      },
      {
        id: "p2_49",
        numero: "•",
        contenu:
          "Site minier : tout gisement couvert par un titre minier conféré à un particulier ou toute zone ouverte à l'exploitation minière artisanale ;",
      },
      {
        id: "p2_50",
        numero: "•",
        contenu:
          "Sous-traitant : toute personne qui contracte directement avec le titulaire des droits miniers ou des carrières, en application des articles 1er, point 48, 108 quinquies et 219 du Code minier ;",
      },
      {
        id: "p2_51",
        numero: "•",
        contenu:
          "Terrain constituant une rue, une route, une autoroute : tout espace établi par l'autorité administrative compétente comme constituant une rue, y compris les côtés sur une distance de cinq mètres de part et d'autre de la rue ; toute zone établie par l'autorité administrative compétente comme constituant une route, y compris les côtés sur une distance de vingt mètres de part et d'autre de la route ; et toute zone établie par l'autorité administrative compétente comme constituant une autoroute, y compris les côtés sur une distance de cinquante mètres de part et d'autre de l'autoroute ;",
      },
      {
        id: "p2_52",
        numero: "•",
        contenu:
          "Terrain contenant des vestiges archéologiques ou un monument national : tout espace terrestre institué par toute autorité administrative compétente en zone contenant des vestiges archéologiques ou un monument national ;",
      },
      {
        id: "p2_53",
        numero: "•",
        contenu:
          "Terrain faisant partie d'un aéroport ou zone aéroportuaire : tout espace établi et reconnu par l'autorité administrative compétente comprenant toutes les installations nécessaires au fonctionnement d'un aéroport, y compris les installations d'embarquement, les terminaux, les pistes, les routes d'accès et les parkings ;",
      },
      {
        id: "p2_54",
        numero: "•",
        contenu:
          "Terrain proche des installations de la Défense Nationale : tout espace terrestre situé à moins de mille mètres d'une installation de la Défense Nationale identifiée comme telle par des clôtures et/ou des panneaux d'avertissement ;",
      },
      {
        id: "p2_55",
        numero: "•",
        contenu:
          "Terrain réservé à la pépinière pour forêt ou à la plantation des forêts : tout espace réservé par l'autorité administrative compétente à la pépinière pour forêt ou à la plantation des forêts, selon les procédures administratives en vigueur ;",
      },
      {
        id: "p2_56",
        numero: "•",
        contenu:
          "Terrain réservé au cimetière : tout espace terrestre réservé par l'autorité administrative compétente à l'enterrement des morts ;",
      },
      {
        id: "p2_57",
        numero: "•",
        contenu:
          "Terrain réservé au projet de chemin de fer : toute portion de terre réservée, par l'autorité administrative compétente, à un projet de chemin de fer, selon les procédures administratives en vigueur ;",
      },
      {
        id: "p2_58",
        numero: "•",
        contenu:
          "Transparence : ensemble de règles, mécanismes et pratiques rendant obligatoires les déclarations et les publications, de la part de l'Etat et des entreprises extractives, en particulier celles de l'industrie minière, des revenus et paiements de tout genre, comprenant, notamment les revenus des exploitations et des transactions minières, la publication des statistiques de production et de vente, la publication des contrats et la divulgation des propriétaires réels des actifs miniers ainsi que les données sur l'allocation des ressources provenant du secteur minier. Elle s'étend également au respect des obligations de procédures d'acquisition et d'aliénation des droits miniers ;",
      },
      {
        id: "p2_59",
        numero: "•",
        contenu:
          "Travaux de développement et de construction : ensemble d'opérations comprenant les travaux d'accès au gisement, des travaux préparatoires de la mine, d'extraction minière de roulage, de stockage ainsi que d'implantation des installations des traitements minéralurgiques et métallurgiques, en ce compris, les travaux de construction d'immeubles par incorporation et par destination, situés dans le périmètre minier ou affectés à l'exploitation minière, ainsi que les travaux directement liés à la mise en route du projet minier ;",
      },
      {
        id: "p2_60",
        numero: "•",
        contenu:
          "Travaux d'infrastructures : activités de mise en place des infrastructures d'appui à la production minière notamment les : - installations de desserte d'eau industrielle, d'électricité et de gaz ; - installations de production de vapeur, installations de séchage des minerais et des produits marchands ; - installations de stockage et de distribution de carburant ; - installations de transport et voies de communication dans le périmètre minier ou des carrières comprenant notamment des routes d'accès à la mine ou à la carrière et d'évacuation des minerais et produits miniers, des pistes d'atterrissage, chemin de fer, port minéralier, équipements de téléphonie dans les sites miniers, équipements de télé contrôle de processus, garages pour engins miniers ; - ateliers de rénovation et de maintenance des équipements mécaniques et électriques ; - ateliers de chaudronneries et de tuyauteries ; - bassins de confinement et bassins de sédimentation ; - aires d'accumulation et parcs à rejets miniers ;",
      },
      {
        id: "p2_61",
        numero: "•",
        contenu:
          "Travaux de l'art des mines : activités relatives à la recherche minière, aux travaux de génie minier et de génie minéralurgique et métallurgique ;",
      },
      {
        id: "p2_62",
        numero: "•",
        contenu:
          "Titre : - le texte intégral de tout bail, titre ou permis par lequel le gouvernement octroie à une ou plusieurs sociétés, ou à un, les droits afférents à la recherche ou à l'exploitation des ressources minières ; - le texte intégral de tout addenda, annexe ou avenant fixant les détails relatifs aux droits de recherches ou d'exploitation ; - le texte intégral de toute modification ou de tout amendement des documents décrits aux points a et b ;",
      },
      {
        id: "p2_63",
        numero: "•",
        contenu:
          "Zones à haut risque : celles qui caractérisent par l'instabilité politique ou la répression, la faiblesse des institutions, l'insécurité, l'effondrement des infrastructures civiles ou une violence généralisée, mais aussi des atteintes systématiques aux droits de l'homme et des violations du droit national et international ;",
      },
      {
        id: "p2_64",
        numero: "•",
        contenu:
          "Zones de conflit : celles qui se caractérisent par l'existence d'un conflit armé, d'une violence généralisée ou d'autres risques d'atteinte aux populations. Il existe plusieurs types de conflits armés à savoir : les conflits internationaux impliquant deux ou plusieurs États ou non, les guerres de libération, les insurrections, les guerres civiles ;",
      },
      {
        id: "p2_65",
        numero: "•",
        contenu:
          "Zone de réserve : toute portion du territoire national classée en réserve telle que: - les réserves naturelles intégrales constituées selon les dispositions de la Loi n° 14/003 du 11 février 2014 relative à la conservation de la nature ; - les réserves de la biosphère établies par l'UNESCO et gérées par le Secrétariat National du Programme MAB au Congo rattaché au Ministère de l'Environnement ; - les réserves forestières gérées par la Direction de Gestion des Ressources Naturelles et Renouvelables du Ministère de l'Environnement ;",
      },
      {
        id: "p2_66",
        numero: "•",
        contenu:
          "Zone de restriction : toute portion du territoire national dont l'occupation à des fins minières est conditionnée par l'autorisation préalable de l'autorité compétente, du propriétaire ou de l'occupant légal telle que : - terrain réservé au cimetière ; - terrain contenant des vestiges archéologiques ou un monument national ; - terrain proche des installations de la Défense Nationale ; - terrain faisant partie notamment d'un aéroport ; - terrain réservé au projet de chemin de fer ; - terrain réservé à la pépinière pour forêt ou à la plantation des forêts ; - terrain situé à moins de nonante mètres des limites d'un village, d'une cité, d'une commune ou d'une ville; - terrain situé à moins de nonante mètres d'un barrage ou d'un bâtiment appartenant à l'Etat; - terrain compris dans un parc national ; - terrain constituant une rue, une route, une autoroute ainsi que les autres. - terrains cités à l'article 279 du Code minier ;",
      },
      {
        id: "p2_67",
        numero: "•",
        contenu:
          "Zone d'interdiction : toute aire géographique située autour des sites d'opérations minières ou de travaux de carrières établie par arrêté ministériel pris à la demande du titulaire du droit minier d'exploitation ou d'une autorisation d'exploitation de carrières permanente empêchant les tiers d'y circuler ou d'y effectuer des travaux quelconques;",
      },
      {
        id: "p2_68",
        numero: "•",
        contenu:
          "Zone interdite : toute aire géographique où les activités minières sont interdites pour des raisons de sûreté nationale, de sécurité des populations, d'une incompatibilité avec d'autres usages existants ou planifiés du sol ou du sous-sol et de la protection de l'environnement.",
      },
    ],
    keywords: [
      "définitions",
      "termes",
      "administration",
      "mines",
      "aires protégées",
      "autorité",
      "bureau",
      "cadastre",
      "cahier des charges",
      "carré",
      "code minier",
      "compensation",
      "concentration",
      "contrat",
      "déplacement",
      "développement durable",
      "direction",
      "droits",
      "erreur manifeste",
      "entités",
      "indemnisation",
      "industrie extractive",
      "matériaux",
      "milieu sensible",
      "minéraux industriels",
      "mine distincte",
      "moyen",
      "partie prenante",
      "pays",
      "poste",
      "plan",
      "personne publique",
      "PGES",
      "pleine concurrence",
      "projet",
      "quotité",
      "règles",
      "réinstallation",
      "service",
      "services techniques",
      "site minier",
      "sous-traitant",
      "terrain",
      "transparence",
      "travaux",
      "titre",
      "zones",
    ],
  },
];

// ─── Dialog : Titre ──────────────────────────────────────────────────────────

function TitreFormDialog({
  open, onClose, initial, onSave,
}: {
  open: boolean
  onClose: () => void
  initial?: Titre
  onSave: (data: Pick<Titre, "numero" | "titre">) => void
}) {
  const [numero, setNumero] = useState("")
  const [titre, setTitre] = useState("")

  useEffect(() => {
    if (open) { setNumero(initial?.numero ?? ""); setTitre(initial?.titre ?? "") }
  }, [open, initial])

  function save() {
    if (!numero.trim() || !titre.trim()) return
    onSave({ numero: numero.trim(), titre: titre.trim() })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Modifier le titre" : "Ajouter un titre"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="t-num">Numéro</Label>
            <Input id="t-num" placeholder="ex. Ier, II, III…" value={numero} onChange={(e) => setNumero(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-titre">Intitulé du titre</Label>
            <Textarea id="t-titre" placeholder="DES GENERALITES…" value={titre} onChange={(e) => setTitre(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={save} disabled={!numero.trim() || !titre.trim()}>{initial ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Dialog : Chapitre ────────────────────────────────────────────────────────

function ChapitreFormDialog({
  open, onClose, initial, titres, defaultTitreId, onSave,
}: {
  open: boolean
  onClose: () => void
  initial?: Chapitre
  titres: Titre[]
  defaultTitreId?: string
  onSave: (data: Pick<Chapitre, "numero" | "titre" | "titreId">) => void
}) {
  const [numero, setNumero] = useState("")
  const [titre, setTitre] = useState("")
  const [titreId, setTitreId] = useState("")

  useEffect(() => {
    if (open) {
      setNumero(initial?.numero ?? "")
      setTitre(initial?.titre ?? "")
      setTitreId(initial?.titreId ?? defaultTitreId ?? titres[0]?.id ?? "")
    }
  }, [open, initial, defaultTitreId, titres])

  function save() {
    if (!numero.trim() || !titre.trim() || !titreId) return
    onSave({ numero: numero.trim(), titre: titre.trim(), titreId })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Modifier le chapitre" : "Ajouter un chapitre"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Titre parent</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={titreId}
              onChange={(e) => setTitreId(e.target.value)}
            >
              {titres.map((t) => (
                <option key={t.id} value={t.id}>Titre {t.numero} — {t.titre}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ch-num">Numéro</Label>
            <Input id="ch-num" placeholder="ex. I, II, III…" value={numero} onChange={(e) => setNumero(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ch-titre">Intitulé du chapitre</Label>
            <Textarea id="ch-titre" placeholder="DU CHAMP D'APPLICATION…" value={titre} onChange={(e) => setTitre(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={save} disabled={!numero.trim() || !titre.trim() || !titreId}>{initial ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Dialog : Article ─────────────────────────────────────────────────────────

function ArticleFormDialog({
  open, onClose, initial, titres, chapitres, defaultChapitreId, onSave,
}: {
  open: boolean
  onClose: () => void
  initial?: Article
  titres: Titre[]
  chapitres: Chapitre[]
  defaultChapitreId?: string
  onSave: (data: ArticleSaveData) => void
}) {
  const [titreId, setTitreId]   = useState("")
  const [chapitreId, setChapitreId] = useState("")
  const [numero, setNumero]     = useState("")
  const [titre, setTitre]       = useState("")
  const [paragraphes, setParagraphes] = useState<Paragraphe[]>([])
  const [keywords, setKeywords] = useState("")

  useEffect(() => {
    if (!open) return
    const defaultCh = defaultChapitreId ?? initial?.chapitreId ?? chapitres[0]?.id ?? ""
    const resolvedTitreId = initial?.titreId ?? chapitres.find((c) => c.id === defaultCh)?.titreId ?? titres[0]?.id ?? ""
    setTitreId(resolvedTitreId)
    setChapitreId(defaultCh)
    setNumero(initial?.numero ?? "")
    setTitre(initial?.titre ?? "")
    setParagraphes(initial?.paragraphes ? [...initial.paragraphes] : [])
    setKeywords(initial?.keywords.join(", ") ?? "")
  }, [open, initial, defaultChapitreId, chapitres, titres])

  // sync chapitreId when titreId changes (only for new articles)
  useEffect(() => {
    if (!initial && titreId) {
      const first = chapitres.find((c) => c.titreId === titreId)
      if (first) setChapitreId(first.id)
    }
  }, [titreId, initial, chapitres])

  function addParagraphe() {
    setParagraphes((prev) => [...prev, { id: `p${Date.now()}`, numero: "", contenu: "" }])
  }
  function updateParagraphe(id: string, field: keyof Paragraphe, value: string) {
    setParagraphes((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p))
  }
  function removeParagraphe(id: string) {
    setParagraphes((prev) => prev.filter((p) => p.id !== id))
  }

  function save() {
    if (!numero.trim() || !titre.trim() || !chapitreId || !titreId) return
    onSave({
      numero: numero.trim(),
      titre: titre.trim(),
      chapitreId,
      titreId,
      paragraphes,
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
    })
    onClose()
  }

  const chapOfTitre = chapitres.filter((c) => c.titreId === titreId)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Modifier l'article" : "Ajouter un article"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Titre parent + Chapitre */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Titre</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={titreId}
                onChange={(e) => setTitreId(e.target.value)}
              >
                {titres.map((t) => (
                  <option key={t.id} value={t.id}>Titre {t.numero}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Chapitre</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={chapitreId}
                onChange={(e) => setChapitreId(e.target.value)}
              >
                {chapOfTitre.map((c) => (
                  <option key={c.id} value={c.id}>Chap. {c.numero}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Numéro + Titre article */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="art-num">Numéro</Label>
              <Input id="art-num" placeholder="ex. 1er, 2…" value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="art-titre">Titre de l'article</Label>
              <Input id="art-titre" placeholder="Du champ d'application…" value={titre} onChange={(e) => setTitre(e.target.value)} />
            </div>
          </div>

          {/* Paragraphes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Paragraphes</Label>
              <Button type="button" variant="outline" size="sm" onClick={addParagraphe}>
                <Plus className="w-3 h-3 mr-1" /> Ajouter un paragraphe
              </Button>
            </div>

            {paragraphes.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                Aucun paragraphe. Cliquez sur « Ajouter un paragraphe » pour commencer.
              </p>
            )}

            {paragraphes.map((para, idx) => (
              <div key={para.id} className="border border-border rounded-lg p-3 space-y-2 bg-muted/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0 w-12">§ {idx + 1}</span>
                  <Input
                    placeholder="Numéro / puce (ex. •, 1, 1 bis)"
                    value={para.numero}
                    onChange={(e) => updateParagraphe(para.id, "numero", e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => removeParagraphe(para.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Contenu du paragraphe…"
                  value={para.contenu}
                  onChange={(e) => updateParagraphe(para.id, "contenu", e.target.value)}
                  rows={3}
                  className="text-sm resize-none"
                />
                <Textarea
                  placeholder="Note (optionnel)…"
                  value={para.note ?? ""}
                  onChange={(e) => updateParagraphe(para.id, "note", e.target.value)}
                  rows={2}
                  className="text-xs text-muted-foreground resize-none"
                />
              </div>
            ))}
          </div>

          {/* Mots-clés */}
          <div className="space-y-1.5">
            <Label htmlFor="art-kw">Mots-clés <span className="text-muted-foreground font-normal">(séparés par des virgules)</span></Label>
            <Input id="art-kw" placeholder="définitions, termes, administration…" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={save} disabled={!numero.trim() || !titre.trim() || !chapitreId}>
            {initial ? "Enregistrer" : "Créer l'article"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Dialog : Confirmation suppression ───────────────────────────────────────

function DeleteConfirmDialog({
  open, label, onClose, onConfirm,
}: {
  open: boolean
  label: string
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer <strong>{label}</strong> ?
            Cette action est irréversible et supprimera également tous les éléments associés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Sommaire hiérarchique ────────────────────────────────────────────────────

interface TOCCallbacks {
  onAddTitre: () => void
  onEditTitre: (t: Titre) => void
  onDeleteTitre: (t: Titre) => void
  onPdfChapitre: (ch: Chapitre, t: Titre) => void
  onAddChapitre: (titreId: string) => void
  onEditChapitre: (ch: Chapitre) => void
  onDeleteChapitre: (ch: Chapitre) => void
  onAddArticle: (chapitreId: string, titreId: string) => void
  onEditArticle: (a: Article) => void
  onDeleteArticle: (a: Article) => void
}

function TableOfContents({
  titres, chapitres, articles,
  selectedArticle, onSelectArticle, onClose, callbacks,
  pCanAdd, pCanEdit, pCanDelete,
}: {
  titres: Titre[]
  chapitres: Chapitre[]
  articles: Article[]
  selectedArticle: Article | null
  onSelectArticle: (a: Article) => void
  onClose?: () => void
  callbacks: TOCCallbacks
  pCanAdd: boolean
  pCanEdit: boolean
  pCanDelete: boolean
}) {
  const chapitresOf = (titreId: string) => chapitres.filter((c) => c.titreId === titreId)
  const articlesOf  = (chapitreId: string) => articles.filter((a) => a.chapitreId === chapitreId)
  const artCount    = (titreId: string) => articles.filter((a) => a.titreId === titreId).length

  return (
    <div className="space-y-1">
      <Accordion type="multiple" className="w-full space-y-1">
        {titres.map((t, tIdx) => (
          <AccordionItem
            key={t.id}
            value={`t-${tIdx}`}
            className="border border-cyan-500/40 rounded-md overflow-hidden"
          >
            {/* Titre trigger */}
            <AccordionTrigger className="hover:no-underline px-3 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 [&>svg]:shrink-0 [&>svg]:ml-1">
              <div className="flex items-start gap-2 w-full text-left group/t">
                <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 shrink-0 mt-0.5 uppercase">Titre&nbsp;{t.numero}</span>
                <span className="flex-1 text-[11px] font-semibold uppercase tracking-wide leading-tight line-clamp-2 text-cyan-900 dark:text-cyan-200">{t.titre}</span>
                <div className="flex items-center gap-0.5 shrink-0 ml-1">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{artCount(t.id)}</Badge>
                  {pCanEdit && <button
                    onClick={(e) => { e.stopPropagation(); callbacks.onEditTitre(t) }}
                    className="p-1 rounded hover:bg-primary/10 hover:text-primary opacity-0 group-hover/t:opacity-100 transition-opacity"
                    title="Modifier le titre"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>}
                  {pCanDelete && <button
                    onClick={(e) => { e.stopPropagation(); callbacks.onDeleteTitre(t) }}
                    className="p-1 rounded hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/t:opacity-100 transition-opacity"
                    title="Supprimer le titre"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-0 pb-0">
              <Accordion type="multiple" className="w-full">
                {chapitresOf(t.id).map((ch, chIdx) => {
                  const chArts = articlesOf(ch.id)
                  return (
                    <AccordionItem key={ch.id} value={`ch-${chIdx}`} className="border-0 border-t border-indigo-500/20">
                      {/* Chapitre trigger */}
                      <AccordionTrigger className="hover:no-underline px-3 py-2 bg-indigo-500/8 hover:bg-indigo-500/15 [&>svg]:shrink-0 [&>svg]:ml-1">
                        <div className="flex items-start gap-2 w-full text-left group/ch">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 uppercase">Chap.&nbsp;{ch.numero}</span>
                          <span className="flex-1 text-[10px] font-semibold leading-tight line-clamp-2 text-indigo-900 dark:text-indigo-200">{ch.titre}</span>
                          <div className="flex items-center gap-0.5 shrink-0 ml-1">
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">{chArts.length}</Badge>
                            <button
                              onClick={(e) => { e.stopPropagation(); callbacks.onPdfChapitre(ch, t) }}
                              className="p-1 rounded hover:bg-emerald-500/10 hover:text-emerald-600 opacity-0 group-hover/ch:opacity-100 transition-opacity"
                              title="Télécharger le chapitre en PDF"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                            {pCanEdit && <button
                              onClick={(e) => { e.stopPropagation(); callbacks.onEditChapitre(ch) }}
                              className="p-1 rounded hover:bg-primary/10 hover:text-primary opacity-0 group-hover/ch:opacity-100 transition-opacity"
                              title="Modifier le chapitre"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>}
                            {pCanDelete && <button
                              onClick={(e) => { e.stopPropagation(); callbacks.onDeleteChapitre(ch) }}
                              className="p-1 rounded hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/ch:opacity-100 transition-opacity"
                              title="Supprimer le chapitre"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="pb-1">
                        <div className="pl-4 pr-2 space-y-0.5">
                          {chArts.map((art) => (
                            <div key={art.id} className="group/art flex items-center gap-1">
                              <button
                                onClick={() => { onSelectArticle(art); onClose?.() }}
                                className={cn(
                                  "flex-1 text-left text-xs px-2 py-1.5 rounded transition-colors",
                                  "hover:bg-sky-500/10 hover:text-sky-700 dark:hover:text-sky-300",
                                  selectedArticle?.id === art.id
                                    ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 font-medium"
                                    : "text-foreground/80"
                                )}
                              >
                                <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400 font-semibold mr-1">Art.&nbsp;{art.numero}</span>
                                {art.titre}
                              </button>
                              {(pCanEdit || pCanDelete) && (
                                <div className="flex gap-0.5 opacity-0 group-hover/art:opacity-100 transition-opacity shrink-0">
                                  {pCanEdit && <button onClick={() => callbacks.onEditArticle(art)} className="p-1 rounded hover:bg-primary/10 hover:text-primary" title="Modifier">
                                    <Pencil className="w-3 h-3" />
                                  </button>}
                                  {pCanDelete && <button onClick={() => callbacks.onDeleteArticle(art)} className="p-1 rounded hover:bg-destructive/10 hover:text-destructive" title="Supprimer">
                                    <Trash2 className="w-3 h-3" />
                                  </button>}
                                </div>
                              )}
                            </div>
                          ))}
                          {pCanAdd && <button
                            onClick={() => callbacks.onAddArticle(ch.id, ch.titreId)}
                            className="w-full text-left text-[11px] px-2 py-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/5 flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Ajouter un article
                          </button>}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>

              {/* Ajouter un chapitre */}
              {pCanAdd && <button
                onClick={() => callbacks.onAddChapitre(t.id)}
                className="w-full text-left text-[11px] px-3 py-2 border-t border-border/30 text-muted-foreground hover:text-primary hover:bg-muted/40 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Ajouter un chapitre
              </button>}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Ajouter un titre */}
      {pCanAdd && <button
        onClick={callbacks.onAddTitre}
        className="w-full text-left text-[11px] px-3 py-2.5 mt-1 rounded-md border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 flex items-center gap-1.5 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Ajouter un titre
      </button>}
    </div>
  )
}

// ─── Vue article ──────────────────────────────────────────────────────────────

function ArticleView({
  article, chapitre, titreDoc, onBack, onEdit, pCanEdit,
}: {
  article: Article
  chapitre?: Chapitre
  titreDoc?: Titre
  onBack: () => void
  onEdit: () => void
  pCanEdit: boolean
}) {
  function handleDownload() {
    const pdfArt = {
      numero: article.numero,
      titre: article.titre,
      paragraphes: article.paragraphes,
      keywords: article.keywords,
    }
    exportArticlePdf(pdfArt, "Règlement Minier", `Titre ${titreDoc?.numero} — Chapitre ${chapitre?.numero}`)
  }

  return (
    <div className="space-y-5">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
        <span>Règlement minier</span>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span>Titre&nbsp;{titreDoc?.numero}</span>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span>Chap.&nbsp;{chapitre?.numero}</span>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="text-foreground font-medium">Art.&nbsp;{article.numero}</span>
      </nav>

      {/* En-tête */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
            Titre {titreDoc?.numero} — Chapitre {chapitre?.numero}
          </p>
          <div className="flex gap-1.5 shrink-0">
            <Button
              variant="outline" size="sm"
              onClick={handleDownload}
              className="h-7 text-xs gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-950/40"
            >
              <Download className="w-3 h-3" /> PDF
            </Button>
            {pCanEdit && <Button variant="outline" size="sm" onClick={onEdit} className="h-7 text-xs gap-1">
              <Pencil className="w-3 h-3" /> Modifier
            </Button>}
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
          Article {article.numero} : <span className="font-semibold">{article.titre}</span>
        </h2>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {article.keywords.map((kw) => (
            <Badge key={kw} variant="outline" className="text-[11px] px-2 py-0.5">{kw}</Badge>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Corps */}
      <div className="space-y-3">
        {article.paragraphes.map((para) => (
          <div key={para.id} className="space-y-1.5">
            <div className="flex gap-3">
              {para.numero && (
                <span className="shrink-0 min-w-6 text-right font-semibold text-sm text-primary mt-0.5">
                  {para.numero}
                </span>
              )}
              <p className={cn(
                "text-sm sm:text-base text-foreground leading-relaxed",
                !para.numero && "ml-0"
              )}>
                {para.contenu}
              </p>
            </div>
            {para.note && (
              <div className={cn("bg-muted/50 rounded-md px-3 py-2 border-l-2 border-primary/30", para.numero ? "ml-9" : "ml-0")}>
                <p className="text-xs text-muted-foreground leading-relaxed italic">{para.note}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Chapitre :</span> {chapitre?.titre}
        </p>
        <Button variant="outline" size="sm" onClick={onBack}>← Retour aux résultats</Button>
      </div>
    </div>
  )
}

// ─── Composant principal ─────────────────────────────────────────────────────

export function ReglementBrowser() {
  const role       = useRole()
  const pCanAdd    = canAdd(role)
  const pCanEdit   = canEdit(role)
  const pCanDelete = canDelete(role)

  // ── État ──────────────────────────────────────────────────────────────────
  const [titres,    setTitres]    = useState<Titre[]>(initialTitres)
  const [chapitres, setChapitres] = useState<Chapitre[]>(initialChapitres)
  const [articles,  setArticles]  = useState<Article[]>(initialArticles)

  const [searchQuery,     setSearchQuery]     = useState("")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [mobileNavOpen,   setMobileNavOpen]   = useState(false)

  const [titreDialog,    setTitreDialog]    = useState<{ open: boolean; editing?: Titre }>({ open: false })
  const [chapitreDialog, setChapitreDialog] = useState<{ open: boolean; editing?: Chapitre; defaultTitreId?: string }>({ open: false })
  const [articleDialog,  setArticleDialog]  = useState<{ open: boolean; editing?: Article; defaultChapitreId?: string }>({ open: false })
  const [deleteConfirm,  setDeleteConfirm]  = useState<{
    open: boolean; type?: "titre" | "chapitre" | "article"; id?: string; label?: string
  }>({ open: false })

  // ── CRUD Titres ───────────────────────────────────────────────────────────
  function saveTitre(data: Pick<Titre, "numero" | "titre">) {
    if (titreDialog.editing) {
      setTitres((prev) => prev.map((t) => t.id === titreDialog.editing!.id ? { ...t, ...data } : t))
    } else {
      setTitres((prev) => [...prev, { id: `t${Date.now()}`, ...data }])
    }
  }

  function deleteTitre(id: string) {
    const chapIds = chapitres.filter((c) => c.titreId === id).map((c) => c.id)
    setArticles((prev) => prev.filter((a) => !chapIds.includes(a.chapitreId)))
    setChapitres((prev) => prev.filter((c) => c.titreId !== id))
    setTitres((prev) => prev.filter((t) => t.id !== id))
    if (selectedArticle?.titreId === id) setSelectedArticle(null)
  }

  // ── CRUD Chapitres ────────────────────────────────────────────────────────
  function saveChapitre(data: Pick<Chapitre, "numero" | "titre" | "titreId">) {
    if (chapitreDialog.editing) {
      setChapitres((prev) => prev.map((c) => c.id === chapitreDialog.editing!.id ? { ...c, ...data } : c))
    } else {
      setChapitres((prev) => [...prev, { id: `ch${Date.now()}`, ...data }])
    }
  }

  function deleteChapitre(id: string) {
    setArticles((prev) => prev.filter((a) => a.chapitreId !== id))
    setChapitres((prev) => prev.filter((c) => c.id !== id))
    if (selectedArticle?.chapitreId === id) setSelectedArticle(null)
  }

  // ── CRUD Articles ─────────────────────────────────────────────────────────
  function saveArticle(data: ArticleSaveData) {
    if (articleDialog.editing) {
      const updated: Article = { id: articleDialog.editing.id, ...data }
      setArticles((prev) => prev.map((a) => a.id === articleDialog.editing!.id ? updated : a))
      setSelectedArticle((prev) => prev?.id === articleDialog.editing!.id ? updated : prev)
    } else {
      setArticles((prev) => [...prev, { id: `art${Date.now()}`, ...data }])
    }
  }

  function deleteArticle(id: string) {
    setArticles((prev) => prev.filter((a) => a.id !== id))
    if (selectedArticle?.id === id) setSelectedArticle(null)
  }

  // ── Dispatch suppression ──────────────────────────────────────────────────
  function handleDeleteConfirm() {
    if (!deleteConfirm.id || !deleteConfirm.type) return
    if (deleteConfirm.type === "titre")    deleteTitre(deleteConfirm.id)
    if (deleteConfirm.type === "chapitre") deleteChapitre(deleteConfirm.id)
    if (deleteConfirm.type === "article")  deleteArticle(deleteConfirm.id)
    setDeleteConfirm({ open: false })
  }

  // ── Callbacks sommaire ────────────────────────────────────────────────────
  const tocCallbacks: TOCCallbacks = {
    onAddTitre:    ()    => setTitreDialog({ open: true }),
    onEditTitre:   (t)   => setTitreDialog({ open: true, editing: t }),
    onDeleteTitre: (t)   => setDeleteConfirm({ open: true, type: "titre",    id: t.id,  label: `Titre ${t.numero}` }),
    onPdfChapitre: (ch, t) => {
      const chapArticles = articles.filter((a) => a.chapitreId === ch.id)
      exportChapitrePdf({
        numero: ch.numero, titre: ch.titre,
        titreParent: `Titre ${t.numero}`,
        articles: chapArticles.map((a) => ({ numero: a.numero, titre: a.titre, paragraphes: a.paragraphes, keywords: a.keywords })),
      }, "Règlement Minier")
    },
    onAddChapitre:    (tid) => setChapitreDialog({ open: true, defaultTitreId: tid }),
    onEditChapitre:   (ch)  => setChapitreDialog({ open: true, editing: ch }),
    onDeleteChapitre: (ch)  => setDeleteConfirm({ open: true, type: "chapitre", id: ch.id, label: `Chapitre ${ch.numero}` }),
    onAddArticle:     (cid, _tid) => setArticleDialog({ open: true, defaultChapitreId: cid }),
    onEditArticle:    (a)   => setArticleDialog({ open: true, editing: a }),
    onDeleteArticle:  (a)   => setDeleteConfirm({ open: true, type: "article",  id: a.id,  label: `Article ${a.numero}` }),
  }

  // ── Recherche ─────────────────────────────────────────────────────────────
  const filteredArticles = articles.filter((a) => {
    const q = searchQuery.toLowerCase()
    return (
      a.titre.toLowerCase().includes(q) ||
      a.numero.toLowerCase().includes(q) ||
      a.paragraphes.some((p) => p.contenu.toLowerCase().includes(q)) ||
      a.keywords.some((k) => k.toLowerCase().includes(q))
    )
  })

  const findChapitre = (id: string) => chapitres.find((c) => c.id === id)
  const findTitre    = (id: string) => titres.find((t) => t.id === id)

  // ── Rendu ──────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">

        {/* Sommaire desktop */}
        <Card className="bg-card border-border hidden lg:block lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <BookOpen className="w-5 h-5" /> Sommaire
            </CardTitle>
            <CardDescription className="text-xs">Titres · Chapitres · Articles</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[calc(100vh-14rem)] overflow-y-auto pr-2">
            <TableOfContents
              titres={titres} chapitres={chapitres} articles={articles}
              selectedArticle={selectedArticle} onSelectArticle={setSelectedArticle}
              callbacks={tocCallbacks}
              pCanAdd={pCanAdd} pCanEdit={pCanEdit} pCanDelete={pCanDelete}
            />
          </CardContent>
        </Card>

        {/* Contenu */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader className="space-y-3 pb-3">

            {/* Sommaire mobile */}
            <div className="lg:hidden">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Menu className="w-4 h-4 mr-2" /> Sommaire
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" /> Sommaire
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <TableOfContents
                      titres={titres} chapitres={chapitres} articles={articles}
                      selectedArticle={selectedArticle} onSelectArticle={setSelectedArticle}
                      onClose={() => setMobileNavOpen(false)} callbacks={tocCallbacks}
                      pCanAdd={pCanAdd} pCanEdit={pCanEdit} pCanDelete={pCanDelete}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Barre recherche + bouton ajout */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher dans le Règlement minier…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              {pCanAdd && <Button size="sm" className="shrink-0 gap-1" onClick={() => setArticleDialog({ open: true })}>
                <Plus className="w-4 h-4" /> Article
              </Button>}
            </div>
          </CardHeader>

          <CardContent>
            {selectedArticle ? (
              <ArticleView
                article={selectedArticle}
                chapitre={findChapitre(selectedArticle.chapitreId)}
                titreDoc={findTitre(selectedArticle.titreId)}
                onBack={() => setSelectedArticle(null)}
                onEdit={() => setArticleDialog({ open: true, editing: selectedArticle })}
                pCanEdit={pCanEdit}
              />
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">
                  {searchQuery
                    ? `${filteredArticles.length} résultat(s) pour « ${searchQuery} »`
                    : "Sélectionnez un article dans le sommaire ou effectuez une recherche"}
                </p>

                {filteredArticles.map((art) => {
                  const ch      = findChapitre(art.chapitreId)
                  const titreDoc = findTitre(art.titreId)
                  const preview = art.paragraphes[0]?.contenu ?? ""

                  return (
                    <div key={art.id} className="group/card relative">
                      <button
                        onClick={() => setSelectedArticle(art)}
                        className="w-full text-left p-3 sm:p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/40 transition-all"
                      >
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1.5">
                          <span>Titre&nbsp;{titreDoc?.numero}</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                          <span>Chap.&nbsp;{ch?.numero}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 pr-28">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground text-sm sm:text-base leading-snug">
                              Article {art.numero} — {art.titre}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{preview}</p>
                          </div>
                          <Badge variant="secondary" className="text-[10px] shrink-0 self-start">
                            {art.paragraphes.length}&nbsp;§
                          </Badge>
                        </div>
                      </button>

                      {/* Actions rapides */}
                      <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <Button
                          variant="outline" size="icon" className="h-7 w-7 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800"
                          title="Télécharger en PDF"
                          onClick={(e) => {
                            e.stopPropagation()
                            const ch = findChapitre(art.chapitreId)
                            const t  = findTitre(art.titreId)
                            exportArticlePdf(
                              { numero: art.numero, titre: art.titre, paragraphes: art.paragraphes, keywords: art.keywords },
                              "Règlement Minier",
                              `Titre ${t?.numero} — Chapitre ${ch?.numero}`,
                            )
                          }}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        {pCanEdit && <Button
                          variant="secondary" size="icon" className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); setArticleDialog({ open: true, editing: art }) }}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>}
                        {pCanDelete && <Button
                          variant="destructive" size="icon" className="h-7 w-7"
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ open: true, type: "article", id: art.id, label: `Article ${art.numero}` }) }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>}
                      </div>
                    </div>
                  )
                })}

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{searchQuery ? "Aucun résultat" : "Aucun article disponible"}</p>
                    {!searchQuery && (
                      <Button variant="outline" size="sm" className="mt-3 gap-1" onClick={() => setArticleDialog({ open: true })}>
                        <Plus className="w-4 h-4" /> Ajouter un article
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Dialogs ── */}
      <TitreFormDialog
        open={titreDialog.open}
        onClose={() => setTitreDialog({ open: false })}
        initial={titreDialog.editing}
        onSave={saveTitre}
      />
      <ChapitreFormDialog
        open={chapitreDialog.open}
        onClose={() => setChapitreDialog({ open: false })}
        initial={chapitreDialog.editing}
        titres={titres}
        defaultTitreId={chapitreDialog.defaultTitreId}
        onSave={saveChapitre}
      />
      <ArticleFormDialog
        open={articleDialog.open}
        onClose={() => setArticleDialog({ open: false })}
        initial={articleDialog.editing}
        titres={titres}
        chapitres={chapitres}
        defaultChapitreId={articleDialog.defaultChapitreId}
        onSave={saveArticle}
      />
      <DeleteConfirmDialog
        open={deleteConfirm.open}
        label={deleteConfirm.label ?? ""}
        onClose={() => setDeleteConfirm({ open: false })}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

