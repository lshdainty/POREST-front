import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useToken } from '@/hooks/useToken';
import Login from '@/view/login/Login';
import Layout2 from '@/view2/layout';
import Layout from '@/view/layout/Layout';
import NotFound from '@/components/notFound/NotFound';
import Dashboard from '@/view/dashboard/Dashboard';
import Calendar from '@/view/calendar/Calendar';
import Work from '@/view/work/Work';
import Culture from '@/view/culture/Culture';
import Rule from '@/view/rule/Rule';
import User from '@/view/user/User';

const Router = () => {
  const [home, setHome] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();

  useToken(setHome);

  useEffect(() => {
    if (home !== undefined && !home) {
      navigate('/login');
    }
  }, [home]);

  return (
    <Routes>
      <Route path='/login' element={!home ? <Login/> : <Navigate replace to ='/' />} />
      <Route element={<Layout2 />}>
      </Route>
      <Route element={<Layout />}>
        <Route path='/' element={<Dashboard/>} />
        <Route path='/calendar' element={<Calendar/>} />
        <Route path='/work' element={<Work/>} />
        <Route path='/culture' element={<Culture/>} />
        <Route path='/rule' element={<Rule/>} />
        <Route path='/user' element={<User/>} />
      </Route>
      <Route path='/*' element={<NotFound/>} />
    </Routes>
  );
}

export default Router;