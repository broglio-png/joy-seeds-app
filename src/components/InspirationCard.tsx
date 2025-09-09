import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const inspirationalQuotes = [
  // Gratidão
  {
    text: "A gratidão é o solo fértil onde florescem todas as virtudes.",
    author: "Anônimo"
  },
  {
    text: "A verdadeira riqueza não está no que possuímos, mas no que apreciamos.",
    author: "Epicuro"
  },
  {
    text: "A gratidão é a chave que abre as portas da abundância.",
    author: "Anônimo"
  },
  {
    text: "Aquele que agradece, multiplica o que tem.",
    author: "Provérbio popular"
  },
  {
    text: "A gratidão é a arte de pintar arco-íris com as cores da vida.",
    author: "Anônimo"
  },
  {
    text: "A gratidão não é apenas um ato, mas um estilo de vida.",
    author: "William Arthur Ward"
  },
  {
    text: "A alma que agradece é uma alma que encontra paz.",
    author: "Anônimo"
  },
  // Bondade
  {
    text: "Nenhum ato de bondade, por menor que seja, é desperdiçado.",
    author: "Esopo"
  },
  {
    text: "A bondade é o perfume que deixamos na vida dos outros.",
    author: "Anônimo"
  },
  {
    text: "Seja a razão pela qual alguém acredita na bondade do mundo.",
    author: "Anônimo"
  },
  {
    text: "A bondade é a linguagem universal que todos entendem.",
    author: "Mark Twain"
  },
  {
    text: "A maior forma de bondade é aquela que não espera nada em troca.",
    author: "Anônimo"
  },
  {
    text: "A bondade é contagiosa. Espalhe-a sem moderação.",
    author: "Marco Aurélio"
  },
  {
    text: "Quando você é gentil, o mundo se torna um lugar melhor.",
    author: "Dalai Lama"
  },
  // Retribuição
  {
    text: "Retribua o bem que lhe foi feito, mesmo que seja apenas com gratidão.",
    author: "Confúcio"
  },
  {
    text: "A gratidão é a única dívida que nunca conseguimos pagar por completo.",
    author: "Anônimo"
  },
  {
    text: "Retribuir é a forma mais pura de reconhecer o que recebemos.",
    author: "Anônimo"
  },
  {
    text: "A retribuição não é uma obrigação, mas uma oportunidade de espalhar o bem.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é o vinho da alma; a retribuição é o brinde que fazemos à vida.",
    author: "Rumi"
  },
  {
    text: "A retribuição é a música que ecoa quando o coração está cheio de gratidão.",
    author: "Anônimo"
  },
  // Estoicas
  {
    text: "Aceite tudo o que acontece com gratidão, pois até as adversidades têm seu propósito.",
    author: "Marco Aurélio"
  },
  {
    text: "A felicidade não consiste em desejar o que não temos, mas em agradecer o que já possuímos.",
    author: "Sêneca"
  },
  {
    text: "A gratidão é a virtude que nos ensina a viver em harmonia com o destino.",
    author: "Epicteto"
  },
  {
    text: "Não é a felicidade que nos torna gratos, mas a gratidão que nos torna felizes.",
    author: "Marco Aurélio"
  },
  {
    text: "A vida é um presente. Seja grato, mesmo pelas dificuldades, pois elas moldam sua alma.",
    author: "Sêneca"
  },
  {
    text: "Aquele que é grato por pouco, é digno de muito.",
    author: "Epicteto"
  },
  {
    text: "A gratidão é a fortaleza do espírito contra os ventos da adversidade.",
    author: "Marco Aurélio"
  },
  // Resiliência e Superação
  {
    text: "A gratidão transforma feridas em sabedoria e desafios em oportunidades.",
    author: "Anônimo"
  },
  {
    text: "A vida é cheia de altos e baixos, mas a gratidão é o que nos mantém firmes.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é o farol que ilumina os dias mais sombrios.",
    author: "Anônimo"
  },
  {
    text: "Mesmo nas tempestades, há algo pelo qual ser grato.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é a ponte entre o que somos e o que podemos nos tornar.",
    author: "Anônimo"
  },
  {
    text: "A força de um coração grato é maior do que qualquer adversidade.",
    author: "Anônimo"
  },
  // Alegria e Abundância
  {
    text: "A gratidão transforma o ordinário em extraordinário.",
    author: "William Arthur Ward"
  },
  {
    text: "A alegria é o reflexo de um coração grato.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é o segredo para atrair mais do que você ama.",
    author: "Anônimo"
  },
  {
    text: "Quando você agradece, o universo conspira para lhe dar mais motivos para sorrir.",
    author: "Anônimo"
  },
  {
    text: "A abundância começa com um simples ato de gratidão.",
    author: "Melody Beattie"
  },
  {
    text: "A gratidão é o ímã que atrai a felicidade.",
    author: "Anônimo"
  },
  {
    text: "A vida é mais doce quando você aprecia até as pequenas coisas.",
    author: "Anônimo"
  },
  // Conexão e Relacionamentos
  {
    text: "A gratidão fortalece os laços invisíveis que nos conectam uns aos outros.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é a linguagem que constrói pontes entre corações.",
    author: "Anônimo"
  },
  {
    text: "Um simples 'obrigado' pode transformar um estranho em um amigo.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é o alicerce de todos os relacionamentos duradouros.",
    author: "Anônimo"
  },
  {
    text: "Quando agradecemos, espalhamos amor e criamos conexões mais profundas.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é o presente mais valioso que podemos dar a alguém.",
    author: "Anônimo"
  },
  // Motivação Diária
  {
    text: "Cada dia é uma nova oportunidade de agradecer e crescer.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é o primeiro passo para uma vida plena.",
    author: "Anônimo"
  },
  {
    text: "Hoje, encontre algo pelo qual ser grato e veja como seu dia muda.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é o combustível que nos move em direção aos nossos sonhos.",
    author: "Anônimo"
  },
  {
    text: "Agradeça pelo que você tem enquanto trabalha pelo que deseja.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é a bússola que nos guia para o que realmente importa.",
    author: "Anônimo"
  }
];

const InspirationCard = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % inspirationalQuotes.length);
        setIsAnimating(false);
      }, 300);
    }, 4000); // Muda a cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  const quote = inspirationalQuotes[currentQuoteIndex];

  return (
    <div className="bg-gradient-peaceful rounded-2xl p-6 shadow-card">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white/30 rounded-full shrink-0">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
        </div>
        <div className={`space-y-3 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <blockquote className="text-accent-foreground font-medium text-lg leading-relaxed">
            "{quote.text}"
          </blockquote>
          <cite className="text-accent-foreground/70 text-sm font-medium">
            — {quote.author}
          </cite>
        </div>
      </div>
      
      {/* Indicador de progresso do carrossel */}
      <div className="flex justify-center mt-4 gap-1">
        {inspirationalQuotes.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 rounded-full transition-colors duration-300 ${
              index === currentQuoteIndex ? 'bg-accent-foreground/50' : 'bg-accent-foreground/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InspirationCard;