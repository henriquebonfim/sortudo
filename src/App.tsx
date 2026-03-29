import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LoadingBalls } from "@/components/shared/LoadingBalls";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { useLotteryStore } from "@/application/useLotteryStore";

const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Search = lazy(() => import("@/pages/Search"));
const Generator = lazy(() => import("@/pages/Generator"));
const DataDashboard = lazy(() => import("@/pages/DataDashboard"));

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
  <>
    <StoreInitializer />
    <Sonner />
    <BrowserRouter>
      <Header />
      <main className="pt-14 min-h-screen">
        <Routes>
          <Route path="/" element={<LazyPage><Index /></LazyPage>} />
          <Route path="/dados" element={<LazyPage><DataDashboard /></LazyPage>} />
          <Route path="/sobre" element={<LazyPage><About /></LazyPage>} />
          <Route path="/buscar" element={<LazyPage><Search /></LazyPage>} />
          <Route path="/buscar/:jogo" element={<LazyPage><Search /></LazyPage>} />
          <Route path="/gerador" element={<LazyPage><Generator /></LazyPage>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  </>
);

export default App;
