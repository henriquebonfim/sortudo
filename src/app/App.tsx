import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { AppProvider } from './provider';
import { AppRouter } from './routes';

const App = () => (
  <ErrorBoundary>
    <AppProvider>
      <AppRouter />
    </AppProvider>
  </ErrorBoundary>
);

export default App;
