import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DocumentsTable } from "@/components/documents-table"

export default function DocumentsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Documents"
          subtitle="Gestion et suivi des documents officiels"
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            <DocumentsTable />
          </div>
        </main>
      </div>
    </div>
  )
}
