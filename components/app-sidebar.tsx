"use client"

import type * as React from "react"
import { BarChart3, Building2, Calculator, Home, Settings, Tag, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CharqueRiomarLogo } from "@/components/charque-riomar-logo"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Categorias",
      url: "/categorias", 
      icon: Tag,
    },
    {
      title: "Setores",
      url: "/setores",
      icon: Building2,
    },
    {
      title: "Lançamentos",
      url: "/lancamentos",
      icon: Calculator,
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Usuários",
      url: "/usuarios",
      icon: Users,
    },
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" className="w-52" {...props}> {/* ✅ Reduzido para 208px */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="cursor-pointer">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white border border-slate-200"> {/* ✅ Logo menor */}
                  <CharqueRiomarLogo size="sm" className="size-6" /> {/* ✅ Ícone menor */}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-red-600">Charque Riomar</span>
                  <span className="truncate text-xs">Sistema Financeiro</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs">Principal</SidebarGroupLabel> {/* ✅ Texto menor */}
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="cursor-pointer">
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" /> {/* ✅ Ícones menores */}
                      <span className="text-sm">{item.title}</span> {/* ✅ Texto menor */}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="text-xs">Administração</SidebarGroupLabel> {/* ✅ Texto menor */}
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="cursor-pointer">
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" /> {/* ✅ Ícones menores */}
                      <span className="text-sm">{item.title}</span> {/* ✅ Texto menor */}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}