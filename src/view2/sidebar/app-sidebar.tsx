import {
  ChevronRight,
  Home,
  Calendar,
  Briefcase,
  DollarSign,
  BookOpen,
  Users,
  Settings,
  LogOut,
  User,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/shadcn/sidebar"
import { NavLogo } from "@/view2/sidebar/nav-logo"
import { NavUser } from "@/view2/sidebar/nav-user"
import { NavContent } from "@/view2/sidebar/nav-content"

const user = {
  name: "lsh",
  email: "lsh@example.com",
  image: "/avatars/shadcn.jpg",
}

const navDatas = [
  {
    title: "Dashboard",
    url: "/test",
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
    url: "/test/calendar",
    icon: Calendar,
    items: [
      // { title: "Schedule", url: "/dashboard/calendar/schedule" },
      // { title: "Events", url: "/dashboard/calendar/events" },
      // { title: "Meetings", url: "/dashboard/calendar/meetings" },
    ],
  },
  {
    title: "Work",
    url: "/test/work",
    icon: Briefcase,
    items: [
      // { title: "Attendance", url: "/dashboard/work/attendance" },
      // { title: "Time Tracking", url: "/dashboard/work/time-tracking" },
      // { title: "Projects", url: "/dashboard/work/projects" },
      // { title: "Performance", url: "/dashboard/work/performance" },
    ],
  },
  {
    title: "Culture",
    url: "/test/culture",
    icon: DollarSign,
    items: [
      // { title: "Payroll", url: "/dashboard/dues/payroll" },
      // { title: "Benefits", url: "/dashboard/dues/benefits" },
      // { title: "Expenses", url: "/dashboard/dues/expenses" },
      // { title: "Tax Documents", url: "/dashboard/dues/tax-documents" },
    ],
  },
  {
    title: "Rule",
    url: "/test/rule",
    icon: BookOpen,
    items: [
      // { title: "Policies", url: "/dashboard/rule/policies" },
      // { title: "Procedures", url: "/dashboard/rule/procedures" },
      // { title: "Compliance", url: "/dashboard/rule/compliance" },
      // { title: "Training", url: "/dashboard/rule/training" },
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