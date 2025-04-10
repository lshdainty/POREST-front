import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sidebar, Menu, MenuItem, menuClasses, MenuItemStyles } from 'react-pro-sidebar'
import { Home, EditNote, Celebration, Rule, Settings, AccountCircleRounded } from '@mui/icons-material'

import '@/components/nav/Nav.scss'

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const sidebarStyles = {
  color: '#607489',
  height: '100vh',
  borderRightWidth: '0'
}

const menuItemStyles: MenuItemStyles = {
  root: {
    fontSize: '13px',
    fontWeight: 400,
  },
  icon: {
    color: '#00a9ff',
    marginRight: '15px'
  },
  button: {
    '&:hover': {
      backgroundColor: hexToRgba('#c5e4ff', 1),
      color: '#44596e',
    },
    [`&.${menuClasses.active}`]: {
      borderBottomStyle: 'solid',
      borderBottomWidth: '2px',
      borderBottomColor: '#00a9ff',
      backgroundColor: hexToRgba('#00a9ff', 0.2),
      color: '#44596e'
    },
    paddingLeft: '14px',
    paddingRight: '14px',
  },
  label: ({ open }) => ({
    fontWeight: open ? 600 : undefined,
  }),
}

const Nav = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

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
          icon={<Home />}
          component={<Link to={"/"} />}
        >Home</MenuItem>
        <MenuItem
          active={location.pathname === '/work'}
          icon={<EditNote />}
          component={<Link to={"/work"} />}
        >Work</MenuItem>
        <MenuItem
          active={location.pathname === '/culture'}
          icon={<Celebration />}
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
        <MenuItem icon={<AccountCircleRounded />}>Logout</MenuItem>
        <MenuItem icon={<Settings />}>Setting</MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default Nav;