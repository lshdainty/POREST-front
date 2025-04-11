import Nav from '@/components/nav/Nav';
import Header from '@/components/header/Header';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import '@/view/layout/layout.scss'

const Layout = () => {
  return (
    <Suspense fallback={"Loading.............."}>
      <div className='layout'>
        <Header />
        <Nav />
        <Outlet />
      </div>
    </Suspense>
  )
}

export default Layout;