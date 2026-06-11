import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../supabase';
import { useAuth } from '../auth-context';
import { Button } from '@/admin/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/admin/ui/card';
import { Input } from '@/admin/ui/input';
import { Label } from '@/admin/ui/label';

export function Login() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Navigate to="/" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error('Inloggen mislukt', {
        description: 'Controleer je e-mailadres en wachtwoord.',
      });
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Nils Vogelaar — CMS</CardTitle>
          <CardDescription>Log in om de portfolio te beheren.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy} className="mt-2">
              {busy ? 'Bezig…' : 'Inloggen'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
