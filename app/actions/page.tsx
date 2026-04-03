import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { ActionsTable } from "@/components/actions-table"

export default function ActionsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Actions"
          subtitle="Liste des tâches et actions à suivre"
        />
        <main className="flex-1 p-4 sm:p-6">
          <ActionsTable />
        </main>
      </div>
    </div>
  )
}
