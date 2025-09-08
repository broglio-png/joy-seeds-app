import Header from "@/components/Header";
import InspirationCard from "@/components/InspirationCard";
import GratitudeEntry from "@/components/GratitudeEntry";
import StatsCard from "@/components/StatsCard";
import QuickActions from "@/components/QuickActions";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="p-6 space-y-6 max-w-md mx-auto">
        {/* Daily Inspiration */}
        <InspirationCard />
        
        {/* Quick Actions */}
        <QuickActions />
        
        {/* Stats */}
        <StatsCard />
        
        {/* Main Gratitude Entry */}
        <div id="gratitude-entry">
          <GratitudeEntry />
        </div>
        
        {/* Footer Space */}
        <div className="h-8"></div>
      </main>
    </div>
  );
};

export default Index;
