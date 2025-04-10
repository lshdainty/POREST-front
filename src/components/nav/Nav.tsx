import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, menuClasses, MenuItemStyles } from 'react-pro-sidebar';
import { Home, EditNote, Celebration, Rule } from '@mui/icons-material';

type Theme = 'light' | 'dark';

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#607489',
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#515ce6',
      hover: {
        backgroundColor: '#c5e4ff',
        color: '#44596e',
      },
      disabled: {
        color: '#9fb6cf',
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: '#0b2948',
      color: '#8ba1b7',
    },
    menu: {
      menuContent: '#082440',
      icon: '#59d0ff',
      hover: {
        backgroundColor: '#00458b',
        color: '#b6c8d9',
      },
      disabled: {
        color: '#3e5e7e',
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const Nav = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '13px',
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      
    },
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, 1),
        color: themes[theme].menu.hover.color,
      },
      paddingLeft: '14px',
      paddingRight: '14px',
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  }

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 1)}
      width={'200px'}
      collapsedWidth={'60px'}
      rootStyles={{
        color: themes[theme].sidebar.color,
        height: '100vh',
      }}
    >
      <Menu
        rootStyles={{
          marginTop: '70px',
        }}
        menuItemStyles={menuItemStyles}
        onMouseOver={()=>{setCollapsed(false)}}
        onMouseOut={()=>{setCollapsed(true)}}
      >
        <MenuItem icon={<Home />} component={<Link to={"/"} />}>Home</MenuItem>
        <MenuItem icon={<EditNote />} component={<Link to={"/work"} />}>Work</MenuItem>
        <MenuItem icon={<Celebration />} component={<Link to={"/culture"} />}>Culture</MenuItem>
        <MenuItem icon={<Rule />} component={<Link to={"/rule"} />}>Rule</MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default Nav;