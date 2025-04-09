import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useToken } from '@/hooks/useToken'
import Login from '@/view/login/Login'
import Layout from '@/view/Layout'
import Home from '@/view/home/Home'
import Work from '@/view/work/Work'
import Culture from '@/view/culture/Culture'
import Rule from '@/view/rule/Rule'


const Router = () => {
  const [home, setHome] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();

  console.log("router  ", home);

  useToken(setHome);

  useEffect(() => {
    console.log("router useEffect!!!!")
    console.log("useEffect home : ", home);

    if (home !== undefined && !home) {
      console.log("this?");
      navigate('/login');
    }
  }, [home]);

  return (
    <Routes>
      <Route path='/login' element={!home ? <Login/> : <Navigate replace to ='/' />} />
      <Route element={<Layout />}>
        <Route path='/' element={<Home/>} />
        <Route path='/work' element={<Work/>} />
        <Route path='/culture' element={<Culture/>} />
        <Route path='/rule' element={<Rule/>} />
        <Route path='/*' element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  )
}

export default Router;