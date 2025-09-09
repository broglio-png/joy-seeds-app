import { Heart } from "lucide-react";

const Header = () => {
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
      
      <div className="text-right">
        <p className="text-xs text-primary-foreground/70">Hoje</p>
        <p className="text-lg font-semibold text-primary-foreground">
          {new Date().toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'short' 
          })}
        </p>
      </div>
    </header>
  );
};

export default Header;