import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';
import { AppProvider } from './provider';
import { AppRouter } from './routes';

const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;
