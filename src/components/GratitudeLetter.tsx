import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Mail, Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GratitudeLetterProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const GratitudeLetter = ({ isOpen, onOpenChange }: GratitudeLetterProps) => {
  const { toast } = useToast();
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [senderName, setSenderName] = useState("");

  const handleSendLetter = () => {
    if (!recipientName || !letterContent || !senderName) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o nome do destinatário, sua mensagem e seu nome.",
        variant: "destructive"
      });
      return;
    }

    // Create mailto link
    const subject = encodeURIComponent(`Uma carta de gratidão de ${senderName} 💝`);
    const body = encodeURIComponent(
      `Querido(a) ${recipientName},\n\n${letterContent}\n\nCom gratidão,\n${senderName}\n\n---\nEscrita através do Diário da Gratidão GRA`
    );
    
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    
    // Copy to clipboard as fallback
    const letterText = `Querido(a) ${recipientName},\n\n${letterContent}\n\nCom gratidão,\n${senderName}`;
    navigator.clipboard.writeText(letterText);
    
    if (recipientEmail) {
      window.open(mailtoLink, '_blank');
    }

    toast({
      title: "Carta enviada! 💌",
      description: recipientEmail ? "Link do email aberto. Carta copiada para área de transferência." : "Carta copiada para área de transferência.",
    });

    // Reset form
    setRecipientName("");
    setRecipientEmail("");
    setLetterContent("");
    setSenderName("");
    onOpenChange(false);
  };

  const inspirationalPrompts = [
    "Lembro-me de quando você...",
    "Sou grato(a) por ter você em minha vida porque...",
    "Sua bondade me tocou quando...",
    "Obrigado(a) por sempre...",
    "Você fez a diferença na minha vida ao..."
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Heart className="w-5 h-5" />
            Carta de Gratidão
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient Info */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="recipient">Para quem você gostaria de agradecer?</Label>
              <Input
                id="recipient"
                placeholder="Nome da pessoa"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Inspiration */}
          <Card className="p-4 bg-gradient-peaceful/10 border-peaceful/20">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Inspiração para sua carta:
            </h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              {inspirationalPrompts.map((prompt, index) => (
                <p key={index}>• {prompt}</p>
              ))}
            </div>
          </Card>

          {/* Letter Content */}
          <div>
            <Label htmlFor="letter">Sua mensagem de gratidão</Label>
            <Textarea
              id="letter"
              placeholder="Escreva aqui sua mensagem de coração... Conte como essa pessoa impactou sua vida, o que você admira nela, ou simplesmente agradeça por algo específico que ela fez."
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              rows={6}
              className="mt-1"
            />
          </div>

          {/* Sender Name */}
          <div>
            <Label htmlFor="sender">Seu nome</Label>
            <Input
              id="sender"
              placeholder="Como você gostaria de assinar?"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendLetter}
              variant="gradient"
              className="flex-1 gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar Carta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GratitudeLetter;