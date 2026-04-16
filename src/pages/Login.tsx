import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isSupabaseReady, supabase } from '@/lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      toast.error('Preencha todos os campos.');
      return;
    }

    if (!isSupabaseReady) {
      toast.error('Supabase nao esta configurado neste ambiente.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Login realizado com sucesso!');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-xl bg-primary/20 mb-4">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AC Transportes</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-secondary"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="bg-secondary"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          O acesso agora usa autenticação real do Supabase.
        </p>
      </div>
    </div>
  );
}
