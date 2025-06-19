import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ClientProviders } from '@/ClientProviders';
import { ThemeProvider } from '@/components/shadcn/themeProvider';
import Router from '@/Router';
/*
  react19에서 antd 호환성 해결
  https://ant.design/docs/react/v5-for-19
*/ 
import '@ant-design/v5-patch-for-react-19';

import '@/App.scss';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ClientProviders>
        <BrowserRouter basename='/web' future={{v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Router />
          <ReactQueryDevtools />
        </BrowserRouter>
      </ClientProviders>
    </ThemeProvider>
  );
}

export default App;