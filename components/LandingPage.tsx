
import React from 'react';
// Added missing Utensils import from lucide-react
import { Apple, Zap, Camera, Dumbbell, ShieldCheck, ArrowRight, Check, Utensils } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.getElementById('precos');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <Apple size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">NutiAI</span>
        </div>
        <button 
          onClick={onStart}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all"
        >
          Entrar
        </button>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
            <Zap size={14} /> Alimentado por Inteligência Artificial
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">
            A evolução da sua <span className="text-emerald-600">Nutrição</span> começa aqui.
          </h1>
          <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
            Planos alimentares inteligentes, reconhecimento visual de refeições e treinos personalizados em um só lugar. A tecnologia a favor da sua saúde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onStart}
              className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20"
            >
              Começar Agora <ArrowRight size={18} />
            </button>
            <a 
              href="#precos"
              onClick={scrollToPricing}
              className="bg-white border border-slate-200 text-slate-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              Ver Plano
            </a>
          </div>
        </div>
        <div className="flex-1 relative animate-in fade-in zoom-in-90 duration-1000">
          <div className="absolute -inset-4 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" 
            alt="Healthy Food" 
            className="relative w-full rounded-[3rem] shadow-2xl border-4 border-white"
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-black text-slate-900">Funcionalidades do <span className="text-emerald-600">NutiAI</span></h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Tudo o que você precisa para transformar seu corpo e mente em uma plataforma simples e rápida.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                <Utensils size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Gerador de Dietas</h3>
              <p className="text-slate-500 leading-relaxed">Planos completos de 7 dias baseados no seu perfil biológico e objetivos específicos.</p>
            </div>
            <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Visão Computacional</h3>
              <p className="text-slate-500 leading-relaxed">Tire uma foto do seu prato e deixe nossa IA identificar calorias e macros instantaneamente.</p>
            </div>
            <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-600/20 group-hover:scale-110 transition-transform">
                <Dumbbell size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Treinos Inteligentes</h3>
              <p className="text-slate-500 leading-relaxed">Rotinas de exercícios personalizadas que se adaptam ao seu local de treino e limitações.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex-1 space-y-6 relative">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Acesso Completo <br/>Sem Mensalidades</h2>
            <p className="text-slate-400 text-lg">Pagamento único para desbloquear todas as ferramentas de IA e levar sua saúde para o próximo nível.</p>
            <div className="space-y-4">
              {[
                "Gerador de Dietas Ilimitado",
                "Scanner de Refeições IA",
                "Biblioteca de Treinos",
                "Suporte a 10 itens salvos",
                "Reset Diário Automático"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-5 h-5 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                    <Check size={12} />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-96 bg-white rounded-[2.5rem] p-10 shadow-2xl relative animate-bounce-slow">
            <div className="text-center space-y-4">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Plano Vitalício</span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-slate-400">R$</span>
                <span className="text-6xl font-black text-slate-900">10</span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pagamento Único</p>
              <button 
                onClick={onStart}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
              >
                Assinar Agora
              </button>
              <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px]">
                <ShieldCheck size={14} /> Compra 100% Segura
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50">
            <Apple size={20} />
            <span className="font-bold">NutiAI © 2024</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400 font-medium">
            <a href="#" className="hover:text-emerald-600">Privacidade</a>
            <a href="#" className="hover:text-emerald-600">Termos</a>
            <a href="#" className="hover:text-emerald-600">Contato</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
