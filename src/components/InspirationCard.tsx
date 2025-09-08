import { Sparkles } from "lucide-react";

const inspirationalQuotes = [
  {
    text: "A gratidão é a ferramenta mais poderosa no nosso relacionamento com Deus",
    author: "Reverendo Alexandre Broglio"
  },
  {
    text: "A gratidão é não apenas a maior das virtudes, mas a mãe de todas as outras.",
    author: "Cícero"
  },
  {
    text: "Retribua o bem que lhe foi feito, mesmo que seja apenas com gratidão.",
    author: "Confúcio"
  },
  {
    text: "A gratidão transforma o que temos em suficiente.",
    author: "Melody Beattie"
  }
];

const InspirationCard = () => {
  const today = new Date();
  const quoteIndex = today.getDate() % inspirationalQuotes.length;
  const quote = inspirationalQuotes[quoteIndex];

  return (
    <div className="bg-gradient-peaceful rounded-2xl p-6 shadow-card">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white/30 rounded-full shrink-0">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
        </div>
        <div className="space-y-3">
          <blockquote className="text-accent-foreground font-medium text-lg leading-relaxed">
            "{quote.text}"
          </blockquote>
          <cite className="text-accent-foreground/70 text-sm font-medium">
            — {quote.author}
          </cite>
        </div>
      </div>
    </div>
  );
};

export default InspirationCard;