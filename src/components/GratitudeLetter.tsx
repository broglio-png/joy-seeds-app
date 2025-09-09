import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Mail, Send, Heart, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Security constants
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 limit
const MAX_MESSAGE_LENGTH = 2000;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const { toast } = useToast();
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [senderName, setSenderName] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    if (email.length > MAX_EMAIL_LENGTH) {
      setEmailError("Email muito longo");
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Formato de email inválido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateTextLength = (text: string, maxLength: number): boolean => {
    return text.length <= maxLength;
  };

  const handleSendLetter = () => {
    // Sanitize inputs
    const sanitizedRecipientName = sanitizeInput(recipientName.trim());
    const sanitizedRecipientEmail = recipientEmail.trim();
    const sanitizedLetterContent = sanitizeInput(letterContent.trim());
    const sanitizedSenderName = sanitizeInput(senderName.trim());

    // Validation
    if (!sanitizedRecipientName || !sanitizedLetterContent || !sanitizedSenderName) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o nome do destinatário, sua mensagem e seu nome.",
        variant: "destructive"
      });
      return;
    }

    // Length validation
    if (!validateTextLength(sanitizedRecipientName, MAX_NAME_LENGTH)) {
      toast({
        title: "Nome muito longo",
        description: `O nome do destinatário deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
        variant: "destructive"
      });
      return;
    }

    if (!validateTextLength(sanitizedSenderName, MAX_NAME_LENGTH)) {
      toast({
        title: "Nome muito longo",
        description: `Seu nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
        variant: "destructive"
      });
      return;
    }

    if (!validateTextLength(sanitizedLetterContent, MAX_MESSAGE_LENGTH)) {
      toast({
        title: "Mensagem muito longa",
        description: `A mensagem deve ter no máximo ${MAX_MESSAGE_LENGTH} caracteres.`,
        variant: "destructive"
      });
      return;
    }

    // Email validation
    if (!validateEmail(sanitizedRecipientEmail)) {
      return;
    }

    // Create mailto link with sanitized content
    const subject = encodeURIComponent(`Uma carta de gratidão de ${sanitizedSenderName} 💝`);
    const body = encodeURIComponent(
      `Querido(a) ${sanitizedRecipientName},\n\n${sanitizedLetterContent}\n\nCom gratidão,\n${sanitizedSenderName}\n\n---\nEscrita através do Diário da Gratidão GRA`
    );
    
    const mailtoLink = `mailto:${sanitizedRecipientEmail}?subject=${subject}&body=${body}`;
    
    // Copy to clipboard as fallback
    const letterText = `Querido(a) ${sanitizedRecipientName},\n\n${sanitizedLetterContent}\n\nCom gratidão,\n${sanitizedSenderName}`;
    navigator.clipboard.writeText(letterText);
    
    if (sanitizedRecipientEmail) {
      window.open(mailtoLink, '_blank');
    }

    toast({
      title: "Carta enviada! 💌",
      description: sanitizedRecipientEmail ? "Link do email aberto. Carta copiada para área de transferência." : "Carta copiada para área de transferência.",
    });

    // Reset form
    setRecipientName("");
    setRecipientEmail("");
    setLetterContent("");
    setSenderName("");
    setEmailError("");
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
            
            <div>
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={recipientEmail}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_EMAIL_LENGTH) {
                    setRecipientEmail(value);
                    validateEmail(value);
                  }
                }}
                maxLength={MAX_EMAIL_LENGTH}
                className={`mt-1 ${emailError ? 'border-destructive focus:border-destructive' : ''}`}
              />
              {emailError && (
                <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {emailError}
                </div>
              )}
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span></span>
                <span>{recipientEmail.length}/{MAX_EMAIL_LENGTH}</span>
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