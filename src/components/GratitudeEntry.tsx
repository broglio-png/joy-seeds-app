import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Heart, Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GratitudeItem {
  text: string;
  reason: string;
}

const GratitudeEntry = () => {
  const [gratitudes, setGratitudes] = useState<GratitudeItem[]>([
    { text: "", reason: "" },
    { text: "", reason: "" },
    { text: "", reason: "" }
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const updateGratitude = (index: number, field: 'text' | 'reason', value: string) => {
    const updated = [...gratitudes];
    updated[index] = { ...updated[index], [field]: value };
    setGratitudes(updated);
  };

  const handleSubmit = () => {
    const filledGratitudes = gratitudes.filter(g => g.text.trim() && g.reason.trim());
    
    if (filledGratitudes.length === 0) {
      toast({
        title: "Adicione pelo menos uma gratidão",
        description: "Registre algo pelo qual você é grato hoje.",
        variant: "destructive"
      });
      return;
    }

    // Here you would save to local storage or backend
    setIsSubmitted(true);
    toast({
      title: "Gratidões registradas! 🎉",
      description: `Você registrou ${filledGratitudes.length} bênção${filledGratitudes.length > 1 ? 'ões' : ''} hoje.`,
    });

    // Reset for next day (in real app, this would be date-based)
    setTimeout(() => {
      setIsSubmitted(false);
      setGratitudes([
        { text: "", reason: "" },
        { text: "", reason: "" },
        { text: "", reason: "" }
      ]);
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <Card className="p-6 bg-gradient-secondary border-0 shadow-warm">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-foreground">
            Suas gratidões foram registradas!
          </h3>
          <p className="text-secondary-foreground/70">
            Continue cultivando esse hábito maravilhoso. Até amanhã! 🌱
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-0 shadow-card">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-gratitude rounded-full">
            <Heart className="w-5 h-5 text-gratitude-foreground" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">Minhas 3 Bênçãos de Hoje</h2>
            <p className="text-sm text-muted-foreground">O que te fez sentir grato hoje?</p>
          </div>
        </div>

        <div className="space-y-6">
          {gratitudes.map((gratitude, index) => (
            <div key={index} className="space-y-3 p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <label className="text-sm font-medium text-card-foreground">
                  Hoje sou grato por...
                </label>
              </div>
              
              <Textarea
                placeholder="Descreva algo pelo qual você é grato..."
                value={gratitude.text}
                onChange={(e) => updateGratitude(index, 'text', e.target.value)}
                className="min-h-[80px] bg-background border-border/50 focus:border-primary transition-gentle"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Por que isso foi importante para mim?
                </label>
                <Textarea
                  placeholder="Reflita sobre o significado deste momento..."
                  value={gratitude.reason}
                  onChange={(e) => updateGratitude(index, 'reason', e.target.value)}
                  className="min-h-[60px] bg-background border-border/50 focus:border-primary transition-gentle"
                />
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={handleSubmit}
          variant="gradient"
          className="w-full font-semibold py-3 rounded-xl transition-gentle"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Minhas Gratidões
        </Button>
      </div>
    </Card>
  );
};

export default GratitudeEntry;