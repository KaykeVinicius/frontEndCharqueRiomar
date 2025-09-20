import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { UsuariosContent } from "@/components/usuarios-content"

export default function UsuariosPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <UsuariosContent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
