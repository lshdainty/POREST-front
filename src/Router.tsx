import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useToken } from '@/hooks/useToken';

import Login from '@/features/login/login';
import Layout from '@/features/layout/layout';

import Dashboard from '@/features/home/dashboard/Dashboard';
import Calendar from '@/features/home/calendar/Calendar';

import History from '@/features/vacation/history/History';
import Application from '@/features/vacation/application/Application';

import Dues from '@/features/culture/dues/Dues';
import Rule from '@/features/culture/rule/Rule';

import Report from '@/features/work/report/Report';
import Schedule from '@/features/work/schedule/Schedule';

import Users from '@/features/admin/users/Users';
import Vacation from '@/features/admin/vacation/Vacation';
import Authority from '@/features/admin/authority/Authority';
import Holiday from '@/features/admin/holiday/Holiday';

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
          <Route path='history' element={<History/>} />
          <Route path='application' element={<Application/>} />
        </Route>
        {/* 업무 page */}
        <Route path='work'>
          <Route path='report' element={<Report/>} />
          <Route path='schedule' element={<Schedule/>} />
        </Route>
        {/* 조직 문화 page */}
        <Route path='culture'>
          <Route path='dues' element={<Dues/>} />
          <Route path='rule' element={<Rule/>} />
        </Route>
        {/* 관리자 page */}
        <Route path='admin'>
          <Route path='users' element={<Users/>} />
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