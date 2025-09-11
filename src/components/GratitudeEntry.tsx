import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Heart, Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Security constants for GratitudeEntry
const MAX_GRATITUDE_TEXT_LENGTH = 500;
const MAX_GRATITUDE_REASON_LENGTH = 300;

// Input sanitization function
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

interface GratitudeItem {
  text: string;
  reason: string;
}

const GratitudeEntry = () => {
  const { user } = useAuth();
  const [gratitudes, setGratitudes] = useState<GratitudeItem[]>([
    { text: "", reason: "" },
    { text: "", reason: "" },
    { text: "", reason: "" }
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Check if user already submitted gratitudes today
  useEffect(() => {
    checkTodaySubmission();
  }, [user]);

  const checkTodaySubmission = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('gratitude_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);
    
    if (data && data.length > 0) {
      setIsSubmitted(true);
    }
  };

  const updateGratitude = (index: number, field: 'text' | 'reason', value: string) => {
    const maxLength = field === 'text' ? MAX_GRATITUDE_TEXT_LENGTH : MAX_GRATITUDE_REASON_LENGTH;
    
    // Only update if within length limit
    if (value.length <= maxLength) {
      const updated = [...gratitudes];
      updated[index] = { ...updated[index], [field]: value };
      setGratitudes(updated);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Sanitize and validate gratitudes
    const sanitizedGratitudes = gratitudes.map(g => ({
      text: sanitizeInput(g.text.trim()),
      reason: sanitizeInput(g.reason.trim())
    }));
    
    const filledGratitudes = sanitizedGratitudes.filter(g => g.text && g.reason);
    
    if (filledGratitudes.length === 0) {
      toast({
        title: "Adicione pelo menos uma gratidão",
        description: "Registre algo pelo qual você é grato hoje.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // Save to Supabase
      const gratitudesToSave = filledGratitudes.map(g => ({
        user_id: user.id,
        content: `${g.text} - ${g.reason}`
      }));

      const { error } = await supabase
        .from('gratitude_entries')
        .insert(gratitudesToSave);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Gratidões registradas! 🎉",
        description: `Você registrou ${filledGratitudes.length} bênção${filledGratitudes.length > 1 ? 'ões' : ''} hoje.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas gratidões. Tente novamente.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
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
                maxLength={MAX_GRATITUDE_TEXT_LENGTH}
                className="min-h-[80px] bg-background border-border/50 focus:border-primary transition-gentle"
              />
              <div className="text-xs text-muted-foreground text-right">
                {gratitude.text.length}/{MAX_GRATITUDE_TEXT_LENGTH}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Por que isso foi importante para mim?
                </label>
                <Textarea
                  placeholder="Reflita sobre o significado deste momento..."
                  value={gratitude.reason}
                  onChange={(e) => updateGratitude(index, 'reason', e.target.value)}
                  maxLength={MAX_GRATITUDE_REASON_LENGTH}
                  className="min-h-[60px] bg-background border-border/50 focus:border-primary transition-gentle"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {gratitude.reason.length}/{MAX_GRATITUDE_REASON_LENGTH}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={loading}
          variant="gradient"
          className="w-full font-semibold py-3 rounded-xl transition-gentle"
        >
          <Plus className="w-4 h-4 mr-2" />
          {loading ? "Salvando..." : "Registrar Minhas Gratidões"}
        </Button>
      </div>
    </Card>
  );
};

export default GratitudeEntry;