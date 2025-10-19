import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

const UpdatePassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Verify if user has a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
      
      if (!session) {
        toast({
          title: "Sessão inválida",
          description: "Por favor, solicite um novo link de recuperação de senha.",
          variant: "destructive"
        });
      }
    };
    
    checkSession();
  }, [toast]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha atualizada!",
        description: "Sua senha foi redefinida com sucesso. Faça login com sua nova senha.",
      });
      
      // Sign out and redirect to login
      await supabase.auth.signOut();
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Não foi possível atualizar sua senha. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/20">
        <Card className="w-full max-w-md card-sophisticated shadow-premium rounded-[2rem]">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sophisticated font-semibold">Verificando sessão...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isValidSession === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/20">
        <Card className="w-full max-w-md card-sophisticated shadow-premium rounded-[2rem]">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mb-6 shadow-elegant">
              <AlertCircle className="w-10 h-10 text-destructive" strokeWidth={2.5} />
            </div>
            <CardTitle className="text-2xl font-serif font-bold text-sophisticated">
              Link Inválido ou Expirado
            </CardTitle>
            <CardDescription className="text-elegant text-base mt-3">
              Este link de recuperação não é mais válido. Por favor, solicite um novo link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/reset-password')} 
              variant="gradient"
              className="w-full font-bold py-6 rounded-[1.25rem]"
            >
              Solicitar Novo Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/20">
      <Card className="w-full max-w-md card-sophisticated shadow-premium rounded-[2rem]">
        <CardHeader className="text-center">
          <div className="mx-auto icon-container-primary mb-4">
            <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-sophisticated">
            Nova Senha
          </CardTitle>
          <CardDescription className="text-elegant mt-2">
            Digite sua nova senha abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-bold text-sophisticated">
                Nova Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 rounded-xl font-medium bg-background/80 border-border/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground font-medium">
                Mínimo de 6 caracteres
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="confirm-password" className="text-sm font-bold text-sophisticated">
                Confirmar Nova Senha
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 rounded-xl font-medium bg-background/80 border-border/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <Button 
              type="submit" 
              variant="gradient"
              className="w-full font-bold py-6 rounded-[1.25rem]" 
              disabled={loading}
            >
              <CheckCircle className="w-5 h-5 mr-2" strokeWidth={2.5} />
              {loading ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;
