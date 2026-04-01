import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SearchModule } from "@/components/search-module"

export default function RecherchePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Recherche"
          subtitle="Recherche avancée dans tous les textes juridiques"
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-5xl mx-auto">
            <SearchModule />
          </div>
        </main>
      </div>
    </div>
  )
}
