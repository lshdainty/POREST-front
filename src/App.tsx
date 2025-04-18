import {BrowserRouter} from 'react-router-dom';
// react19에서 antd 호환성 해결 package
import '@ant-design/v5-patch-for-react-19';
import Router from '@/Router';
import '@/App.scss';

const App: React.FC = () => {
  return (
    <BrowserRouter basename='/web' future={{v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Router />
    </BrowserRouter>
  );
}

export default App;