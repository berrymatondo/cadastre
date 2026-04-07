"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ScanLine, Database, FileText } from "lucide-react";

const steps = [
  {
    label: "Documents papier",
    caption: "Archives, registres et dossiers miniers physiques accumulés depuis des décennies",
    Icon: FileText,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    label: "Numérisation",
    caption: "Scanning, indexation et structuration des textes juridiques et cartographiques",
    Icon: ScanLine,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    label: "Plateforme digitale",
    caption: "Recherche intelligente, assistant IA et accès instantané depuis n'importe où",
    Icon: Database,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
];

export function DigitalTransitionBanner() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-3 text-left hover:bg-muted/30 transition-colors rounded-xl"
      >
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            De l&apos;archive papier à la plateforme digitale
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
            La digitalisation du cadastre minier en trois étapes clés
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-border">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 divide-border">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex sm:flex-col flex-1 items-center sm:items-start gap-3 px-4 sm:px-5 py-4 relative">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-10 h-10 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center`}>
                    <step.Icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground sm:hidden">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="hidden sm:inline text-[11px] font-bold text-muted-foreground/60 tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-semibold text-foreground">{step.label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.caption}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center absolute right-0 top-0 h-full w-px">
                    <div className="h-full w-px bg-border" />
                    <div className="absolute bg-card rounded-full p-0.5 border border-border">
                      <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
