import Nav from '@/components/nav/Nav';
import Header from '@/components/header/Header';
import { Outlet } from 'react-router-dom';

import '@/view/layout/layout.scss'

const Layout = () => {
  return (
    <div className='layout'>
      <Header />
      <Nav />
      <Outlet />
    </div>
  )
}

export default Layout;