import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PenTool, Mail, Gift, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GratitudeLetter from "./GratitudeLetter";
import GoodDeed from "./GoodDeed";
import History from "./History";

const QuickActions = () => {
  const { toast } = useToast();
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isGoodDeedModalOpen, setIsGoodDeedModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const actions = [
    {
      icon: PenTool,
      title: "Registro Rápido",
      description: "3 bênçãos de hoje",
      color: "bg-gradient-primary",
      action: () => {
        document.getElementById('gratitude-entry')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      icon: Mail,
      title: "Carta de Gratidão",
      description: "Agradeça alguém",
      color: "bg-gradient-peaceful",
      action: () => {
        setIsLetterModalOpen(true);
      }
    },
    {
      icon: Gift,
      title: "Boa Ação",
      description: "Faça o bem hoje",
      color: "bg-gradient-gratitude",
      action: () => {
        setIsGoodDeedModalOpen(true);
      }
    },
    {
      icon: Calendar,
      title: "Meu Histórico",
      description: "Ver registros passados",
      color: "bg-gradient-secondary",
      action: () => {
        setIsHistoryModalOpen(true);
      }
    }
  ];

  return (
    <>
      <Card className="p-6 bg-card border-0 shadow-card">
        <h3 className="font-bold text-card-foreground mb-4">Ações Rápidas</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                variant="ghost"
                className={`${action.color} h-auto p-4 flex flex-col items-center gap-2 text-primary-foreground hover:opacity-90 transition-gentle border-0`}
              >
                <Icon className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-semibold text-sm">{action.title}</p>
                  <p className="text-xs opacity-80">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      <GratitudeLetter 
        isOpen={isLetterModalOpen} 
        onOpenChange={setIsLetterModalOpen} 
      />
      
      <GoodDeed 
        isOpen={isGoodDeedModalOpen} 
        onOpenChange={setIsGoodDeedModalOpen} 
      />
      
      <History 
        isOpen={isHistoryModalOpen} 
        onOpenChange={setIsHistoryModalOpen} 
      />
    </>
  );
};

export default QuickActions;