import {
  IconInnerShadowTop,
} from "@tabler/icons-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:!p-1.5"
        >
          <a href="#">
            <IconInnerShadowTop className="!size-5" />
            <span className="text-base font-semibold">Acme Inc.</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}