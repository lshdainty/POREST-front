import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar, Menu, MenuItem, menuClasses, MenuItemStyles } from 'react-pro-sidebar'
import { DashboardRounded, CalendarMonthRounded, BorderColorRounded, Diversity3Rounded, Rule, SettingsRounded, PersonRounded } from '@mui/icons-material'

import '@/components/nav/Nav.scss'

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const sidebarStyles = {
  color: '#495771',
  height: '100vh',
  borderRightWidth: '0'
}

const menuItemStyles: MenuItemStyles = {
  root: {
    fontSize: '13px',
    fontWeight: 400,
  },
  icon: {
    color: '#495771',
    marginRight: '20px',
    [`&.${menuClasses.active}`]: {
      color: '#0080fc'
    },
  },
  button: {
    '&:hover': {
      backgroundColor: hexToRgba('#495771', 0.1),
      color: '#495771',
    },
    [`&.${menuClasses.active}`]: {
      borderBottomStyle: 'solid',
      borderBottomWidth: '2px',
      borderBottomColor: '#0080fc',
      color: '#0080fc'
    },
    paddingLeft: '14px',
    paddingRight: '14px',
  },
  label: ({ open }) => ({
    fontWeight: open ? 600 : undefined,
  }),
}

const Nav: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('key');
    navigate('/login')
  }

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor={'#fafafa'}
      width={'200px'}
      collapsedWidth={'60px'}
      rootStyles={sidebarStyles}
    >
      <Menu
        menuItemStyles={menuItemStyles}
        onMouseOver={()=>{setCollapsed(false)}}
        onMouseOut={()=>{setCollapsed(true)}}
      >
        <MenuItem
          active={location.pathname === '/'}
          icon={<DashboardRounded />}
          component={<Link to={"/"} />}
        >Dashboard</MenuItem>
        <MenuItem
          active={location.pathname === '/calendar'}
          icon={<CalendarMonthRounded />}
          component={<Link to={"/calendar"} />}
        >Calendar</MenuItem>
        <MenuItem
          active={location.pathname === '/work'}
          icon={<BorderColorRounded />}
          component={<Link to={"/work"} />}
        >Work</MenuItem>
        <MenuItem
          active={location.pathname === '/culture'}
          icon={<Diversity3Rounded />}
          component={<Link to={"/culture"} />}
        >Culture</MenuItem>
        <MenuItem
          active={location.pathname === '/rule'}
          icon={<Rule />}
          component={<Link to={"/rule"} />}
        >Rule</MenuItem>
      </Menu>
      <Menu
        menuItemStyles={menuItemStyles}
        onMouseOver={()=>{setCollapsed(false)}}
        onMouseOut={()=>{setCollapsed(true)}}
      >
        <MenuItem
          icon={<PersonRounded />}
          onClick={logout}>Logout</MenuItem>
        <MenuItem icon={<SettingsRounded />}>Setting</MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default Nav;