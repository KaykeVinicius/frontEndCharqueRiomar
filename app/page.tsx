import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Dashboard />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
