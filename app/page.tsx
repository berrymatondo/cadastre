import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"
import { ProjectTimeline } from "@/components/project-timeline"
import { DigitalTransitionBanner } from "@/components/digital-transition-banner"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Tableau de bord"
          subtitle="Bienvenue sur la plateforme de digitalisation du cadastre minier"
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Transition papier → digital */}
            <DigitalTransitionBanner />

            {/* Stats */}
            <StatsCards />

            {/* Main Content */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <QuickActions />
              <ProjectTimeline />
            </div>

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  )
}
