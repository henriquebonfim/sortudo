import { LoadingBalls } from '@/shared/components/LoadingBalls';
import { Footer } from '@/shared/components/layout/Footer';
import { Header } from '@/shared/components/layout/Header';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

const Hero = lazy(() => import('@/features/home/pages/HeroPage'));
const About = lazy(() => import('@/features/about/pages/AboutPage'));
const Search = lazy(() => import('@/features/search/pages/SearchPage'));
const Generator = lazy(() => import('@/features/generator/pages/GeneratorPage'));
const Analytics = lazy(() => import('@/features/analytics/pages/AnalyticsPage'));

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingBalls />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen w-full max-w-7xl items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Página não encontrada</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Voltar para a Página Inicial
        </a>
      </div>
    </div>
  );
}

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRouteChange />
      <Header />
      <main className="pt-16 min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <LazyPage>
                <Hero />
              </LazyPage>
            }
          />
          <Route
            path="/dados"
            element={
              <LazyPage>
                <Analytics />
              </LazyPage>
            }
          />
          <Route
            path="/gerador"
            element={
              <LazyPage>
                <Generator />
              </LazyPage>
            }
          />
          <Route
            path="/buscar"
            element={
              <LazyPage>
                <Search />
              </LazyPage>
            }
          />
          <Route
            path="/buscar/:jogo"
            element={
              <LazyPage>
                <Search />
              </LazyPage>
            }
          />
          <Route
            path="/sobre"
            element={
              <LazyPage>
                <About />
              </LazyPage>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
