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
    <header className="glass rounded-b-[2rem] border-b-0 shadow-premium animate-fade-in sticky top-0 z-50">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="icon-container-primary shrink-0 animate-glow">
              <Heart className="w-7 h-7 text-white" fill="currentColor" strokeWidth={2.5} />
            </div>
            <div className="space-y-1.5 min-w-0">
              <h1 className="text-2xl font-serif font-bold text-sophisticated tracking-tight">
                Diário da Gratidão
              </h1>
              <p className="text-elegant text-xs md:text-sm max-w-md line-clamp-2">
                "A gratidão é a ferramenta mais poderosa no nosso relacionamento com Deus" 
                <span className="block font-semibold text-muted-foreground/70 mt-0.5">— Rev. Alexandre Broglio</span>
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="btn-elegant glass hover:bg-white/30 text-foreground border border-white/30 shrink-0"
              >
                <User className="w-4 h-4 md:mr-2" strokeWidth={2.5} />
                <span className="font-semibold hidden md:inline">
                  {user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuário'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border border-border/40 shadow-elegant">
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive/15 font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" strokeWidth={2.5} />
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