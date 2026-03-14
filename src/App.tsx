import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LoadingBalls } from "@/components/shared/LoadingBalls";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const LossCalculator = lazy(() => import("@/features/loss-calculator/LossCalculator"));
const BetSimulator = lazy(() => import("@/features/bet-simulator/BetSimulator"));
const BiasQuiz = lazy(() => import("@/features/quiz/BiasQuiz"));
const BubbleChart = lazy(() => import("@/features/bubble-chart/BubbleChart"));
const BallGenerator = lazy(() => import("@/features/ball-generator/BallGenerator"));
const TimeCounter = lazy(() => import("@/features/time-counter/TimeCounter"));
const FutureLetter = lazy(() => import("@/features/future-letter/FutureLetter"));
const MoneyFlow = lazy(() => import("@/features/money-flow/MoneyFlow"));
const Sobre = lazy(() => import("@/pages/Sobre"));

const queryClient = new QueryClient();

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingBalls /></div>}>{children}</Suspense>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Header />
        <main className="pt-14 min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calculadora" element={<LazyPage><LossCalculator /></LazyPage>} />
            <Route path="/simulador" element={<LazyPage><BetSimulator /></LazyPage>} />
            <Route path="/simulador/gerador" element={<LazyPage><BallGenerator /></LazyPage>} />
            <Route path="/simulador/tempo" element={<LazyPage><TimeCounter /></LazyPage>} />
            <Route path="/simulador/carta" element={<LazyPage><FutureLetter /></LazyPage>} />
            <Route path="/dados" element={<LazyPage><BubbleChart /></LazyPage>} />
            <Route path="/dados/transparencia" element={<LazyPage><MoneyFlow /></LazyPage>} />
            <Route path="/quiz" element={<LazyPage><BiasQuiz /></LazyPage>} />
            <Route path="/sobre" element={<LazyPage><Sobre /></LazyPage>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
