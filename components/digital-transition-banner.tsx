"use client"

import Image from "next/image"
import { ArrowRight, ScanLine, Database, FileText } from "lucide-react"

const steps = [
  {
    label: "Documents papier",
    caption: "Archives, registres et dossiers miniers physiques accumulés depuis des décennies",
    Icon: FileText,
    img: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=75",
    alt: "Piles de documents et archives papier",
  },
  {
    label: "Numérisation",
    caption: "Scanning, indexation et structuration des textes juridiques et cartographiques",
    Icon: ScanLine,
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=75",
    alt: "Processus de numérisation de documents",
  },
  {
    label: "Plateforme digitale",
    caption: "Recherche intelligente, assistant IA et accès instantané depuis n'importe où",
    Icon: Database,
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=75",
    alt: "Dashboard digital avec données structurées",
  },
]

export function DigitalTransitionBanner() {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
        <h2 className="text-sm sm:text-base font-semibold text-foreground">
          De l'archive papier à la plateforme digitale
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          La digitalisation du cadastre minier en trois étapes clés
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex sm:flex-col flex-1">
            {/* Card */}
            <div className="flex sm:flex-col flex-row flex-1 group">
              {/* Image */}
              <div className="relative w-28 sm:w-full h-28 sm:h-48 shrink-0 overflow-hidden">
                <Image
                  src={step.img}
                  alt={step.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 112px, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                {/* Step badge */}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                  {idx + 1}
                </div>
                {/* Icon pill (desktop only, bottom of image) */}
                <div className="hidden sm:flex absolute bottom-3 left-3">
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-1">
                    <step.Icon className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs text-white font-medium">{step.label}</span>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 px-3 sm:px-4 py-3 flex flex-col justify-center gap-1">
                {/* Mobile: title with icon */}
                <div className="flex sm:hidden items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <step.Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="font-semibold text-sm text-foreground">{step.label}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {step.caption}
                </p>
              </div>
            </div>

            {/* Separator + arrow between steps */}
            {idx < steps.length - 1 && (
              <>
                {/* Mobile: horizontal separator */}
                <div className="sm:hidden border-b border-border mx-3" />
                {/* Desktop: vertical divider + arrow */}
                <div className="hidden sm:flex flex-col items-center justify-center w-px self-stretch bg-border relative">
                  <div className="absolute bg-card border border-border rounded-full p-1 shadow-sm">
                    <ArrowRight className="w-3 h-3 text-primary" />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
