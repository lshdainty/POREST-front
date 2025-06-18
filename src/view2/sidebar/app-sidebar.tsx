import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { NavLogo } from "@/view2/sidebar/nav-logo"
import { NavUser } from "@/view2/sidebar/nav-user"

const user = {
    name: "lsh",
    email: "lsh@example.com",
    image: "/avatars/shadcn.jpg",
  }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
          // nav-main 참고해서 넣기
      </SidebarContent>
      <SidebarFooter>
          <NavUser user={user}/>
      </SidebarFooter>
    </Sidebar>
  )
}