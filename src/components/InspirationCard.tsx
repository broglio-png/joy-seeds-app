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
  },
  // Reverendo Alexandre Broglio e outras frases inspiracionais
  {
    text: "A gratidão é a chave que abre as portas do coração e transforma a vida ordinária em extraordinária.",
    author: "Rev. Alexandre Broglio"
  },
  {
    text: "Quando cultivamos a gratidão, plantamos sementes de alegria que florescem em todas as estações da vida.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é o perfume que a alma desprende quando reconhece as bênçãos recebidas.",
    author: "Anônimo"
  },
  {
    text: "Seja grato não apenas pelo que você tem, mas também pelas dificuldades que não teve.",
    author: "John F. Kennedy"
  },
  {
    text: "A gratidão é a memória do coração que nunca esquece do bem recebido.",
    author: "Jean-Baptiste Massillon"
  },
  {
    text: "Um coração grato é como um ímã para os milagres da vida.",
    author: "Anônimo"
  },
  {
    text: "A gratidão transforma o que temos em suficiente, e mais do que suficiente.",
    author: "Melodie Beattie"
  },
  {
    text: "Quando você agradece, você reconhece que existe um poder maior que governa sua vida.",
    author: "Oprah Winfrey"
  },
  {
    text: "A gratidão é a virtude que mais nos aproxima de Deus e dos homens.",
    author: "Cícero"
  },
  {
    text: "Agradeça pelo ontem, viva o hoje e tenha esperança no amanhã.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é como uma oração silenciosa que eleva a alma.",
    author: "Anônimo"
  },
  {
    text: "Quando você muda a maneira de olhar para as coisas, as coisas que você olha mudam.",
    author: "Wayne Dyer"
  },
  {
    text: "A gratidão é a fonte da verdadeira riqueza, pois nos ensina a valorizar o que já possuímos.",
    author: "Anônimo"
  },
  {
    text: "Ser grato é reconhecer que a vida é um presente, não um direito.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é o antídoto para a amargura e o remédio para a tristeza.",
    author: "Anônimo"
  },
  {
    text: "Cada dia oferece mil motivos para agradecer, mas só precisamos de olhos para vê-los.",
    author: "Anônimo"
  },
  {
    text: "A gratidão é a música mais bela que podemos tocar no instrumento da vida.",
    author: "Anônimo"
  },
  {
    text: "Quando você é grato, o medo desaparece e a abundância aparece.",
    author: "Tony Robbins"
  },
  {
    text: "A gratidão é a única resposta apropriada aos dons da vida.",
    author: "Albert Schweitzer"
  },
  {
    text: "Um dia sem gratidão é um dia perdido na jornada da felicidade.",
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
    <div className="card-sophisticated bg-gradient-peaceful rounded-[2rem] p-8 shadow-elegant animate-scale-in overflow-hidden relative">
      {/* Subtle decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="glass p-3 rounded-[1.25rem] shrink-0 shadow-soft">
          <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div className={`space-y-4 flex-1 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <blockquote className="text-white font-serif text-xl leading-relaxed font-semibold tracking-tight">
            "{quote.text}"
          </blockquote>
          <cite className="text-white/90 text-sm font-bold tracking-wide">
            — {quote.author}
          </cite>
        </div>
      </div>
      
      {/* Indicador de progresso sofisticado */}
      <div className="flex justify-center mt-7 gap-2 relative z-10">
        {inspirationalQuotes.slice(0, 8).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentQuoteIndex % 8 
                ? 'bg-white/80 w-10 shadow-sm' 
                : 'bg-white/25 w-2.5 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InspirationCard;