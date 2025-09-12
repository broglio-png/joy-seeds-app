import { Heart, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Header = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="glass rounded-b-3xl border-b-0 shadow-premium animate-fade-in">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-hero rounded-2xl shadow-elegant">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-serif font-semibold text-premium tracking-tight">
                Diário da Gratidão
              </h1>
              <p className="text-elegant text-sm max-w-md">
                "A gratidão é a ferramenta mais poderosa no nosso relacionamento com Deus" 
                <span className="block font-medium text-muted-foreground/60 mt-1">— Rev. Alexandre Broglio</span>
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="btn-elegant bg-white/10 hover:bg-white/20 text-foreground border border-border/20 backdrop-blur-sm"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium">
                  {user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuário'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border border-border/30">
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
export default Header;