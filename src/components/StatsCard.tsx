import { TrendingUp, Calendar, Mail, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const StatsCard = () => {
  // Mock data - in real app this would come from storage/backend
  const stats = {
    consecutiveDays: 7,
    totalGratitudes: 21,
    lettersWritten: 3,
    weeklyStreak: 5
  };

  return (
    <Card className="p-6 bg-gradient-secondary border-0 shadow-warm">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gratitude" />
          <h3 className="font-bold text-secondary-foreground">Sua Jornada</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-secondary-foreground">{stats.consecutiveDays}</p>
            <p className="text-xs text-secondary-foreground/70">dias seguidos</p>
          </div>
          
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-2xl font-bold text-secondary-foreground">{stats.totalGratitudes}</p>
            <p className="text-xs text-secondary-foreground/70">gratidões registradas</p>
          </div>
          
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <Mail className="w-4 h-4 text-inspiration" />
            </div>
            <p className="text-2xl font-bold text-secondary-foreground">{stats.lettersWritten}</p>
            <p className="text-xs text-secondary-foreground/70">cartas enviadas</p>
          </div>
          
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-4 h-4 text-accent-foreground" />
            </div>
            <p className="text-2xl font-bold text-secondary-foreground">{stats.weeklyStreak}</p>
            <p className="text-xs text-secondary-foreground/70">esta semana</p>
          </div>
        </div>
        
        <div className="text-center p-3 bg-gratitude/20 rounded-xl">
          <p className="text-sm font-medium text-gratitude-foreground">
            🎉 Parabéns! Você está cultivando a gratidão com consistência.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;