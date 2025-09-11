import { Heart, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="flex items-center justify-between p-6 bg-gradient-primary rounded-b-3xl shadow-soft">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
          <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary-foreground">Diário da Gratidão</h1>
          <p className="text-sm text-primary-foreground/80">"A gratidão é a ferramenta mais poderosa no nosso relacionamento com Deus" - Rev. Alexandre Broglio</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-primary-foreground/70">Hoje</p>
          <p className="text-lg font-semibold text-primary-foreground">
            {new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'short' 
            })}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20">
              <User className="w-4 h-4 mr-2" />
              {user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuário'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;