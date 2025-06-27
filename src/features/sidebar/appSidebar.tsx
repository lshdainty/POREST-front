import {
  Home,
  Calendar,
  Briefcase,
  BookOpen,
  Cake,
  UserPen,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/shadcn/sidebar"
import { NavLogo } from "@/features/sidebar/navLogo"
import { NavUser } from "@/features/sidebar/navUser"
import { NavContent } from "@/features/sidebar/navContent"

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
    // isActive: true,
    items: [
      { title: "Overview", url: "/overview" },
    ],
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    items: [
      { title: "Overview", url: "/calendar/overview" },
    ],
  },
  {
    title: "Work",
    url: "work",
    icon: Briefcase,
    items: [
      { title: "Overview", url: "/work/overview" },
    ],
  },
  {
    title: "Culture",
    url: "/culture",
    icon: Cake,
    items: [
      { title: "Overview", url: "/culture/overview" },
    ],
  },
  {
    title: "Rule",
    url: "/rule",
    icon: BookOpen,
    items: [
      { title: "Overview", url: "/rule/overview" },
    ],
  },
  {
    title: "User",
    url: "/user",
    icon: UserPen,
    items: [
      { title: "Overview", url: "/user/overview" },
    ],
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