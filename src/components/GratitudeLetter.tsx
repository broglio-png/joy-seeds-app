import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Mail, Send, Heart, AlertCircle, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';

// Security constants
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2000;

// Input sanitization function
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

interface GratitudeLetterProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const GratitudeLetter = ({ isOpen, onOpenChange }: GratitudeLetterProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipientName, setRecipientName] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [senderName, setSenderName] = useState("");
  const [loading, setLoading] = useState(false);

  const validateTextLength = (text: string, maxLength: number): boolean => {
    return text.length <= maxLength;
  };

  const handleSendLetter = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Sanitize inputs
    const sanitizedRecipientName = sanitizeInput(recipientName.trim());
    const sanitizedLetterContent = sanitizeInput(letterContent.trim());
    const sanitizedSenderName = sanitizeInput(senderName.trim());

    // Validation
    if (!sanitizedRecipientName || !sanitizedLetterContent || !sanitizedSenderName) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome do destinatário, sua mensagem e seu nome.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Length validation
    if (!validateTextLength(sanitizedRecipientName, MAX_NAME_LENGTH)) {
      toast({
        title: "Nome muito longo",
        description: `O nome do destinatário deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!validateTextLength(sanitizedSenderName, MAX_NAME_LENGTH)) {
      toast({
        title: "Nome muito longo",
        description: `Seu nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!validateTextLength(sanitizedLetterContent, MAX_MESSAGE_LENGTH)) {
      toast({
        title: "Mensagem muito longa",
        description: `A mensagem deve ter no máximo ${MAX_MESSAGE_LENGTH} caracteres.`,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // Save to database
      const { error } = await supabase
        .from('gratitude_letters')
        .insert({
          user_id: user.id,
          recipient_name: sanitizedRecipientName,
          recipient_email: '',
          content: sanitizedLetterContent,
          sender_name: sanitizedSenderName
        });

      if (error) throw error;

      // Create the letter text
      const letterText = `Querido(a) ${sanitizedRecipientName},\n\n${sanitizedLetterContent}\n\nCom gratidão,\n${sanitizedSenderName}\n\n---\nEscrita através do Diário da Gratidão`;
      
      // Try multiple methods to ensure it works on all platforms
      let copySuccess = false;
      let shareSuccess = false;
      
      // Try Capacitor Clipboard first (works on both web and native)
      try {
        await Clipboard.write({
          string: letterText
        });
        copySuccess = true;
      } catch (error) {
        console.log('Capacitor clipboard failed, trying navigator.clipboard', error);
      }
      
      // Fallback to navigator.clipboard if Capacitor failed
      if (!copySuccess) {
        try {
          await navigator.clipboard.writeText(letterText);
          copySuccess = true;
        } catch (error) {
          console.log('Navigator clipboard also failed', error);
        }
      }
      
      // Try native share if available
      try {
        await Share.share({
          title: `Uma carta de gratidão de ${sanitizedSenderName} 💝`,
          text: letterText,
          dialogTitle: 'Compartilhar carta de gratidão'
        });
        shareSuccess = true;
      } catch (error) {
        console.log('Share not available or cancelled', error);
      }
      
      // Show appropriate message
      if (copySuccess) {
        toast({
          title: shareSuccess ? "Carta salva e compartilhada! 💌" : "Carta salva e copiada! 💌",
          description: "Carta salva no histórico e copiada para área de transferência. Agora você pode colar no WhatsApp ou email.",
        });
      } else {
        toast({
          title: "Carta salva! 💌",
          description: "Carta salva no histórico. Não foi possível copiar automaticamente, mas você pode copiar o texto manualmente do histórico.",
        });
      }

      // Reset form
      setRecipientName("");
      setLetterContent("");
      setSenderName("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a carta. Tente novamente.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_NAME_LENGTH) {
                    setRecipientName(value);
                  }
                }}
                maxLength={MAX_NAME_LENGTH}
                className="mt-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span></span>
                <span>{recipientName.length}/{MAX_NAME_LENGTH}</span>
              </div>
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
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_MESSAGE_LENGTH) {
                  setLetterContent(value);
                }
              }}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={6}
              className="mt-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span></span>
              <span>{letterContent.length}/{MAX_MESSAGE_LENGTH}</span>
            </div>
          </div>

          {/* Sender Name */}
          <div>
            <Label htmlFor="sender">Seu nome</Label>
            <Input
              id="sender"
              placeholder="Como você gostaria de assinar?"
              value={senderName}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_NAME_LENGTH) {
                  setSenderName(value);
                }
              }}
              maxLength={MAX_NAME_LENGTH}
              className="mt-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span></span>
              <span>{senderName.length}/{MAX_NAME_LENGTH}</span>
            </div>
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
              disabled={loading}
              variant="gradient"
              className="flex-1 gap-2"
            >
              {Capacitor.isNativePlatform() ? <Share2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {loading ? "Salvando..." : Capacitor.isNativePlatform() ? "Compartilhar" : "Copiar Carta"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GratitudeLetter;