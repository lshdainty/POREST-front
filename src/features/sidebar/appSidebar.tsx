import {
  Home,
  Briefcase,
  Cake,
  ShieldUser,
  LayoutDashboard,
  CalendarDays,
  CircleDollarSign,
  Scale,
  Users,
  Plane,
  ShieldCheck,
  CalendarCog,
  TreePalm,
  MessageSquarePlus,
  ChartNoAxesCombined,
  NotebookPen,
  ChartGantt
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/shadcn/sidebar';
import { NavLogo } from '@/features/sidebar/navLogo';
import { NavUser } from '@/features/sidebar/navUser';
import { NavContent } from '@/features/sidebar/navContent';

const user = {
  name: 'lsh',
  email: 'lsh@example.com',
  image: '/avatars/shadcn.jpg',
}

const navDatas = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
    items: [
      { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
      { title: 'Calendar', url: '/calendar', icon: CalendarDays }
    ],
  },
  {
    title: 'Vacation',
    url: '/vacation',
    icon: TreePalm,
    items: [
      { title: 'History', url: '/vacation/history', icon: ChartNoAxesCombined },
      { title: 'Application', url: '/vacation/application', icon: MessageSquarePlus },
    ],
  },
  {
    title: 'Work',
    url: '/work',
    icon: Briefcase,
    items: [
      { title: 'Report', url: '/work/report', icon: NotebookPen },
      { title: 'Schedule', url: '/work/schedule', icon: ChartGantt },
    ],
  },
  {
    title: 'Culture',
    url: '/culture',
    icon: Cake,
    items: [
      { title: 'Dues', url: '/culture/dues', icon: CircleDollarSign },
      { title: 'Rule', url: '/culture/rule', icon: Scale },
    ],
  },
  {
    title: 'Admin',
    url: '/admin',
    icon: ShieldUser,
    items: [
      { title: 'User', url: '/admin/user', icon: Users },
      { title: 'Vacation', url: '/admin/vacation', icon: Plane },
      { title: 'Authority', url: '/admin/authority', icon: ShieldCheck },
      { title: 'Holiday', url: '/admin/holiday', icon: CalendarCog },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
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