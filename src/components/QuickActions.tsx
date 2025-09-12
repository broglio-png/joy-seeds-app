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
      <div className="card-sophisticated rounded-3xl p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-hero rounded-xl">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-card-foreground">Ações Rápidas</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                variant="ghost"
                className={`${action.color} h-auto p-6 flex flex-col items-center gap-3 text-white hover:opacity-90 btn-elegant shadow-soft border-0 rounded-2xl`}
              >
                <div className="p-2 glass rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm font-serif">{action.title}</p>
                  <p className="text-xs opacity-90 font-medium">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

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