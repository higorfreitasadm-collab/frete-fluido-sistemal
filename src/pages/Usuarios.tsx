import { AppLayout } from '@/components/AppLayout';
import { mockUsers } from '@/data/mock';
import { Badge } from '@/components/ui/badge';

export default function Usuarios() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground text-sm">Gerencie os usuários do sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockUsers.map(user => (
            <div key={user.id} className="glass-card p-5 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg font-bold">
                  {user.nome.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <Badge variant="outline" className="mt-1 text-xs capitalize">
                    {user.role === 'administrador' ? 'Administrador' : 'Usuário'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
