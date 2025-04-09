import { BrowserRouter } from 'react-router-dom'
import Router from '@/Router'
import Nav from '@/components/nav/Nav'
import '@/App.scss';

const App = () => {
  return (
    <BrowserRouter basename='/web' future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Router />
    </BrowserRouter>
  );
}

export default App;
