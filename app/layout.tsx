import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { RoleThemeLoader } from "@/components/role-theme-loader"
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Cadastre Minier - CAMI',
  description: 'Plateforme de digitalisation du Code minier et du Règlement minier avec assistant IA',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/cami.png', type: 'image/png' }],
    apple: '/cami.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased dark">
        <RoleThemeLoader />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
