import { Outlet } from 'react-router-dom';
import Nav from '@/components/nav/Nav';
import Header from '@/components/header/Header';

import '@/view/layout/layout.scss';

const Layout: React.FC = () => {
  return (
    <div className='layout'>
      <Header />
      <Nav />
      <Outlet />
    </div>
  );
}

export default Layout;