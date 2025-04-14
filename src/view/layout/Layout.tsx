import Nav from '@/components/nav/Nav';
import Header from '@/components/header/Header';
import Loading from '@/components/loading/Loading';
import { Outlet } from 'react-router-dom';

import '@/view/layout/layout.scss'

const Layout: React.FC = () => {
  return (
    <div className='layout'>
      <Loading />
      <Header />
      <Nav />
      <Outlet />
    </div>
  )
}

export default Layout;