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
      <div className="card-sophisticated bg-gradient-elegant rounded-3xl p-8 animate-fade-in">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-muted/30 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass p-4 rounded-2xl">
                <div className="h-10 bg-muted/20 rounded-lg mb-3"></div>
                <div className="h-4 bg-muted/20 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-sophisticated bg-gradient-elegant rounded-[2rem] p-8 animate-slide-up">
      <div className="space-y-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-container-primary">
            <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="font-serif text-xl font-bold text-sophisticated">Sua Jornada</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="glass text-center p-6 rounded-[1.5rem] btn-elegant group">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2.5 bg-primary/15 rounded-xl group-hover:bg-primary/25 transition-colors">
                <Calendar className="w-5 h-5 text-primary" strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-3xl font-bold text-sophisticated mb-1.5">{stats.consecutiveDays}</p>
            <p className="text-sm text-muted-foreground font-semibold">dias seguidos</p>
          </div>
          
          <div className="glass text-center p-6 rounded-[1.5rem] btn-elegant group">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2.5 bg-success/15 rounded-xl group-hover:bg-success/25 transition-colors">
                <TrendingUp className="w-5 h-5 text-success" strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-3xl font-bold text-sophisticated mb-1.5">{stats.totalGratitudes}</p>
            <p className="text-sm text-muted-foreground font-semibold">gratidões</p>
          </div>
          
          <div className="glass text-center p-6 rounded-[1.5rem] btn-elegant group">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2.5 bg-inspiration/15 rounded-xl group-hover:bg-inspiration/25 transition-colors">
                <Mail className="w-5 h-5 text-inspiration" strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-3xl font-bold text-sophisticated mb-1.5">{stats.lettersWritten}</p>
            <p className="text-sm text-muted-foreground font-semibold">cartas enviadas</p>
          </div>
          
          <div className="glass text-center p-6 rounded-[1.5rem] btn-elegant group">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2.5 bg-accent/15 rounded-xl group-hover:bg-accent/25 transition-colors">
                <Users className="w-5 h-5 text-accent" strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-3xl font-bold text-sophisticated mb-1.5">{stats.weeklyStreak}</p>
            <p className="text-sm text-muted-foreground font-semibold">esta semana</p>
          </div>
        </div>
        
        <div className="glass p-6 rounded-[1.5rem] border-2 border-gratitude/30 bg-gradient-to-br from-gratitude/10 via-gratitude/5 to-transparent">
          <p className="text-center font-serif text-lg font-bold text-sophisticated leading-relaxed">
            🎉 Parabéns! Você está cultivando a gratidão com consistência.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;