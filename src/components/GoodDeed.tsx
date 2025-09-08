import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Gift, Plus, CheckCircle, Lightbulb, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoodDeedProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const GoodDeed = ({ isOpen, onOpenChange }: GoodDeedProps) => {
  const { toast } = useToast();
  const [customDeed, setCustomDeed] = useState("");
  const [deedDescription, setDeedDescription] = useState("");
  const [completedDeeds, setCompletedDeeds] = useState<string[]>([]);
  const [dailySuggestion, setDailySuggestion] = useState("");

  const goodDeedSuggestions = [
    "Ajude um idoso a atravessar a rua",
    "Compre o café de alguém na fila atrás de você",
    "Doe roupas que não usa mais",
    "Envie uma mensagem carinhosa para um amigo",
    "Ajude um colega de trabalho com uma tarefa",
    "Dê seu lugar no transporte público",
    "Faça uma doação para uma instituição de caridade",
    "Elogie sinceramente alguém hoje",
    "Deixe uma avaliação positiva para um pequeno negócio",
    "Ofereça ajuda a um vizinho",
    "Doe sangue ou se cadastre como doador",
    "Plante uma árvore ou cuide de uma planta",
    "Limpe um espaço público que encontrou sujo",
    "Dê uma carona para alguém",
    "Ensine algo que você sabe para alguém",
    "Visite uma pessoa que está sozinha",
    "Compartilhe sua comida com quem precisa",
    "Seja gentil com atendentes e funcionários",
    "Ajude uma pessoa perdida com direções",
    "Doe livros para uma biblioteca ou escola"
  ];

  useEffect(() => {
    // Get daily suggestion (changes based on day of year)
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const suggestionIndex = dayOfYear % goodDeedSuggestions.length;
    setDailySuggestion(goodDeedSuggestions[suggestionIndex]);

    // Load completed deeds from localStorage
    const saved = localStorage.getItem('completed-deeds');
    if (saved) {
      setCompletedDeeds(JSON.parse(saved));
    }
  }, []);

  const saveDeed = (deed: string, description?: string) => {
    const timestamp = new Date().toLocaleDateString('pt-BR');
    const deedEntry = description ? `${deed} - ${description}` : deed;
    const deedWithDate = `${deedEntry} (${timestamp})`;
    
    const updated = [...completedDeeds, deedWithDate];
    setCompletedDeeds(updated);
    localStorage.setItem('completed-deeds', JSON.stringify(updated));

    toast({
      title: "Boa ação registrada! 🌟",
      description: "Você está espalhando bondade no mundo. Continue assim!",
    });

    setCustomDeed("");
    setDeedDescription("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    saveDeed(suggestion);
  };

  const handleCustomDeed = () => {
    if (!customDeed.trim()) {
      toast({
        title: "Digite sua boa ação",
        description: "Conte-nos o que você fez de bom hoje!",
        variant: "destructive"
      });
      return;
    }
    
    saveDeed(customDeed, deedDescription);
  };

  const todayDeeds = completedDeeds.filter(deed => 
    deed.includes(new Date().toLocaleDateString('pt-BR'))
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Gift className="w-5 h-5" />
            Boas Ações
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Daily Suggestion */}
          <Card className="p-4 bg-gradient-gratitude/10 border-gratitude/20">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Sugestão do Dia
            </h4>
            <p className="text-sm text-muted-foreground mb-3">{dailySuggestion}</p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleSuggestionClick(dailySuggestion)}
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Fiz essa boa ação!
            </Button>
          </Card>

          {/* Today's Completed Deeds */}
          {todayDeeds.length > 0 && (
            <Card className="p-4 bg-gradient-primary/10 border-primary/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Boas ações de hoje ({todayDeeds.length})
              </h4>
              <div className="space-y-2">
                {todayDeeds.slice(0, 3).map((deed, index) => (
                  <Badge key={index} variant="secondary" className="text-xs block p-2 h-auto whitespace-normal">
                    {deed.split(' (')[0]}
                  </Badge>
                ))}
                {todayDeeds.length > 3 && (
                  <p className="text-xs text-muted-foreground">E mais {todayDeeds.length - 3} ações...</p>
                )}
              </div>
            </Card>
          )}

          {/* Quick Suggestions */}
          <div>
            <Label className="text-sm font-medium">Outras sugestões rápidas:</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {goodDeedSuggestions.slice(1, 6).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="justify-start text-left h-auto p-3 text-xs"
                >
                  <Plus className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="whitespace-normal">{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Good Deed */}
          <div className="space-y-3 border-t pt-4">
            <Label>Registrar uma boa ação personalizada:</Label>
            
            <div>
              <Input
                placeholder="Que boa ação você fez hoje?"
                value={customDeed}
                onChange={(e) => setCustomDeed(e.target.value)}
              />
            </div>
            
            <div>
              <Textarea
                placeholder="Detalhes (opcional): Como foi? Como se sentiu?"
                value={deedDescription}
                onChange={(e) => setDeedDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleCustomDeed}
              variant="gradient"
              className="w-full gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Registrar Boa Ação
            </Button>
          </div>

          {/* Stats */}
          <div className="text-center text-sm text-muted-foreground pt-2 border-t">
            Total de boas ações registradas: <span className="font-semibold text-primary">{completedDeeds.length}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoodDeed;