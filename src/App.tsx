import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './view/home/Home'
import Work from './view/work/Work'
import Culture from './view/culture/Culture'
import Rule from './view/rule/Rule'
import Login from './view/login/Login'
import Nav from './components/nav/Nav'
import './App.css';

const App = () => {
  return (
    <BrowserRouter basename='/web'>
    <div className='App'>
      <Nav></Nav>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/work' element={<Work/>} />
        <Route path='/culture' element={<Culture/>} />
        <Route path='/rule' element={<Rule/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
