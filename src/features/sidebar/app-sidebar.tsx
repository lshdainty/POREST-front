import {
  Home,
  Calendar,
  Briefcase,
  BookOpen,
  Cake,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/shadcn/sidebar"
import { NavLogo } from "@/features/sidebar/nav-logo"
import { NavUser } from "@/features/sidebar/nav-user"
import { NavContent } from "@/features/sidebar/nav-content"

const user = {
  name: "lsh",
  email: "lsh@example.com",
  image: "/avatars/shadcn.jpg",
}

const navDatas = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    isActive: true,
    items: [
      { title: "Overview", url: "/dashboard/overview" },
      { title: "Analytics", url: "/dashboard/analytics" },
      { title: "Reports", url: "/dashboard/reports" },
    ],
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar
  },
  {
    title: "Work",
    url: "work",
    icon: Briefcase
  },
  {
    title: "Culture",
    url: "/culture",
    icon: Cake
  },
  {
    title: "Rule",
    url: "/rule",
    icon: BookOpen
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
          <NavContent items={navDatas} />
      </SidebarContent>
      <SidebarFooter>
          <NavUser user={user}/>
      </SidebarFooter>
    </Sidebar>
  )
}