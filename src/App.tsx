import { useLotteryStore } from "@/application/useLotteryStore";
import { Footer, Header } from "@/components/layout";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { LoadingBalls } from "@/features/shared";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Hero = lazy(() => import("@/pages/Hero"));
const About = lazy(() => import("@/pages/About"));
const Search = lazy(() => import("@/pages/Search"));
const Generator = lazy(() => import("@/pages/Generator"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function StoreInitializer() {
  const initialize = useLotteryStore((state) => state.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
  return null;
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingBalls /></div>}>
      {children}
    </Suspense>
  );
}

const App = () => (
  <ThemeProvider>
    <StoreInitializer />
    <BrowserRouter>
      <Header />
      <main className="pt-16 min-h-screen">
        <Routes>
          <Route path="/" element={<LazyPage><Hero /></LazyPage>} />
          <Route path="/dados" element={<LazyPage><Analytics /></LazyPage>} />
          <Route path="/gerador" element={<LazyPage><Generator /></LazyPage>} />
          <Route path="/buscar" element={<LazyPage><Search /></LazyPage>} />
          <Route path="/buscar/:jogo" element={<LazyPage><Search /></LazyPage>} />
          <Route path="/sobre" element={<LazyPage><About /></LazyPage>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
