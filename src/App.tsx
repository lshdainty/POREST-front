import { BrowserRouter } from 'react-router-dom'
import Router from '@/Router'
import { Playground } from '@/components/test/Nav'
import Nav from '@/components/nav/Nav'
import '@/App.scss';

const App = () => {
  return (
    <BrowserRouter basename='/web' future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div style={{ display: 'flex', height: '100%'}}>
        <Playground></Playground>
        <Nav></Nav>
      </div>
      <Router />
    </BrowserRouter>
  );
}

export default App;
