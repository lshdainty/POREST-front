import {
  SidebarInset,
  SidebarProvider,
} from "@/components/shadcn/sidebar"
import { AppSidebar } from "@/features/sidebar/app-sidebar"
import { LayoutHeader } from "@/features/layout/layout-header"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <LayoutHeader />
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  )
}