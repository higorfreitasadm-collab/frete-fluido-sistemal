import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import NotasFiscais from "./pages/NotasFiscais";
import NFForm from "./pages/NFForm";
import PendPTEList from "./pages/PendPTEList";
import PendPTEForm from "./pages/PendPTEForm";
import PendSalList from "./pages/PendSalList";
import PendSalForm from "./pages/PendSalForm";
import Relatorios from "./pages/Relatorios";
import Historico from "./pages/Historico";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notas-fiscais" element={<NotasFiscais />} />
          <Route path="/nova-nf" element={<NFForm />} />
          <Route path="/editar-nf/:id" element={<NFForm />} />
          <Route path="/pend-pte" element={<PendPTEList />} />
          <Route path="/pend-pte/novo" element={<PendPTEForm />} />
          <Route path="/pend-pte/editar/:id" element={<PendPTEForm />} />
          <Route path="/pend-sal" element={<PendSalList />} />
          <Route path="/pend-sal/novo" element={<PendSalForm />} />
          <Route path="/pend-sal/editar/:id" element={<PendSalForm />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
