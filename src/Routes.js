import React, { Component } from 'react';
import { Routes as Routes, Route, Navigate } from 'react-router-dom'
import Home from './view/home/Home'
import Work from './view/work/Work'
import Culture from './view/culture/Culture'
import Rule from './view/rule/Rule'
import Login from './view/login/Login'

class Routes {
  return () {
    <Routes>
      <Route path='/' exact={true} element={<Home/>} />
      <Route path='/work' element={<Work/>} />
      <Route path='/culture' element={<Culture/>} />
      <Route path='/rule' element={<Rule/>} />
      <Route path='/login' element={<Login/>} />
    </Routes>
  }
}

export default Routes;