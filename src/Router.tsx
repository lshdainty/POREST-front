import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from '@/view/login/Login'
import Home from '@/view/home/Home'
import Work from '@/view/work/Work'
import Culture from '@/view/culture/Culture'
import Rule from '@/view/rule/Rule'

const Router = () => {
  const [home, setHome] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();

  console.log(home);

  useEffect(() => {
    if (home !== undefined && !home) {
      console.log("this?");
      navigate('/login');
    }
  }, []);

  return (
    <Routes>
      <Route path='/login' element={!home ? <Login/> : <Navigate replace to ='/' />} />
      <Route path='/' element={<Home/>} />
      <Route path='/work' element={<Work/>} />
      <Route path='/culture' element={<Culture/>} />
      <Route path='/rule' element={<Rule/>} />
      <Route path='/*' element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default Router;