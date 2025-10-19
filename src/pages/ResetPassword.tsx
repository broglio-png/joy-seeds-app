import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu email",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/update-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      
      setEmailSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Não foi possível enviar o email de recuperação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/20">
        <Card className="w-full max-w-md card-sophisticated shadow-premium rounded-[2rem]">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6 shadow-elegant">
              <CheckCircle className="w-10 h-10 text-success" strokeWidth={2.5} />
            </div>
            <CardTitle className="text-2xl font-serif font-bold text-sophisticated">Email Enviado!</CardTitle>
            <CardDescription className="text-elegant text-base mt-3">
              Enviamos um link de recuperação para <strong className="text-foreground">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="glass p-6 rounded-[1.5rem] space-y-3">
              <p className="text-sm text-sophisticated font-semibold">
                📧 Próximos passos:
              </p>
              <ul className="text-sm text-elegant space-y-2 list-disc list-inside">
                <li>Verifique sua caixa de entrada</li>
                <li>Clique no link de recuperação</li>
                <li>Defina sua nova senha</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => navigate('/auth')} 
              variant="gradient"
              className="w-full font-bold py-6 rounded-[1.25rem]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2.5} />
              Voltar para Login
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
          <div className="mx-auto icon-container-accent mb-4">
            <Mail className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-sophisticated">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-elegant mt-2">
            Digite seu email para receber o link de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-bold text-sophisticated">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl font-medium bg-background/80 border-border/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-4">
              <Button 
                type="submit" 
                variant="gradient"
                className="w-full font-bold py-6 rounded-[1.25rem]" 
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Link de Recuperação"}
              </Button>
              
              <Link to="/auth">
                <Button 
                  type="button" 
                  variant="ghost"
                  className="w-full font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2.5} />
                  Voltar para Login
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
