import Logo from '@/assets/img/logo.svg';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar"

export function NavLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:!p-0"
        >
          <img src={Logo} alt='logo' className="h-10"></img>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}