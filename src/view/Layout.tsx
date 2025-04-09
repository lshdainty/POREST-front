import Nav from '@/components/nav/Nav';
import Header from '@/components/header/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div style={{ display: 'flex', height: '100%'}}>
      <Header />
      <Nav />
      <Outlet />
    </div>
  )
}

export default Layout;