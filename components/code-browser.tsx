"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search, BookOpen, ChevronRight, Menu, Info,
  Plus, Pencil, Trash2, FileText, Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  exportArticlePdf,
  exportSectionPdf,
  exportChapitrePdf,
  type PdfArticle,
  type PdfSection,
  type PdfChapitre,
} from "@/lib/pdf-export"
import { useSession } from "@/lib/auth-client"
import { canAdd, canEdit, canDelete } from "@/lib/permissions"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Paragraphe {
  id: string
  numero: string
  contenu: string
  note?: string
}

interface Article {
  id: string
  numero: string
  titre: string
  sectionId: string
  chapitreId: string
  modification?: string
  introduction?: string
  paragraphes?: Paragraphe[]
  contenu?: string
  keywords: string[]
}

interface Section {
  id: string
  numero: string
  titre: string
  chapitreId: string
}

interface Titre {
  id: string
  numero: string
  titre: string
}

interface Chapitre {
  id: string
  numero: string
  titre: string
  titreId?: string
}

type ArticleSaveData = Omit<Article, "id">

// ─── Données initiales ────────────────────────────────────────────────────────

const initialTitres: Titre[] = [
  { id: "t1",  numero: "I",    titre: "DISPOSITIONS GÉNÉRALES" },
  { id: "t2",  numero: "II",   titre: "DE L'ADMINISTRATION MINIÈRE ET DU CADASTRE MINIER" },
  { id: "t3",  numero: "III",  titre: "DES DROITS MINIERS ET DES AUTORISATIONS DE CARRIÈRES" },
  { id: "t4",  numero: "IV",   titre: "DES RÉGIMES FISCAL ET DOUANIER" },
  { id: "t16", numero: "XVI",  titre: "DES DISPOSITIONS TRANSITOIRES" },
  { id: "t17", numero: "XVII", titre: "DES DISPOSITIONS ABROGATOIRES ET FINALES" },
]

const initialChapitres: Chapitre[] = [
  { id: "ch1",    numero: "Ier",  titre: "DES DÉFINITIONS DES TERMES, DU CHAMP D'APPLICATION ET DES PRINCIPES FONDAMENTAUX", titreId: "t1" },
  { id: "ch2",    numero: "II",   titre: "DU CADASTRE MINIER",                                                                titreId: "t2" },
  { id: "ch3",    numero: "III",  titre: "DES DROITS MINIERS ET DES AUTORISATIONS DE CARRIÈRES",                              titreId: "t3" },
  { id: "ch4",    numero: "IV",   titre: "DES PERMIS D'EXPLOITATION",                                                        titreId: "t3" },
  { id: "ch5",    numero: "V",    titre: "DISPOSITIONS FISCALES ET DOUANIÈRES",                                               titreId: "t4" },
  { id: "ch_p3",  numero: "III",  titre: "DES PARTENARIATS AVEC L'ÉTAT",                                                     titreId: "t16" },
  { id: "ch_p4",  numero: "IV",   titre: "DE LA MISE EN APPLICATION DE NOUVELLES DISPOSITIONS",                              titreId: "t16" },
  { id: "ch_p17", numero: "XVII", titre: "DES DISPOSITIONS ABROGATOIRES ET FINALES",                                         titreId: "t17" },
]

const initialSections: Section[] = [
  { id: "s1_1", numero: "I",  titre: "Des définitions des termes et du champ d'application", chapitreId: "ch1" },
  { id: "s1_2", numero: "II", titre: "Des principes fondamentaux",                           chapitreId: "ch1" },
  { id: "s2_1", numero: "I",  titre: "Organisation et fonctionnement",                       chapitreId: "ch2" },
  { id: "s2_2", numero: "II", titre: "Des attributions du Cadastre Minier",                  chapitreId: "ch2" },
  { id: "s3_1", numero: "I",  titre: "Des droits miniers",                                   chapitreId: "ch3" },
  { id: "s3_2", numero: "II", titre: "Des autorisations de carrières",                       chapitreId: "ch3" },
  { id: "s4_1", numero: "I",  titre: "Des conditions d'octroi",                              chapitreId: "ch4" },
  { id: "s4_2", numero: "II", titre: "De la durée et du renouvellement",                     chapitreId: "ch4" },
  { id: "s5_1",   numero: "I",   titre: "Du régime fiscal",                                                              chapitreId: "ch5" },
  { id: "s5_2",   numero: "II",  titre: "Des droits superficiaires et taxes",                                             chapitreId: "ch5" },
  // ── Titre XVI — Chapitre III ─────────────────────────────────────────────
  { id: "s_p3_1", numero: "I",   titre: "Des partenariats conclus avec l'État",                                           chapitreId: "ch_p3" },
  // ── Titre XVI — Chapitre IV ──────────────────────────────────────────────
  { id: "s_p4_1", numero: "I",   titre: "Des modalités d'application et de la suspension des demandes",                   chapitreId: "ch_p4" },
  { id: "s_p4_2", numero: "II",  titre: "Des droits existants, validations et conventions minières",                      chapitreId: "ch_p4" },
  { id: "s_p4_3", numero: "III", titre: "De la garantie de stabilité et du traitement local",                             chapitreId: "ch_p4" },
  // ── Titre XVII ───────────────────────────────────────────────────────────
  { id: "s_p17_1",numero: "I",   titre: "Des dispositions abrogatoires et de l'entrée en vigueur",                        chapitreId: "ch_p17" },
]

const initialArticles: Article[] = [
  {
    id: "art1", numero: "1er", titre: "Des définitions",
    sectionId: "s1_1", chapitreId: "ch1",
    modification: "modifié par l'article 1er de la Loi n° 18/001 du 09 mars 2018",
    introduction: "Aux termes du présent Code, on entend par :",
    paragraphes: [
      {
        id: "p1_1", numero: "1",
        contenu: "Acheteur (modifié) : tout employé agréé d'un comptoir d'achat, d'une entité de traitement d'or, de diamant et d'autres substances minérales d'exploitation artisanale, qui exerce ses activités conformément aux dispositions du présent Code.",
        note: "Le Législateur souligne l'agrément des acheteurs employés non seulement de Comptoirs d'achat, mais aussi d'Entités de traitement. Par ailleurs, il élargit la notion de l'acheteur en incluant les employés des entités de traitement.",
      },
      {
        id: "p1_2", numero: "1 bis",
        contenu: "ACE, Agence Congolaise de l'Environnement (inséré) : établissement public à caractère technique et scientifique, créé par Décret n° 14/030 du novembre 2014, exerçant les activités d'évaluation et d'approbation des études environnementales et sociales ainsi que le suivi de leur mise en œuvre.",
        note: "Il était logique que la révision du Code Minier intègre cet Établissement public, étant donné que la Loi qui le crée, postérieure au Code minier de 2002, lui confère notamment la protection de l'environnement minier.",
      },
      {
        id: "p1_3", numero: "2",
        contenu: "Activités minières (modifié) : tous services, fournitures ou travaux de l'art des mines directement liés à la recherche, à l'exploitation minières et au traitement et/ou transformation des substances minérales, y compris les travaux de développement, de construction et d'infrastructure.",
        note: "Le Législateur supprime la prospection comme activité minière et adapte ce littera à la logique de la révision ayant débouché à l'abrogation des articles 17 à 22.",
      },
      {
        id: "p1_4", numero: "3",
        contenu: "Administration des Mines (modifié) : ensemble des directions, divisions et autres services publics des mines et des carrières.",
        note: "Le Législateur précise désormais que l'Administration des Mines ne comprend que les Directions, les Divisions et autres Services publics non personnifiés. Cette nouvelle définition est plus précise et restrictive.",
      },
      {
        id: "p1_5", numero: "4",
        contenu: "Amodiation : un louage pour une durée déterminée ou indéterminée, sans faculté de sous-louage, de tout ou partie des droits attachés à un droit minier ou une autorisation de carrières moyennant une rémunération fixée par accord entre l'amodiant et l'amodiataire.",
      },
      {
        id: "p1_6", numero: "5",
        contenu: "Ayant-droit (remplace l'ancien point 5) : toute personne physique de nationalité congolaise ayant la jouissance du sol en vertu du droit coutumier ou toute personne physique ou morale occupant le sol en vertu d'un titre foncier.",
        note: "Le Législateur précise le contenu de la notion de l'ayant-droit, en vue de mieux prévenir, éviter et gérer d'éventuels conflits entre le droit foncier et le droit minier.",
      },
    ],
    keywords: ["définitions", "acheteur", "ACE", "activités minières", "administration"],
  },
  {
    id: "art2", numero: "2", titre: "Du champ d'application",
    sectionId: "s1_1", chapitreId: "ch1",
    contenu: "Le présent Code régit la recherche, l'exploitation, la transformation et le transport des substances minérales sur l'ensemble du territoire national. Il s'applique à toute personne physique ou morale, de droit public ou privé, qui entreprend des activités minières.",
    keywords: ["champ application", "territoire", "substances minérales"],
  },
  {
    id: "art3", numero: "3", titre: "Des principes fondamentaux",
    sectionId: "s1_2", chapitreId: "ch1",
    introduction: "Les principes fondamentaux régissant le présent Code sont :",
    paragraphes: [
      { id: "p3_1", numero: "1", contenu: "La souveraineté permanente de l'État sur les ressources naturelles minières." },
      { id: "p3_2", numero: "2", contenu: "La transparence dans la gestion des ressources minières conformément aux standards internationaux." },
      { id: "p3_3", numero: "3", contenu: "Le développement durable et la protection de l'environnement dans l'exercice des activités minières." },
    ],
    keywords: ["principes", "souveraineté", "transparence", "développement durable"],
  },
  {
    id: "art68", numero: "68", titre: "Conditions d'octroi du permis d'exploitation",
    sectionId: "s4_1", chapitreId: "ch4",
    introduction: "Le permis d'exploitation est accordé sous les conditions suivantes :",
    paragraphes: [
      { id: "p68_1", numero: "1", contenu: "Le demandeur doit être titulaire d'un permis de recherche ayant conduit à la découverte d'un gisement économiquement exploitable." },
      { id: "p68_2", numero: "2", contenu: "Le demandeur doit démontrer ses capacités techniques et financières pour mener l'exploitation." },
      { id: "p68_3", numero: "3", contenu: "Le demandeur doit remplir toutes les conditions prévues par le présent Code et ses mesures d'exécution." },
    ],
    keywords: ["permis", "exploitation", "conditions", "titulaire"],
  },
  {
    id: "art69", numero: "69", titre: "Durée et renouvellement",
    sectionId: "s4_2", chapitreId: "ch4",
    introduction: "Le permis d'exploitation est soumis aux règles suivantes concernant sa durée :",
    paragraphes: [
      { id: "p69_1", numero: "1", contenu: "Le permis d'exploitation est accordé pour une durée maximale de vingt-cinq (25) ans." },
      { id: "p69_2", numero: "2", contenu: "Il est renouvelable par périodes successives de quinze (15) ans, sous réserve du respect des obligations légales." },
      { id: "p69_3", numero: "3", contenu: "La demande de renouvellement doit être introduite au moins six (6) mois avant l'expiration du titre en cours." },
    ],
    keywords: ["durée", "renouvellement", "validité", "25 ans"],
  },
  {
    id: "art220", numero: "220", titre: "Régime fiscal",
    sectionId: "s5_1", chapitreId: "ch5",
    introduction: "Les titulaires de droits miniers sont soumis aux obligations fiscales ci-après :",
    paragraphes: [
      { id: "p220_1", numero: "1", contenu: "Le régime fiscal de droit commun, sous réserve des dispositions particulières du présent Code." },
      { id: "p220_2", numero: "2", contenu: "La redevance minière, calculée sur la valeur marchande des substances minérales extraites." },
      { id: "p220_3", numero: "3", contenu: "Les droits superficiaires annuels par carré cadastral, dont le montant est fixé par voie réglementaire." },
      { id: "p220_4", numero: "4", contenu: "Les taxes à l'exportation conformément aux dispositions légales et réglementaires en vigueur." },
    ],
    keywords: ["fiscal", "redevance", "taxes", "droits superficiaires"],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // TITRE XVI — DISPOSITIONS TRANSITOIRES
  // ════════════════════════════════════════════════════════════════════════════

  // ── Chapitre III : Des partenariats avec l'État ───────────────────────────
  {
    id: "art_331", numero: "331", titre: "De la faculté de maintenir les partenariats conclus avec l'État",
    sectionId: "s_p3_1", chapitreId: "ch_p3",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["partenariats", "État", "abrogé"],
  },
  {
    id: "art_332", numero: "332", titre: "Des reconductions des droits miniers ou de carrières",
    sectionId: "s_p3_1", chapitreId: "ch_p3",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["reconduction", "droits miniers", "carrières", "abrogé"],
  },
  {
    id: "art_333", numero: "333", titre: "De l'établissement de nouveaux titres",
    sectionId: "s_p3_1", chapitreId: "ch_p3",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["nouveaux titres", "abrogé"],
  },

  // ── Chapitre IV : De la mise en application des nouvelles dispositions ────

  // Section I
  {
    id: "art_334", numero: "334", titre: "Des modalités d'application de la présente loi",
    sectionId: "s_p4_1", chapitreId: "ch_p4",
    modification: "modifié par l'article 16 de la Loi n° 18/001 du 09 mars 2018",
    paragraphes: [
      {
        id: "p334_1", numero: "Al. 1",
        contenu: "Les modalités d'application des dispositions du présent Code sont fixées par le Règlement minier tel que modifié et complété et par d'autres décrets d'application pris dans les 90 jours suivant la promulgation de la présente loi.",
      },
      {
        id: "p334_2", numero: "Al. 2",
        contenu: "En attendant la publication des mesures prévues à l'alinéa précédent du présent article, les modalités d'application urgentes peuvent être prises par voie d'arrêté ministériel ou interministériel, le cas échéant.",
      },
      {
        id: "p334_3", numero: "Al. 3",
        contenu: "Les modalités d'application du présent Code sont fixées par le Règlement Minier révisé, tel que modifié et complété et par d'autres décrets d'application pris dans les 90 jours suivant la promulgation de la Loi n° 18/001 du 09 mars 2018. En attendant la publication du Règlement Minier révisé, les modalités d'application urgentes pouvaient être prises par Arrêté Ministériel ou Interministériel, le cas échéant.",
      },
    ],
    keywords: ["modalités", "application", "règlement minier", "décrets", "90 jours"],
  },
  {
    id: "art_335", numero: "335",
    titre: "De la suspension des demandes des droits miniers et de carrières, des cartes d'exploitation artisanale et d'agrément",
    sectionId: "s_p4_1", chapitreId: "ch_p4",
    modification: "modifié par l'article 16 de la Loi n° 18/001 du 09 mars 2018",
    paragraphes: [
      {
        id: "p335_1", numero: "Al. 1",
        contenu: "Les nouvelles demandes d'octroi de droits miniers et de carrières de recherches, des cartes d'exploitant artisanal et de négociant ainsi que les demandes d'agrément au titre de comptoirs d'achat et de vente des substances minérales, des entités de traitement, des coopératives minières agréées sont suspendues pendant la période qui court de la promulgation de la présente loi à l'entrée en vigueur du Règlement minier révisé.",
      },
      {
        id: "p335_2", numero: "Al. 2",
        contenu: "Les demandes d'octroi des droits miniers ou de carrières d'exploitation, les demandes de renouvellement, de mutations, d'amodiation, d'extension, de sûretés relatives aux droits miniers ou des carrières en cours de validité, la réalisation de tous autres actes et procédés juridiques concernant de tels droits se font au cours de la période visée à l'alinéa précédent conformément aux dispositions du présent Code et des autres règlements en vigueur.",
      },
      {
        id: "p335_3", numero: "Al. 3",
        contenu: "Au cours de la période visée par le premier alinéa du présent article, une commission ad hoc instituée par le ministre procède à l'inventaire des gisements miniers dont les droits miniers et des carrières ont été versés dans le domaine public conformément aux dispositions du présent Code.",
        note: "Le Législateur suspend, entre le 09 mars 2018 et l'entrée en vigueur du Règlement Minier révisé (08 juin 2018), toutes les nouvelles demandes de droits miniers et de carrières, des cartes d'exploitation artisanale et de négociant ainsi que les demandes d'agrément. Les demandes introduites avant le 09 mars 2018 se déroulent conformément aux versions 2002 du Code Minier et 2003 du Règlement Minier. Enfin, le Législateur instruit le Ministre des Mines de mettre en place une commission ad hoc chargée de l'inventaire des gisements miniers versés dans le domaine public.",
      },
    ],
    keywords: ["suspension", "demandes", "droits miniers", "règlement minier révisé", "commission ad hoc"],
  },

  // Section II
  {
    id: "art_336", numero: "336", titre: "De la validation des droits miniers et de carrières en vigueur",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["validation", "droits miniers", "abrogé"],
  },
  {
    id: "art_337", numero: "337", titre: "De la procédure de validation des droits miniers et de carrières en vigueur",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["procédure", "validation", "abrogé"],
  },
  {
    id: "art_338", numero: "338", titre: "De la commission de validation des droits miniers et de carrières",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["commission", "validation", "abrogé"],
  },
  {
    id: "art_339", numero: "339", titre: "De la transformation des droits miniers ou de carrières existants",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["transformation", "droits existants", "abrogé"],
  },
  {
    id: "art_340", numero: "340", titre: "De la validité des conventions minières",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "modifié par l'article 16 de la Loi n° 18/001 du 09 mars 2018",
    paragraphes: [
      {
        id: "p340_1", numero: "Al. 1",
        contenu: "Toutes les conventions minières en vigueur à la promulgation de la présente loi sont régies par les dispositions du présent Code.",
        note: "Le Législateur abolit le régime conventionnel et opte pour l'application immédiate des dispositions du présent Code. Ainsi, tous les titulaires sont soumis à l'ensemble des obligations, notamment celles liées au maintien de validité de leurs droits à peine de déchéance.",
      },
    ],
    keywords: ["conventions minières", "régime conventionnel", "application immédiate"],
  },
  {
    id: "art_341", numero: "341", titre: "De l'agrément des Mandataires en mines et carrières",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["agrément", "mandataires", "mines", "abrogé"],
  },
  {
    id: "art_342", numero: "342", titre: "Des droits miniers et des carrières se trouvant dans le cas de force majeure",
    sectionId: "s_p4_2", chapitreId: "ch_p4",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018.",
    keywords: ["force majeure", "droits miniers", "abrogé"],
  },

  // Section III
  {
    id: "art_342bis", numero: "342 bis", titre: "De la garantie de stabilité",
    sectionId: "s_p4_3", chapitreId: "ch_p4",
    modification: "inséré par l'article 30 de la Loi n° 18/001 du 09 mars 2018",
    paragraphes: [
      {
        id: "p342b_1", numero: "Al. 1",
        contenu: "Les dispositions de la présente loi sont d'application immédiate à l'ensemble des titulaires des droits miniers valides à la date de son entrée en vigueur.",
      },
      {
        id: "p342b_2", numero: "Al. 2",
        contenu: "En cas de modification législative dans les cinq ans à dater de l'entrée en vigueur du présent Code, les titulaires des droits miniers visés à l'alinéa précédent bénéficient de la garantie de stabilité du régime fiscal, douanier et de change du présent Code.",
        note: "Le Législateur garantit la stabilité du régime fiscal, douanier et de change du présent Code, en cas de modification législative dans les cinq (05) ans à dater de l'entrée en vigueur du présent Code révisé. Dès lors, une révision au-delà de ce terme est directement et indistinctement applicable à tous. Il convient de noter que cet article figure dans la version coordonnée du Journal Officiel comme étant l'article 342 et non 342 bis.",
      },
    ],
    keywords: ["garantie", "stabilité", "régime fiscal", "douanier", "change", "5 ans"],
  },
  {
    id: "art_342ter", numero: "342 ter",
    titre: "Du délai d'application de l'obligation de traitement et de transformation en RDC pour les titulaires actuels des droits miniers",
    sectionId: "s_p4_3", chapitreId: "ch_p4",
    modification: "inséré par l'article 30 de la Loi n° 18/001 du 09 mars 2018",
    paragraphes: [
      {
        id: "p342t_1", numero: "Al. 1",
        contenu: "Les titulaires des droits miniers en cours de validité disposent d'un délai de trois ans pour procéder, sur le territoire de la République Démocratique du Congo, au traitement et à la transformation des substances minérales par eux exploitées.",
      },
      {
        id: "p342t_2", numero: "Al. 2",
        contenu: "Le délai prévu à l'alinéa premier du présent article ne peut être réduit ou prorogé que par une modification de la présente disposition par les deux chambres du Parlement.",
      },
      {
        id: "p342t_3", numero: "Al. 3",
        contenu: "La présente disposition produit ses effets dès l'entrée en vigueur de la présente loi.",
        note: "Le Législateur accorde un délai de trois (03) ans aux titulaires des droits miniers pour procéder, sur le territoire de la RDC, au traitement et à la transformation des substances minérales par eux exploitées, à dater du 09 mars 2018. Cette disposition est à combiner avec les articles 108 bis à 108 quater. Il convient de noter que cet article figure dans la version coordonnée du Journal Officiel comme étant l'article 342 bis et non 342 ter.",
      },
    ],
    keywords: ["traitement", "transformation", "délai", "trois ans", "RDC", "Parlement"],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // TITRE XVII — DISPOSITIONS ABROGATOIRES ET FINALES
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: "art_343", numero: "343", titre: "Des dispositions abrogatoires",
    sectionId: "s_p17_1", chapitreId: "ch_p17",
    introduction: "Sont abrogées à la date, selon le cas, de la promulgation ou de l'entrée en vigueur de la présente loi :",
    paragraphes: [
      {
        id: "p343_a", numero: "a",
        contenu: "Ordonnance-Loi n°81-013 du 2 avril 1981 portant législation générale sur les mines et les hydrocarbures telle que modifiée et complétée à ce jour, à l'exception des dispositions applicables aux hydrocarbures, et sauf en ce qui concerne les conventions minières dûment signées et approuvées à la promulgation du présent Code.",
      },
      {
        id: "p343_b", numero: "b",
        contenu: "L'article 4 de la Loi n°77-027 du 17 novembre 1977 portant mesures générales de rétrocession des biens zaïrianisés ou radicalisés en ce qui concerne les mines et les carrières.",
      },
      {
        id: "p343_c", numero: "c",
        contenu: "La Loi n°74-019 du 15 septembre 1974 portant création d'une brigade minière.",
      },
      {
        id: "p343_d", numero: "d",
        contenu: "L'Ordonnance-Loi n°72-005 du 14 janvier 1972 tendant à renforcer la protection de certaines substances contre le vol.",
      },
      {
        id: "p343_e", numero: "e",
        contenu: "L'Ordonnance n°84-082 du 30 mars 1984 portant règlement des activités des comptoirs d'achat des substances minérales précieuses.",
      },
      {
        id: "p343_f", numero: "f",
        contenu: "Le Décret n°0012 du 22 janvier 1997 instituant un nouveau tarif des droits et taxes à l'importation en ce qui concerne les mines et carrières.",
      },
      {
        id: "p343_g", numero: "g",
        contenu: "Le Décret n°121 du 11 septembre 1998 portant création d'un service public à caractère social dénommé Service d'Achats des Substances Minérales Précieuses « S.A.S.M.I.P. » et ses mesures d'exécution.",
      },
      {
        id: "p343_h", numero: "h",
        contenu: "La Loi n°78-017 du 11 juillet 1978, en ce qui concerne les emprunts destinés à financer les activités minières des sociétés privées dans le cadre de la jouissance de leurs droits miniers.",
      },
      {
        id: "p343_i", numero: "i",
        contenu: "Toutes dispositions légales et réglementaires contraires aux dispositions du présent Code.",
      },
    ],
    keywords: ["dispositions abrogatoires", "abrogation", "ordonnance-loi", "décrets abrogés"],
  },
  {
    id: "art_344", numero: "344", titre: "De l'entrée en vigueur du présent Code minier",
    sectionId: "s_p17_1", chapitreId: "ch_p17",
    modification: "abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018",
    contenu: "Article abrogé par l'article 31 de la Loi n° 18/001 du 09 mars 2018. Fait à Lubumbashi, le 11 juillet 2002, modifiée et complétée à Kinshasa, le 09 mars 2018.",
    keywords: ["entrée en vigueur", "abrogé", "Lubumbashi", "Kinshasa", "2002", "2018"],
  },
]

// ─── Dialog : Titre ───────────────────────────────────────────────────────────

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
            <Label htmlFor="ti-num">Numéro</Label>
            <Input id="ti-num" placeholder="ex. I, II, XVI…" value={numero} onChange={(e) => setNumero(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ti-titre">Intitulé du titre</Label>
            <Textarea id="ti-titre" placeholder="DISPOSITIONS GÉNÉRALES…" value={titre} onChange={(e) => setTitre(e.target.value)} rows={3} />
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

function ChapterFormDialog({
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
    if (!numero.trim() || !titre.trim()) return
    onSave({ numero: numero.trim(), titre: titre.trim(), titreId: titreId || undefined })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Modifier le chapitre" : "Ajouter un chapitre"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {titres.length > 0 && (
            <div className="space-y-1.5">
              <Label>Titre parent</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={titreId}
                onChange={(e) => setTitreId(e.target.value)}
              >
                <option value="">— Aucun titre —</option>
                {titres.map((t) => (
                  <option key={t.id} value={t.id}>Titre {t.numero} — {t.titre}</option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="ch-num">Numéro</Label>
            <Input id="ch-num" placeholder="ex. Ier, II, III…" value={numero} onChange={(e) => setNumero(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ch-titre">Intitulé du chapitre</Label>
            <Textarea id="ch-titre" placeholder="DES DÉFINITIONS DES TERMES…" value={titre} onChange={(e) => setTitre(e.target.value)} rows={3} />
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

// ─── Dialog : Section ─────────────────────────────────────────────────────────

function SectionFormDialog({
  open, onClose, initial, chapitres, defaultChapitreId, onSave,
}: {
  open: boolean
  onClose: () => void
  initial?: Section
  chapitres: Chapitre[]
  defaultChapitreId?: string
  onSave: (data: Pick<Section, "numero" | "titre" | "chapitreId">) => void
}) {
  const [numero, setNumero] = useState("")
  const [titre, setTitre] = useState("")
  const [chapitreId, setChapitreId] = useState("")

  useEffect(() => {
    if (open) {
      setNumero(initial?.numero ?? "")
      setTitre(initial?.titre ?? "")
      setChapitreId(initial?.chapitreId ?? defaultChapitreId ?? chapitres[0]?.id ?? "")
    }
  }, [open, initial, defaultChapitreId, chapitres])

  function save() {
    if (!numero.trim() || !titre.trim() || !chapitreId) return
    onSave({ numero: numero.trim(), titre: titre.trim(), chapitreId })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Modifier la section" : "Ajouter une section"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Chapitre parent</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={chapitreId}
              onChange={(e) => setChapitreId(e.target.value)}
            >
              {chapitres.map((ch) => (
                <option key={ch.id} value={ch.id}>Chapitre {ch.numero}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sec-num">Numéro de section</Label>
            <Input id="sec-num" placeholder="ex. I, II, III…" value={numero} onChange={(e) => setNumero(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sec-titre">Intitulé de la section</Label>
            <Textarea id="sec-titre" placeholder="Des définitions des termes…" value={titre} onChange={(e) => setTitre(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={save} disabled={!numero.trim() || !titre.trim() || !chapitreId}>{initial ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Dialog : Article ─────────────────────────────────────────────────────────

function ArticleFormDialog({
  open, onClose, initial, sections, chapitres, defaultSectionId, onSave,
}: {
  open: boolean
  onClose: () => void
  initial?: Article
  sections: Section[]
  chapitres: Chapitre[]
  defaultSectionId?: string
  onSave: (data: ArticleSaveData) => void
}) {
  const [sectionId, setSectionId] = useState("")
  const [numero, setNumero] = useState("")
  const [titre, setTitre] = useState("")
  const [modification, setModification] = useState("")
  const [introduction, setIntroduction] = useState("")
  const [contenu, setContenu] = useState("")
  const [hasParagraphes, setHasParagraphes] = useState(false)
  const [paragraphes, setParagraphes] = useState<Paragraphe[]>([])
  const [keywords, setKeywords] = useState("")

  useEffect(() => {
    if (open) {
      setSectionId(initial?.sectionId ?? defaultSectionId ?? sections[0]?.id ?? "")
      setNumero(initial?.numero ?? "")
      setTitre(initial?.titre ?? "")
      setModification(initial?.modification ?? "")
      setIntroduction(initial?.introduction ?? "")
      setContenu(initial?.contenu ?? "")
      const hasPara = !!(initial?.paragraphes?.length)
      setHasParagraphes(hasPara)
      setParagraphes(initial?.paragraphes ? initial.paragraphes.map((p) => ({ ...p })) : [])
      setKeywords(initial?.keywords.join(", ") ?? "")
    }
  }, [open, initial, defaultSectionId, sections])

  function addParagraphe() {
    setParagraphes((prev) => [
      ...prev,
      { id: `p${Date.now()}`, numero: String(prev.length + 1), contenu: "", note: "" },
    ])
  }

  function updateParagraphe(id: string, field: keyof Paragraphe, value: string) {
    setParagraphes((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  function removeParagraphe(id: string) {
    setParagraphes((prev) => prev.filter((p) => p.id !== id))
  }

  function save() {
    if (!numero.trim() || !titre.trim() || !sectionId) return
    const selectedSection = sections.find((s) => s.id === sectionId)
    onSave({
      numero: numero.trim(),
      titre: titre.trim(),
      sectionId,
      chapitreId: selectedSection?.chapitreId ?? "",
      modification: modification.trim() || undefined,
      introduction: hasParagraphes ? (introduction.trim() || undefined) : undefined,
      contenu: !hasParagraphes ? (contenu.trim() || undefined) : undefined,
      paragraphes: hasParagraphes
        ? paragraphes.filter((p) => p.contenu.trim()).map((p) => ({ ...p, note: p.note?.trim() || undefined }))
        : undefined,
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Modifier l'article" : "Ajouter un article"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Section + Numéro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Section parente</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
              >
                {sections.map((s) => {
                  const ch = chapitres.find((c) => c.id === s.chapitreId)
                  return (
                    <option key={s.id} value={s.id}>
                      Chap. {ch?.numero} — Sect. {s.numero}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="art-num">Numéro d'article</Label>
              <Input id="art-num" placeholder="ex. 1er, 2, 68…" value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
          </div>

          {/* Titre */}
          <div className="space-y-1.5">
            <Label htmlFor="art-titre">Titre de l'article</Label>
            <Input id="art-titre" placeholder="Des définitions" value={titre} onChange={(e) => setTitre(e.target.value)} />
          </div>

          {/* Modification */}
          <div className="space-y-1.5">
            <Label htmlFor="art-modif">Mention de modification <span className="text-muted-foreground font-normal">(optionnel)</span></Label>
            <Input id="art-modif" placeholder="modifié par l'article 1er de la Loi n° 18/001 du 09 mars 2018" value={modification} onChange={(e) => setModification(e.target.value)} />
          </div>

          {/* Toggle paragraphes */}
          <label className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasParagraphes}
              onChange={(e) => setHasParagraphes(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">Cet article contient des paragraphes numérotés</span>
          </label>

          {hasParagraphes ? (
            <>
              {/* Introduction */}
              <div className="space-y-1.5">
                <Label htmlFor="art-intro">Texte d'introduction <span className="text-muted-foreground font-normal">(optionnel)</span></Label>
                <Input id="art-intro" placeholder="Aux termes du présent Code, on entend par :" value={introduction} onChange={(e) => setIntroduction(e.target.value)} />
              </div>

              {/* Paragraphes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Paragraphes</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addParagraphe}>
                    <Plus className="w-3 h-3 mr-1" /> Ajouter un paragraphe
                  </Button>
                </div>

                {paragraphes.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                    Aucun paragraphe. Cliquez sur « Ajouter un paragraphe » pour commencer.
                  </p>
                )}

                {paragraphes.map((para, idx) => (
                  <div key={para.id} className="border border-border rounded-lg p-3 space-y-2.5 bg-muted/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground shrink-0 w-16">N° {idx + 1}</span>
                      <Input
                        placeholder="Numéro (ex. 1, 1 bis, 2…)"
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
                      placeholder="Note du législateur (optionnel)…"
                      value={para.note ?? ""}
                      onChange={(e) => updateParagraphe(para.id, "note", e.target.value)}
                      rows={2}
                      className="text-xs text-muted-foreground resize-none"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="art-contenu">Contenu de l'article</Label>
              <Textarea id="art-contenu" placeholder="Texte complet de l'article…" value={contenu} onChange={(e) => setContenu(e.target.value)} rows={5} className="resize-none" />
            </div>
          )}

          {/* Mots-clés */}
          <div className="space-y-1.5">
            <Label htmlFor="art-kw">Mots-clés <span className="text-muted-foreground font-normal">(séparés par des virgules)</span></Label>
            <Input id="art-kw" placeholder="définitions, acheteur, activités minières…" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={save} disabled={!numero.trim() || !titre.trim() || !sectionId}>
            {initial ? "Enregistrer" : "Créer l'article"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Dialog : Confirmation de suppression ─────────────────────────────────────

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

// ─── Callbacks passés au sommaire ─────────────────────────────────────────────

interface TOCCallbacks {
  onAddTitre: () => void
  onEditTitre: (t: Titre) => void
  onDeleteTitre: (t: Titre) => void
  onAddChapitre: (titreId?: string) => void
  onEditChapitre: (ch: Chapitre) => void
  onDeleteChapitre: (ch: Chapitre) => void
  onPdfChapitre: (ch: Chapitre) => void
  onAddSection: (chapitreId: string) => void
  onEditSection: (s: Section) => void
  onDeleteSection: (s: Section) => void
  onPdfSection: (s: Section, ch: Chapitre) => void
  onAddArticle: (sectionId: string, chapitreId: string) => void
  onEditArticle: (a: Article) => void
  onDeleteArticle: (a: Article) => void
}

// ─── Sommaire ─────────────────────────────────────────────────────────────────

function TableOfContents({
  titres, chapitres, sections, articles,
  selectedArticle, onSelectArticle, onClose, callbacks,
  pCanAdd, pCanEdit, pCanDelete,
}: {
  titres: Titre[]
  chapitres: Chapitre[]
  sections: Section[]
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
  const orphanChapitres = chapitres.filter((c) => !c.titreId)
  const sectionsOf = (chapitreId: string) => sections.filter((s) => s.chapitreId === chapitreId)
  const articlesOf = (sectionId: string) => articles.filter((a) => a.sectionId === sectionId)
  const artCount   = (chapitreId: string) => articles.filter((a) => a.chapitreId === chapitreId).length

  function renderChapitre(ch: Chapitre) {
    return (
      <AccordionItem
        key={ch.id}
        value={`ch-${ch.id}`}
        className="border border-border/50 rounded-md overflow-hidden"
      >
        <AccordionTrigger className="hover:no-underline px-3 py-2.5 bg-muted/40 hover:bg-muted/70 [&>svg]:shrink-0 [&>svg]:ml-1">
          <div className="flex items-start gap-2 w-full text-left group/ch">
            <span className="text-[11px] font-bold text-primary/80 shrink-0 mt-0.5 uppercase">Chap.&nbsp;{ch.numero}</span>
            <span className="flex-1 text-[11px] font-semibold uppercase tracking-wide leading-tight line-clamp-2">{ch.titre}</span>
            <div className="flex items-center gap-0.5 shrink-0 ml-1">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{artCount(ch.id)}</Badge>
              <button onClick={(e) => { e.stopPropagation(); callbacks.onPdfChapitre(ch) }} className="p-1 rounded hover:bg-emerald-500/10 hover:text-emerald-600 opacity-0 group-hover/ch:opacity-100 transition-opacity" title="Télécharger en PDF">
                <Download className="w-3 h-3" />
              </button>
              {pCanEdit && <button onClick={(e) => { e.stopPropagation(); callbacks.onEditChapitre(ch) }} className="p-1 rounded hover:bg-primary/10 hover:text-primary opacity-0 group-hover/ch:opacity-100 transition-opacity">
                <Pencil className="w-3 h-3" />
              </button>}
              {pCanDelete && <button onClick={(e) => { e.stopPropagation(); callbacks.onDeleteChapitre(ch) }} className="p-1 rounded hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/ch:opacity-100 transition-opacity">
                <Trash2 className="w-3 h-3" />
              </button>}
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-0 pb-0">
          <Accordion type="multiple" className="w-full">
            {sectionsOf(ch.id).map((sec) => {
              const secArts = articlesOf(sec.id)
              return (
                <AccordionItem key={sec.id} value={`sec-${sec.id}`} className="border-0 border-t border-border/30">
                  <AccordionTrigger className="hover:no-underline px-3 py-2 hover:bg-muted/40 [&>svg]:shrink-0 [&>svg]:ml-1">
                    <div className="flex items-start gap-2 w-full text-left group/sec">
                      <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">§&nbsp;{sec.numero}</span>
                      <span className="flex-1 text-xs font-medium italic leading-tight line-clamp-2">{sec.titre}</span>
                      <div className="flex items-center gap-0.5 shrink-0 ml-1">
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">{secArts.length}</Badge>
                        <button onClick={(e) => { e.stopPropagation(); callbacks.onPdfSection(sec, ch) }} className="p-1 rounded hover:bg-emerald-500/10 hover:text-emerald-600 opacity-0 group-hover/sec:opacity-100 transition-opacity" title="Télécharger en PDF">
                          <Download className="w-3 h-3" />
                        </button>
                        {pCanEdit && <button onClick={(e) => { e.stopPropagation(); callbacks.onEditSection(sec) }} className="p-1 rounded hover:bg-primary/10 hover:text-primary opacity-0 group-hover/sec:opacity-100 transition-opacity">
                          <Pencil className="w-3 h-3" />
                        </button>}
                        {pCanDelete && <button onClick={(e) => { e.stopPropagation(); callbacks.onDeleteSection(sec) }} className="p-1 rounded hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/sec:opacity-100 transition-opacity">
                          <Trash2 className="w-3 h-3" />
                        </button>}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <div className="pl-4 pr-2 space-y-0.5">
                      {secArts.map((art) => (
                        <div key={art.id} className="group/art flex items-center gap-1">
                          <button
                            onClick={() => { onSelectArticle(art); onClose?.() }}
                            className={cn(
                              "flex-1 text-left text-xs px-2 py-1.5 rounded transition-colors",
                              "hover:bg-primary/10 hover:text-primary",
                              selectedArticle?.id === art.id ? "bg-primary/15 text-primary font-medium" : "text-foreground/80"
                            )}
                          >
                            <span className="font-mono text-[10px] text-muted-foreground mr-1">Art.&nbsp;{art.numero}</span>
                            {art.titre}
                          </button>
                          {(pCanEdit || pCanDelete) && (
                            <div className="flex gap-0.5 opacity-0 group-hover/art:opacity-100 transition-opacity shrink-0">
                              {pCanEdit && <button onClick={() => callbacks.onEditArticle(art)} className="p-1 rounded hover:bg-primary/10 hover:text-primary"><Pencil className="w-3 h-3" /></button>}
                              {pCanDelete && <button onClick={() => callbacks.onDeleteArticle(art)} className="p-1 rounded hover:bg-destructive/10 hover:text-destructive"><Trash2 className="w-3 h-3" /></button>}
                            </div>
                          )}
                        </div>
                      ))}
                      {pCanAdd && <button onClick={() => callbacks.onAddArticle(sec.id, sec.chapitreId)} className="w-full text-left text-[11px] px-2 py-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/5 flex items-center gap-1 transition-colors">
                        <Plus className="w-3 h-3" /> Ajouter un article
                      </button>}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
          {pCanAdd && <button onClick={() => callbacks.onAddSection(ch.id)} className="w-full text-left text-[11px] px-3 py-2 border-t border-border/30 text-muted-foreground hover:text-primary hover:bg-muted/40 flex items-center gap-1 transition-colors">
            <Plus className="w-3 h-3" /> Ajouter une section
          </button>}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <div className="space-y-1">
      {/* Titres avec leurs chapitres */}
      <Accordion type="multiple" className="w-full space-y-1">
        {titres.map((t) => (
          <AccordionItem key={t.id} value={`t-${t.id}`} className="border border-primary/30 rounded-md overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-3 py-2.5 bg-primary/5 hover:bg-primary/10 [&>svg]:shrink-0 [&>svg]:ml-1">
              <div className="flex items-start gap-2 w-full text-left group/ti">
                <span className="text-[11px] font-bold text-primary shrink-0 mt-0.5 uppercase">Titre&nbsp;{t.numero}</span>
                <span className="flex-1 text-[11px] font-semibold uppercase tracking-wide leading-tight line-clamp-2">{t.titre}</span>
                <div className="flex items-center gap-0.5 shrink-0 ml-1">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{chapitresOf(t.id).length} chap.</Badge>
                  {pCanEdit && <button onClick={(e) => { e.stopPropagation(); callbacks.onEditTitre(t) }} className="p-1 rounded hover:bg-primary/10 hover:text-primary opacity-0 group-hover/ti:opacity-100 transition-opacity">
                    <Pencil className="w-3 h-3" />
                  </button>}
                  {pCanDelete && <button onClick={(e) => { e.stopPropagation(); callbacks.onDeleteTitre(t) }} className="p-1 rounded hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/ti:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-0">
              <div className="pl-2 py-1 space-y-1">
                <Accordion type="multiple" className="w-full space-y-1">
                  {chapitresOf(t.id).map((ch) => renderChapitre(ch))}
                </Accordion>
                {pCanAdd && <button onClick={() => callbacks.onAddChapitre(t.id)} className="w-full text-left text-[11px] px-3 py-2 rounded text-muted-foreground hover:text-primary hover:bg-muted/40 flex items-center gap-1 transition-colors border-t border-border/30 mt-1">
                  <Plus className="w-3 h-3" /> Ajouter un chapitre
                </button>}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Chapitres sans titre */}
      {orphanChapitres.length > 0 && (
        <div className="space-y-1 mt-1">
          <Accordion type="multiple" className="w-full space-y-1">
            {orphanChapitres.map((ch) => renderChapitre(ch))}
          </Accordion>
        </div>
      )}

      {/* Ajouter un titre */}
      {pCanAdd && <button
        onClick={callbacks.onAddTitre}
        className="w-full text-left text-[11px] px-3 py-2.5 mt-1 rounded-md border border-dashed border-primary/30 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 flex items-center gap-1.5 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Ajouter un titre
      </button>}
    </div>
  )
}

// ─── Vue article ──────────────────────────────────────────────────────────────

function ArticleView({
  article, section, chapitre, onBack, onEdit, pCanEdit,
}: {
  article: Article
  section?: Section
  chapitre?: Chapitre
  onBack: () => void
  onEdit: () => void
  pCanEdit: boolean
}) {
  function handleDownload() {
    const pdfArt: PdfArticle = {
      numero: article.numero,
      titre: article.titre,
      modification: article.modification,
      introduction: article.introduction,
      contenu: article.contenu,
      paragraphes: article.paragraphes,
      keywords: article.keywords,
    }
    const context = `Chapitre ${chapitre?.numero} — Section ${section?.numero}`
    exportArticlePdf(pdfArt, "Code Minier", context)
  }

  return (
    <div className="space-y-5">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
        <span>Code minier</span>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span>Chap.&nbsp;{chapitre?.numero}</span>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span>Sect.&nbsp;{section?.numero}</span>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="text-foreground font-medium">Art.&nbsp;{article.numero}</span>
      </nav>

      {/* En-tête */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
            Chapitre {chapitre?.numero} — Section {section?.numero}
          </p>
          <div className="flex gap-1.5 shrink-0">
            <Button variant="outline" size="sm" onClick={handleDownload} className="h-7 text-xs gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-950/40">
              <Download className="w-3 h-3" /> PDF
            </Button>
            {pCanEdit && <Button variant="outline" size="sm" onClick={onEdit} className="shrink-0 h-7 text-xs gap-1">
              <Pencil className="w-3 h-3" /> Modifier
            </Button>}
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
          Article {article.numero} : <span className="font-semibold">{article.titre}</span>
        </h2>

        {article.modification && (
          <p className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded px-2 py-1">
            <Info className="w-3 h-3 shrink-0" />
            {article.modification}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {article.keywords.map((kw) => (
            <Badge key={kw} variant="outline" className="text-[11px] px-2 py-0.5">{kw}</Badge>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Corps */}
      <div className="space-y-4">
        {article.introduction && (
          <p className="text-sm sm:text-base text-foreground leading-relaxed font-medium">
            {article.introduction}
          </p>
        )}

        {article.paragraphes && article.paragraphes.length > 0 && (
          <div className="space-y-4">
            {article.paragraphes.map((para) => (
              <div key={para.id} className="space-y-1.5">
                <div className="flex gap-3">
                  <span className="shrink-0 min-w-10 text-right font-semibold text-sm text-primary mt-0.5">
                    {para.numero}.
                  </span>
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">{para.contenu}</p>
                </div>
                {para.note && (
                  <div className="ml-13 bg-muted/50 rounded-md px-3 py-2 border-l-2 border-primary/30">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">{para.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {article.contenu && (
          <p className="text-sm sm:text-base text-foreground leading-relaxed">{article.contenu}</p>
        )}
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Section :</span> {section?.titre}
        </p>
        <Button variant="outline" size="sm" onClick={onBack}>← Retour aux résultats</Button>
      </div>
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function CodeBrowser() {
  const { data: session } = useSession()
  const role = (session?.user as { role?: string } | undefined)?.role
  const pCanAdd    = canAdd(role)
  const pCanEdit   = canEdit(role)
  const pCanDelete = canDelete(role)

  const [titres,    setTitres]    = useState<Titre[]>(initialTitres)
  const [chapitres, setChapitres] = useState<Chapitre[]>(initialChapitres)
  const [sections,  setSections]  = useState<Section[]>(initialSections)
  const [articles,  setArticles]  = useState<Article[]>(initialArticles)

  const [searchQuery,     setSearchQuery]     = useState("")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [mobileNavOpen,   setMobileNavOpen]   = useState(false)

  const [titreDialog,   setTitreDialog]   = useState<{ open: boolean; editing?: Titre }>({ open: false })
  const [chapterDialog, setChapterDialog] = useState<{ open: boolean; editing?: Chapitre; defaultTitreId?: string }>({ open: false })
  const [sectionDialog, setSectionDialog] = useState<{ open: boolean; editing?: Section; defaultChapitreId?: string }>({ open: false })
  const [articleDialog, setArticleDialog] = useState<{ open: boolean; editing?: Article; defaultSectionId?: string }>({ open: false })
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean; type?: "titre" | "chapitre" | "section" | "article"; id?: string; label?: string
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
    setSections((prev) => prev.filter((s) => !chapIds.includes(s.chapitreId)))
    setChapitres((prev) => prev.filter((c) => c.titreId !== id))
    setTitres((prev) => prev.filter((t) => t.id !== id))
    if (selectedArticle && chapIds.includes(selectedArticle.chapitreId)) setSelectedArticle(null)
  }

  // ── CRUD Chapitres ────────────────────────────────────────────────────────
  function saveChapitre(data: Pick<Chapitre, "numero" | "titre" | "titreId">) {
    if (chapterDialog.editing) {
      setChapitres((prev) => prev.map((c) => c.id === chapterDialog.editing!.id ? { ...c, ...data } : c))
    } else {
      setChapitres((prev) => [...prev, { id: `ch${Date.now()}`, ...data }])
    }
  }

  function deleteChapitre(id: string) {
    setArticles((prev) => prev.filter((a) => a.chapitreId !== id))
    setSections((prev) => prev.filter((s) => s.chapitreId !== id))
    setChapitres((prev) => prev.filter((c) => c.id !== id))
    if (selectedArticle?.chapitreId === id) setSelectedArticle(null)
  }

  // ── CRUD Sections ─────────────────────────────────────────────────────────
  function saveSection(data: Pick<Section, "numero" | "titre" | "chapitreId">) {
    if (sectionDialog.editing) {
      setSections((prev) => prev.map((s) => s.id === sectionDialog.editing!.id ? { ...s, ...data } : s))
    } else {
      setSections((prev) => [...prev, { id: `s${Date.now()}`, ...data }])
    }
  }

  function deleteSection(id: string) {
    setArticles((prev) => prev.filter((a) => a.sectionId !== id))
    setSections((prev) => prev.filter((s) => s.id !== id))
    if (selectedArticle?.sectionId === id) setSelectedArticle(null)
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
    if (deleteConfirm.type === "section")  deleteSection(deleteConfirm.id)
    if (deleteConfirm.type === "article")  deleteArticle(deleteConfirm.id)
    setDeleteConfirm({ open: false })
  }

  // ── Callbacks sommaire ────────────────────────────────────────────────────
  const tocCallbacks: TOCCallbacks = {
    onAddTitre:       ()    => setTitreDialog({ open: true }),
    onEditTitre:      (t)   => setTitreDialog({ open: true, editing: t }),
    onDeleteTitre:    (t)   => setDeleteConfirm({ open: true, type: "titre", id: t.id, label: `Titre ${t.numero}` }),
    onAddChapitre:    (tid) => setChapterDialog({ open: true, defaultTitreId: tid }),
    onEditChapitre:   (ch)  => setChapterDialog({ open: true, editing: ch }),
    onDeleteChapitre: (ch)  => setDeleteConfirm({ open: true, type: "chapitre", id: ch.id, label: `Chapitre ${ch.numero}` }),
    onPdfChapitre: (ch) => {
      const chapSections = sections.filter((s) => s.chapitreId === ch.id)
      const pdfSections: PdfSection[] = chapSections.map((s) => ({
        numero: s.numero,
        titre: s.titre,
        articles: articles.filter((a) => a.sectionId === s.id).map((a) => ({
          numero: a.numero, titre: a.titre, modification: a.modification,
          introduction: a.introduction, contenu: a.contenu,
          paragraphes: a.paragraphes, keywords: a.keywords,
        })),
      }))
      const pdfCh: PdfChapitre = { numero: ch.numero, titre: ch.titre, sections: pdfSections }
      exportChapitrePdf(pdfCh, "Code Minier")
    },
    onAddSection:     (cid) => setSectionDialog({ open: true, defaultChapitreId: cid }),
    onEditSection:    (s)   => setSectionDialog({ open: true, editing: s }),
    onDeleteSection:  (s)   => setDeleteConfirm({ open: true, type: "section", id: s.id, label: `Section ${s.numero}` }),
    onPdfSection: (s, ch) => {
      const pdfSec: PdfSection = {
        numero: s.numero,
        titre: s.titre,
        articles: articles.filter((a) => a.sectionId === s.id).map((a) => ({
          numero: a.numero, titre: a.titre, modification: a.modification,
          introduction: a.introduction, contenu: a.contenu,
          paragraphes: a.paragraphes, keywords: a.keywords,
        })),
      }
      exportSectionPdf(pdfSec, `Chapitre ${ch.numero}`, "Code Minier")
    },
    onAddArticle:     (sid) => setArticleDialog({ open: true, defaultSectionId: sid }),
    onEditArticle:    (a)   => setArticleDialog({ open: true, editing: a }),
    onDeleteArticle:  (a)   => setDeleteConfirm({ open: true, type: "article", id: a.id, label: `Article ${a.numero}` }),
  }

  // ── Recherche ─────────────────────────────────────────────────────────────
  const filteredArticles = articles.filter((a) => {
    const q = searchQuery.toLowerCase()
    return (
      a.titre.toLowerCase().includes(q) ||
      a.numero.toLowerCase().includes(q) ||
      a.contenu?.toLowerCase().includes(q) ||
      a.introduction?.toLowerCase().includes(q) ||
      a.paragraphes?.some((p) => p.contenu.toLowerCase().includes(q)) ||
      a.keywords.some((k) => k.toLowerCase().includes(q))
    )
  })

  const findSection  = (id: string) => sections.find((s) => s.id === id)
  const findChapitre = (id: string) => chapitres.find((c) => c.id === id)

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
            <CardDescription className="text-xs">Titres · Chapitres · Sections · Articles</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[calc(100vh-14rem)] overflow-y-auto pr-2">
            <TableOfContents
              titres={titres} chapitres={chapitres} sections={sections} articles={articles}
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
                      titres={titres} chapitres={chapitres} sections={sections} articles={articles}
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
                  placeholder="Rechercher dans le Code minier…"
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
                section={findSection(selectedArticle.sectionId)}
                chapitre={findChapitre(selectedArticle.chapitreId)}
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
                  const sec = findSection(art.sectionId)
                  const ch  = findChapitre(art.chapitreId)
                  const preview = art.introduction ?? art.paragraphes?.[0]?.contenu ?? art.contenu ?? ""

                  return (
                    <div key={art.id} className="group/card relative">
                      <button
                        onClick={() => setSelectedArticle(art)}
                        className="w-full text-left p-3 sm:p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/40 transition-all"
                      >
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1.5">
                          <span>Chap.&nbsp;{ch?.numero}</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                          <span>Sect.&nbsp;{sec?.numero}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 pr-16">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground text-sm sm:text-base leading-snug">
                              Article {art.numero} — {art.titre}
                            </p>
                            {art.modification && (
                              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">{art.modification}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{preview}</p>
                          </div>
                          {art.paragraphes && (
                            <Badge variant="secondary" className="text-[10px] shrink-0 self-start">
                              {art.paragraphes.length}&nbsp;§
                            </Badge>
                          )}
                        </div>
                      </button>

                      {/* Actions rapides */}
                      <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <Button
                          variant="outline" size="icon" className="h-7 w-7 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800"
                          title="Télécharger en PDF"
                          onClick={(e) => {
                            e.stopPropagation()
                            exportArticlePdf(
                              { numero: art.numero, titre: art.titre, modification: art.modification, introduction: art.introduction, contenu: art.contenu, paragraphes: art.paragraphes, keywords: art.keywords },
                              "Code Minier",
                              `Chapitre ${findChapitre(art.chapitreId)?.numero} — Section ${findSection(art.sectionId)?.numero}`,
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
      <ChapterFormDialog
        open={chapterDialog.open}
        onClose={() => setChapterDialog({ open: false })}
        initial={chapterDialog.editing}
        titres={titres}
        defaultTitreId={chapterDialog.defaultTitreId}
        onSave={saveChapitre}
      />
      <SectionFormDialog
        open={sectionDialog.open}
        onClose={() => setSectionDialog({ open: false })}
        initial={sectionDialog.editing}
        chapitres={chapitres}
        defaultChapitreId={sectionDialog.defaultChapitreId}
        onSave={saveSection}
      />
      <ArticleFormDialog
        open={articleDialog.open}
        onClose={() => setArticleDialog({ open: false })}
        initial={articleDialog.editing}
        sections={sections}
        chapitres={chapitres}
        defaultSectionId={articleDialog.defaultSectionId}
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
