import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { ConflictsTable } from "@/components/conflicts-table"

export default function ConflitsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Gestion des conflits"
          subtitle="Suivi et résolution des litiges miniers"
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            <ConflictsTable />
          </div>
        </main>
      </div>
    </div>
  )
}
