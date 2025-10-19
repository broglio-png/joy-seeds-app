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
      <div className="card-sophisticated rounded-[2rem] p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-7">
          <div className="icon-container-accent">
            <PenTool className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="font-serif text-xl font-bold text-sophisticated">Ações Rápidas</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                variant="ghost"
                className={`${action.color} h-auto p-6 flex flex-col items-center gap-3 text-white hover:opacity-95 btn-elegant shadow-elegant border-0 rounded-[1.5rem] group`}
              >
                <div className="glass p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm font-serif tracking-tight">{action.title}</p>
                  <p className="text-xs opacity-95 font-medium mt-1">{action.description}</p>
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