import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '@/components/nav/Nav';
import Header from '@/components/header/Header';
import Loading from '@/components/loading/Loading';

import '@/view/layout/layout.scss';

const Layout: React.FC = () => {
  return (
    <div className='layout'>
      <Header />
      <Nav />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default Layout;