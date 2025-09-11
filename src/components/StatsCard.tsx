import { useState, useEffect } from "react";
import { TrendingUp, Calendar, Mail, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const StatsCard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    consecutiveDays: 0,
    totalGratitudes: 0,
    lettersWritten: 0,
    weeklyStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      // Get total gratitudes
      const { count: totalGratitudes } = await supabase
        .from('gratitude_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get total letters
      const { count: lettersWritten } = await supabase
        .from('gratitude_letters')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get this week's entries
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const { count: weeklyStreak } = await supabase
        .from('gratitude_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString());

      // Calculate consecutive days (simplified - just count unique days this month)
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const { data: monthlyEntries } = await supabase
        .from('gratitude_entries')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', monthStart.toISOString())
        .order('created_at', { ascending: false });

      const uniqueDays = new Set(
        monthlyEntries?.map(entry => 
          new Date(entry.created_at).toDateString()
        ) || []
      );

      setStats({
        consecutiveDays: uniqueDays.size,
        totalGratitudes: totalGratitudes || 0,
        lettersWritten: lettersWritten || 0,
        weeklyStreak: weeklyStreak || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-secondary border-0 shadow-warm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/20 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-3 bg-white/50 rounded-xl">
                <div className="h-8 bg-white/20 rounded mb-2"></div>
                <div className="h-3 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

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