import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const NFForm = lazy(() => import("./pages/NFForm"));
const PendPTEList = lazy(() => import("./pages/PendPTEList"));
const PendPTEForm = lazy(() => import("./pages/PendPTEForm"));
const PendSalList = lazy(() => import("./pages/PendSalList"));
const PendSalForm = lazy(() => import("./pages/PendSalForm"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const Historico = lazy(() => import("./pages/Historico"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
    Carregando...
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nova-nf" element={<NFForm />} />
            <Route path="/pend-pte" element={<PendPTEList />} />
            <Route path="/pend-pte/novo" element={<PendPTEForm />} />
            <Route path="/pend-pte/editar/:id" element={<PendPTEForm />} />
            <Route path="/pend-sal" element={<PendSalList />} />
            <Route path="/pend-sal/novo" element={<PendSalForm />} />
            <Route path="/pend-sal/editar/:id" element={<PendSalForm />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
