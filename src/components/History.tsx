import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Heart, Mail, Gift, ArrowLeft, Printer, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

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
    recipient_email?: string;
    sender_name?: string;
    message?: string;
    description?: string;
  };
}


const History = ({ isOpen, onOpenChange }: HistoryProps) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'gratitude' | 'letter' | 'deed'>('all');
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const filteredHistory = historyData.filter(item => 
    selectedTab === 'all' || item.type === selectedTab
  );

  const fetchHistoryData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Buscar gratidões
      const { data: gratitudeData } = await supabase
        .from('gratitude_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Buscar cartas
      const { data: lettersData } = await supabase
        .from('gratitude_letters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Buscar boas ações
      const { data: deedsData } = await supabase
        .from('good_deeds')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const allHistory: HistoryItem[] = [];

      // Adicionar gratidões
      if (gratitudeData) {
        gratitudeData.forEach(entry => {
          const items = entry.content.split('\n').filter(item => item.trim());
          allHistory.push({
            id: entry.id,
            type: 'gratitude',
            date: new Date(entry.created_at),
            content: { items }
          });
        });
      }

      // Adicionar cartas
      if (lettersData) {
        lettersData.forEach(letter => {
          allHistory.push({
            id: letter.id,
            type: 'letter',
            date: new Date(letter.created_at),
            content: {
              recipient: letter.recipient_name,
              recipient_email: letter.recipient_email,
              sender_name: letter.sender_name,
              message: letter.content
            }
          });
        });
      }

      // Adicionar boas ações
      if (deedsData) {
        deedsData.forEach(deed => {
          allHistory.push({
            id: deed.id,
            type: 'deed',
            date: new Date(deed.created_at),
            content: {
              title: deed.title,
              description: deed.description || ''
            }
          });
        });
      }

      // Ordenar por data (mais recente primeiro)
      allHistory.sort((a, b) => b.date.getTime() - a.date.getTime());
      setHistoryData(allHistory);

    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchHistoryData();
    }
  }, [isOpen, user]);

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
            {item.content.title && (
              <p className="text-sm font-medium mb-1">{item.content.title}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {item.content.description}
            </p>
          </div>
        )}
      </div>
    </Card>
  );

  const getTabCount = (type: string) => {
    if (type === 'all') return historyData.length;
    return historyData.filter(item => item.type === type).length;
  };

  const handlePrint = async () => {
    console.log('handlePrint iniciado');
    console.log('Capacitor.isNativePlatform():', Capacitor.isNativePlatform());
    console.log('filteredHistory.length:', filteredHistory.length);
    
    // Criar texto formatado para compartilhamento/impressão
    let shareText = `🙏 MEU HISTÓRICO DE GRATIDÃO\n`;
    shareText += `Gerado em ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}\n\n`;
    shareText += `═══════════════════════════════\n\n`;
    
    filteredHistory.forEach((item, index) => {
      shareText += `${getTypeLabel(item.type).toUpperCase()}\n`;
      shareText += `${format(item.date, "dd 'de' MMM 'de' yyyy", { locale: ptBR })}\n\n`;
      
      if (item.type === 'gratitude' && item.content.items) {
        item.content.items.forEach(gratitude => {
          shareText += `♥ ${gratitude}\n`;
        });
      } else if (item.type === 'letter') {
        shareText += `Para: ${item.content.recipient}\n\n`;
        shareText += `${item.content.message}\n`;
      } else if (item.type === 'deed') {
        if (item.content.title) {
          shareText += `${item.content.title}\n`;
        }
        shareText += `${item.content.description}\n`;
      }
      
      shareText += `\n───────────────────────────────\n\n`;
    });
    
    if (filteredHistory.length === 0) {
      shareText += `Nenhum registro encontrado.\n`;
    }
    
    // Tentar compartilhar usando Capacitor Share API (funciona em mobile e web)
    try {
      console.log('Tentando Share.share...');
      await Share.share({
        title: 'Meu Histórico de Gratidão',
        text: shareText,
        dialogTitle: 'Compartilhar ou imprimir histórico'
      });
      
      toast({
        title: "Histórico compartilhado!",
        description: "Escolha imprimir nas opções de compartilhamento ou copie o texto.",
      });
      return;
    } catch (error: any) {
      console.log('Share.share falhou:', error);
      
      // Se o usuário cancelou, não mostrar erro
      if (error.message && error.message.includes('cancel')) {
        console.log('Usuário cancelou o compartilhamento');
        return;
      }
      
      // Fallback: tentar impressão tradicional apenas na web
      if (!Capacitor.isNativePlatform()) {
        console.log('Tentando impressão tradicional na web...');
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          toast({
            title: "Erro",
            description: "Não foi possível abrir janela de impressão. Verifique se pop-ups estão bloqueados.",
            variant: "destructive",
          });
          return;
        }

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Meu Histórico de Gratidão</title>
          <style>
            @page {
              margin: 2cm;
              size: A4;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1e293b;
              margin: 0;
              font-size: 28px;
            }
            .header .date {
              color: #64748b;
              font-size: 14px;
              margin-top: 10px;
            }
            .entry {
              margin-bottom: 25px;
              padding: 15px;
              border-left: 4px solid #22c55e;
              background: #f8fafc;
              border-radius: 0 8px 8px 0;
              page-break-inside: avoid;
            }
            .entry-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }
            .entry-type {
              font-weight: bold;
              font-size: 14px;
              color: #059669;
              text-transform: uppercase;
            }
            .entry-date {
              color: #64748b;
              font-size: 12px;
            }
            .gratitude-list {
              list-style: none;
              padding: 0;
            }
            .gratitude-list li {
              margin-bottom: 8px;
              padding-left: 20px;
              position: relative;
            }
            .gratitude-list li:before {
              content: '♥';
              color: #22c55e;
              position: absolute;
              left: 0;
            }
            .letter-content {
              background: white;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .letter-recipient {
              font-weight: bold;
              margin-bottom: 10px;
              color: #1e293b;
            }
            .deed-title {
              font-weight: bold;
              color: #1e293b;
              margin-bottom: 5px;
            }
            .page-break {
              page-break-before: always;
            }
            @media print {
              body { print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🙏 Meu Histórico de Gratidão</h1>
            <div class="date">Gerado em ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</div>
          </div>
          
          ${filteredHistory.map((item, index) => `
            <div class="entry ${index > 0 && index % 8 === 0 ? 'page-break' : ''}">
              <div class="entry-header">
                <span class="entry-type">${getTypeLabel(item.type)}</span>
                <span class="entry-date">${format(item.date, "dd 'de' MMM 'de' yyyy", { locale: ptBR })}</span>
              </div>
              
              ${item.type === 'gratitude' && item.content.items ? `
                <ul class="gratitude-list">
                  ${item.content.items.map(gratitude => `<li>${gratitude}</li>`).join('')}
                </ul>
              ` : ''}
              
              ${item.type === 'letter' ? `
                <div class="letter-content">
                  <div class="letter-recipient">Para: ${item.content.recipient}</div>
                  <div>${item.content.message}</div>
                </div>
              ` : ''}
              
              ${item.type === 'deed' ? `
                <div>
                  ${item.content.title ? `<div class="deed-title">${item.content.title}</div>` : ''}
                  <div>${item.content.description}</div>
                </div>
              ` : ''}
            </div>
          `).join('')}
          
          ${filteredHistory.length === 0 ? `
            <div style="text-align: center; padding: 50px; color: #64748b;">
              <p>Nenhum registro encontrado para impressão.</p>
            </div>
          ` : ''}
        </body>
        </html>
      `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
        
        toast({
          title: "Histórico preparado!",
          description: "Abrindo janela de impressão...",
        });
      } else {
        // Mobile e Share API não disponível
        toast({
          title: "Função não disponível",
          description: "Não foi possível compartilhar ou imprimir neste momento.",
          variant: "destructive",
        });
      }
    }
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
              {loading ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground">Carregando histórico...</p>
                </div>
              ) : filteredHistory.length > 0 ? (
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
              {loading ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground">Carregando gratidões...</p>
                </div>
              ) : filteredHistory.length > 0 ? (
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
              {loading ? (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 mx-auto mb-3 text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground">Carregando cartas...</p>
                </div>
              ) : filteredHistory.length > 0 ? (
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
              {loading ? (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 mx-auto mb-3 text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground">Carregando boas ações...</p>
                </div>
              ) : filteredHistory.length > 0 ? (
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
        
        <div className="mt-4 pt-4 border-t space-y-2">
          {filteredHistory.length > 0 && (
            <Button 
              onClick={handlePrint}
              variant="default" 
              className="w-full"
              disabled={loading}
            >
              {Capacitor.isNativePlatform() ? (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar Histórico
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Histórico
                </>
              )}
            </Button>
          )}
          
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