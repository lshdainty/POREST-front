import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Router from '@/Router';
// react19에서 antd 호환성 해결 package
import '@ant-design/v5-patch-for-react-19';

import '@/App.scss';

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename='/web' future={{v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Router />
        <ReactQueryDevtools />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;