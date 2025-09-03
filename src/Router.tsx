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
        {/* 메인 page */}
        <Route path=''>
          <Route path='dashboard' element={<Dashboard/>} />
          <Route path='calendar' element={<Calendar/>} />
        </Route>
        {/* 휴가 page */}
        <Route path='vacation'>
          <Route path='history' element={<></>} />
          <Route path='application' element={<></>} />
        </Route>
        {/* 작업 일지 page */}
        <Route path='work'>
          <Route path='report' element={<Work/>} />
          <Route path='schedule' element={<></>} />
        </Route>
        {/* 조직 문화 page */}
        <Route path='culture'>
          <Route path='dues' element={<Dues/>} />
          <Route path='rule' element={<Rule/>} />
        </Route>
        {/* 관리자 page */}
        <Route path='admin'>
          <Route path='user' element={<User/>} />
          <Route path='vacation' element={<Vacation/>} />
          <Route path='authority' element={<Authority/>} />
          <Route path='holiday' element={<Holiday/>} />
        </Route>
      </Route>
      <Route path='/*' element={<NotFound/>} />
    </Routes>
  );
}

export default Router;