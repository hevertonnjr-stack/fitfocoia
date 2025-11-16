import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type Props = { children: ReactNode };

export default function ProtectedAdminRoute({ children }: Props) {
  const { loading, isAdmin, user } = useAuth();

  console.log('ProtectedAdminRoute:', { loading, isAdmin, hasUser: !!user });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('Redirecionando para /admin-login');
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
}
