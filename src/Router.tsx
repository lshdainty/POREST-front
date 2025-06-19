import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useToken } from '@/hooks/useToken';
import Login from '@/view/login/Login';
import Layout from '@/features/layout/layout';
import Dashboard from '@/features/dashboard/Dashboard';
import Calendar from '@/features/calendar/Calendar';
import Work from '@/features/work/Work';
import Culture from '@/features/culture/Culture';
import Rule from '@/features/rule/Rule';
import User from '@/features/user/User';

import NotFound from '@/components/notFound/NotFound';

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
      <Route element={<Layout/>}>
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