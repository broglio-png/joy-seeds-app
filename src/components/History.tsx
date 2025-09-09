import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Heart, Mail, Gift, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface HistoryItem {
  id: string;
  type: 'gratitude' | 'letter' | 'deed';
  date: Date;
  content: {
    title?: string;
    items?: string[];
    recipient?: string;
    message?: string;
    description?: string;
  };
}

// Dados mockados para demonstração
const mockHistoryData: HistoryItem[] = [
  {
    id: '1',
    type: 'gratitude',
    date: new Date(2024, 8, 8),
    content: {
      items: [
        'Pela manhã ensolarada de hoje',
        'Pelo café quentinho que me despertou',
        'Pela conversa especial com um amigo querido'
      ]
    }
  },
  {
    id: '2',
    type: 'letter',
    date: new Date(2024, 8, 7),
    content: {
      recipient: 'Maria Silva',
      title: 'Carta de Gratidão',
      message: 'Querida Maria, quero expressar minha gratidão por toda sua dedicação e carinho...'
    }
  },
  {
    id: '3',
    type: 'deed',
    date: new Date(2024, 8, 6),
    content: {
      description: 'Ajudei um vizinho idoso com as compras do mercado'
    }
  },
  {
    id: '4',
    type: 'gratitude',
    date: new Date(2024, 8, 5),
    content: {
      items: [
        'Pela saúde de minha família',
        'Pelo trabalho que me realiza',
        'Pelos momentos de paz e tranquilidade'
      ]
    }
  }
];

const History = ({ isOpen, onOpenChange }: HistoryProps) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'gratitude' | 'letter' | 'deed'>('all');

  const filteredHistory = mockHistoryData.filter(item => 
    selectedTab === 'all' || item.type === selectedTab
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gratitude': return <Heart className="w-4 h-4" />;
      case 'letter': return <Mail className="w-4 h-4" />;
      case 'deed': return <Gift className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'gratitude': return 'Gratidão';
      case 'letter': return 'Carta';
      case 'deed': return 'Boa Ação';
      default: return 'Registro';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'gratitude': return 'default';
      case 'letter': return 'secondary';
      case 'deed': return 'outline';
      default: return 'default';
    }
  };

  const renderHistoryItem = (item: HistoryItem) => (
    <Card key={item.id} className="p-4 bg-card border-0 shadow-card mb-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getTypeIcon(item.type)}
          <Badge variant={getTypeBadgeVariant(item.type)}>
            {getTypeLabel(item.type)}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {format(item.date, "dd 'de' MMM", { locale: ptBR })}
        </span>
      </div>
      
      <div className="space-y-2">
        {item.type === 'gratitude' && item.content.items && (
          <div>
            <p className="text-sm font-medium mb-1">Gratidões do dia:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {item.content.items.map((gratitude, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-gratitude">•</span>
                  {gratitude}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {item.type === 'letter' && (
          <div>
            <p className="text-sm font-medium mb-1">
              Para: {item.content.recipient}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {item.content.message}
            </p>
          </div>
        )}
        
        {item.type === 'deed' && (
          <div>
            <p className="text-sm text-muted-foreground">
              {item.content.description}
            </p>
          </div>
        )}
      </div>
    </Card>
  );

  const getTabCount = (type: string) => {
    if (type === 'all') return mockHistoryData.length;
    return mockHistoryData.filter(item => item.type === type).length;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] bg-card border-0">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-card-foreground">
            <Calendar className="w-5 h-5" />
            Meu Histórico
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="all" className="text-xs">
              Todos ({getTabCount('all')})
            </TabsTrigger>
            <TabsTrigger value="gratitude" className="text-xs">
              <Heart className="w-3 h-3 mr-1" />
              {getTabCount('gratitude')}
            </TabsTrigger>
            <TabsTrigger value="letter" className="text-xs">
              <Mail className="w-3 h-3 mr-1" />
              {getTabCount('letter')}
            </TabsTrigger>
            <TabsTrigger value="deed" className="text-xs">
              <Gift className="w-3 h-3 mr-1" />
              {getTabCount('deed')}
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="all" className="mt-0">
              {filteredHistory.length > 0 ? (
                <div className="space-y-3">
                  {filteredHistory.map(renderHistoryItem)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhum registro encontrado</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="gratitude" className="mt-0">
              {filteredHistory.length > 0 ? (
                <div className="space-y-3">
                  {filteredHistory.map(renderHistoryItem)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma gratidão registrada ainda</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Comece registrando suas 3 bênçãos diárias!
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="letter" className="mt-0">
              {filteredHistory.length > 0 ? (
                <div className="space-y-3">
                  {filteredHistory.map(renderHistoryItem)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma carta enviada ainda</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Escreva uma carta de gratidão para alguém especial!
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="deed" className="mt-0">
              {filteredHistory.length > 0 ? (
                <div className="space-y-3">
                  {filteredHistory.map(renderHistoryItem)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma boa ação registrada ainda</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registre suas boas ações e espalhe gentileza!
                  </p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={() => onOpenChange(false)}
            variant="outline" 
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default History;