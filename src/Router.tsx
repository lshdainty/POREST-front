import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useToken } from '@/hooks/useToken';

import Login from '@/features/login/login';
import Layout from '@/features/layout/layout';
import Dashboard from '@/features/dashboard/Dashboard';
import Calendar from '@/features/calendar/Calendar';
import Work from '@/features/work/Work';
import Dues from '@/features/dues/Dues';
import Rule from '@/features/rule/Rule';
import Rule2 from '@/features/rule/Rule2';
import User from '@/features/user/User';
import Vacation from '@/features/vacation/Vacation';
import Authority from '@/features/authority/Authority';
import Holiday from '@/features/holiday/Holiday';

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
      <Route path='/login' element={!home ? <Login/> : <Navigate replace to ='/dashboard' />} />
      <Route element={<Layout/>}>
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/calendar' element={<Calendar/>} />
        <Route path='/work/report' element={<Work/>} />
        <Route path='/culture/dues' element={<Dues/>} />
        <Route path='/culture/rule' element={<Rule/>} />
        <Route path='/culture/rule2' element={<Rule2/>} />
        <Route path='/admin/user' element={<User/>} />
        <Route path='/admin/vacation' element={<Vacation/>} />
        <Route path='/admin/authority' element={<Authority/>} />
        <Route path='/admin/holiday' element={<Holiday/>} />
      </Route>
      <Route path='/*' element={<NotFound/>} />
    </Routes>
  );
}

export default Router;