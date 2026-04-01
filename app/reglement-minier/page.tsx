"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { ReglementBrowser } from "@/components/reglement-browser";

export default function ReglementMinierPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Règlement minier"
          subtitle="Consultation et recherche dans le Règlement minier"
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <ReglementBrowser />
          </div>
        </main>
      </div>
    </div>
  );
}
