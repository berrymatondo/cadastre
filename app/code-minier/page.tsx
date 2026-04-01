import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { CodeBrowser } from "@/components/code-browser"

export default function CodeMinierPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Code minier"
          subtitle="Consultation et recherche dans le Code minier"
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <CodeBrowser />
          </div>
        </main>
      </div>
    </div>
  )
}
