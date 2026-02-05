
import React, { useState } from 'react';
import { Apple, ArrowLeft, Loader2, Mail, Lock, User, CheckCircle } from 'lucide-react';

interface AuthProps {
  onLogin: (userData: { name: string; email: string }) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de processamento
    setTimeout(() => {
      setLoading(false);
      // No login, se o nome estiver vazio (já que não tem campo nome no login), usamos o email como base ou um nome padrão
      const finalName = mode === 'register' ? formData.name : formData.email.split('@')[0];
      onLogin({
        name: finalName,
        email: formData.email
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left Decoration */}
      <div className="hidden md:flex flex-1 bg-emerald-600 items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/30 via-transparent to-transparent"></div>
        <div className="relative z-10 space-y-8 text-white max-w-md">
          <div className="w-16 h-16 bg-white text-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <Apple size={36} />
          </div>
          <h2 className="text-4xl font-black leading-tight">Sua jornada para uma vida saudável começa agora.</h2>
          <div className="space-y-4">
            {[
              "Personalize sua dieta com IA",
              "Acompanhe macros por fotos",
              "Treine de qualquer lugar",
              "Biblioteca exclusiva de planos"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 opacity-90">
                <CheckCircle size={20} className="text-white shrink-0" />
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-20 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="w-full max-w-sm space-y-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900">
              {mode === 'login' ? 'Bem-vindo' : 'Crie sua conta'}
            </h1>
            <p className="text-slate-500 font-medium">
              {mode === 'login' 
                ? 'Acesse sua conta para continuar.' 
                : 'Preencha os campos para começar.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Seu Nome</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Como quer ser chamado?"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="seu@email.com"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (mode === 'login' ? 'Entrar' : 'Registrar')}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-slate-500 text-sm font-medium">
              {mode === 'login' ? 'Não tem uma conta?' : 'Já possui conta?'}
              <button 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="ml-2 text-emerald-600 font-black hover:underline transition-all"
              >
                {mode === 'login' ? 'Criar agora' : 'Entrar agora'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
