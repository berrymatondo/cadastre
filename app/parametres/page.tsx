import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { ParametresForm } from "@/components/parametres-form"

export default function ParametresPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader title="Paramètres" subtitle="Configuration de l'application" />
        <main className="flex-1 p-4 sm:p-6 max-w-2xl">
          <ParametresForm />
        </main>
      </div>
    </div>
  )
}
