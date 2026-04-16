import { lazy, Suspense, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isSupabaseReady } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

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

const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();

  if (!isSupabaseReady) {
    return <>{children}</>;
  }

  if (loading) {
    return <RouteFallback />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const LoginRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();

  if (!isSupabaseReady) {
    return <>{children}</>;
  }

  if (loading) {
    return <RouteFallback />;
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route
              path="/"
              element={
                <AuthenticatedRoute>
                  <Dashboard />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/nova-nf"
              element={
                <AuthenticatedRoute>
                  <NFForm />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/pend-pte"
              element={
                <AuthenticatedRoute>
                  <PendPTEList />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/pend-pte/novo"
              element={
                <AuthenticatedRoute>
                  <PendPTEForm />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/pend-pte/editar/:id"
              element={
                <AuthenticatedRoute>
                  <PendPTEForm />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/pend-sal"
              element={
                <AuthenticatedRoute>
                  <PendSalList />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/pend-sal/novo"
              element={
                <AuthenticatedRoute>
                  <PendSalForm />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/pend-sal/editar/:id"
              element={
                <AuthenticatedRoute>
                  <PendSalForm />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/relatorios"
              element={
                <AuthenticatedRoute>
                  <Relatorios />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/historico"
              element={
                <AuthenticatedRoute>
                  <Historico />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <AuthenticatedRoute>
                  <Configuracoes />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <LoginRoute>
                  <Login />
                </LoginRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
