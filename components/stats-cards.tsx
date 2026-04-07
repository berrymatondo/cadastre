"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, FileText, Gavel, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Articles du Code",
    value: "847",
    change: "+12 ce mois",
    icon: BookOpen,
    color: "text-chart-1",
    href: "/code-minier",
    img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=75",
    imgAlt: "Livres de droit et code minier",
  },
  {
    title: "Textes réglementaires",
    value: "234",
    change: "+5 ce mois",
    icon: FileText,
    color: "text-chart-2",
    href: "/reglement-minier",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=75",
    imgAlt: "Documents officiels et textes réglementaires",
  },
  {
    title: "Jurisprudences",
    value: "156",
    change: "+8 ce mois",
    icon: Gavel,
    color: "text-chart-3",
    href: "/jurisprudence",
    img: "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=600&q=75",
    imgAlt: "Marteau de juge et salle d'audience",
  },
  {
    title: "Requêtes IA",
    value: "1 234",
    change: "+23% ce mois",
    icon: TrendingUp,
    color: "text-chart-4",
    href: "/assistant",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=600&q=75",
    imgAlt: "Intelligence artificielle et analyse de données",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link key={stat.title} href={stat.href} className="group">
          <Card className="bg-card border-border overflow-hidden transition-colors group-hover:border-primary/50">
            <div className="relative h-24 sm:h-28 w-full overflow-hidden">
              <Image
                src={stat.img}
                alt={stat.imgAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
              <div className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              </div>
              <div className="absolute bottom-2 left-3">
                <p className="text-xl sm:text-2xl font-bold text-white leading-none">{stat.value}</p>
              </div>
            </div>
            <CardContent className="px-3 py-2 sm:px-4 sm:py-3">
              <p className="text-xs font-medium text-foreground leading-tight group-hover:text-primary transition-colors">{stat.title}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stat.change}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
