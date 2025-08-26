import {
  Home,
  Briefcase,
  Cake,
  ShieldUser,
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
      { title: 'Dashboard', url: '/dashboard' },
      { title: 'Calendar', url: '/calendar' }
    ],
  },
  {
    title: 'Work',
    url: '/work',
    icon: Briefcase,
    items: [
      { title: 'Report', url: '/work/report' },
    ],
  },
  {
    title: 'Culture',
    url: '/culture',
    icon: Cake,
    items: [
      { title: 'Dues', url: '/culture/dues' },
      { title: 'Rule', url: '/culture/rule' },
    ],
  },
  {
    title: 'Admin',
    url: '/admin',
    icon: ShieldUser,
    items: [
      { title: 'User', url: '/admin/user' },
      { title: 'Vacation', url: '/admin/vacation' },
      { title: 'Authority', url: '/admin/authority' },
      { title: 'Holiday', url: '/admin/holiday' },
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