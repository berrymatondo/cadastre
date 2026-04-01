import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { AIChat } from "@/components/ai-chat"

export default function AssistantPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Assistant IA"
          subtitle="Posez vos questions sur le droit minier"
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <AIChat />
          </div>
        </main>
      </div>
    </div>
  )
}
