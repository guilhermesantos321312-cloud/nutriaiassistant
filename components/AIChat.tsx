
import React, { useState, useRef, useEffect } from 'react';
import { getNutritionAdvice } from '../services/gemini';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Eu sou o NutiAI, seu assistente dedicado de nutrição e saúde. Como posso ajudar você a alcançar seus objetivos hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getNutritionAdvice(input, messages);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Desculpe, não consegui processar isso no momento.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Erro ao comunicar com a IA. Verifique sua conexão.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      {/* Sugestões Rápidas */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-4 overflow-x-auto">
        <button 
          onClick={() => setInput("Quais são boas opções de lanches ricos em proteína?")}
          className="whitespace-nowrap bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors"
        >
          Lanches Proteicos
        </button>
        <button 
          onClick={() => setInput("Quanto de água devo beber por dia?")}
          className="whitespace-nowrap bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
        >
          Ingestão de Água
        </button>
        <button 
          onClick={() => setInput("Benefícios do jejum intermitente?")}
          className="whitespace-nowrap bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-xs font-bold border border-purple-100 hover:bg-purple-100 transition-colors"
        >
          Sobre Jejum
        </button>
      </div>

      {/* Mensagens */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              m.role === 'model' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {m.role === 'model' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-3xl ${
              m.role === 'model' 
              ? 'bg-white border border-slate-100 shadow-sm text-slate-800' 
              : 'bg-emerald-600 text-white shadow-md'
            }`}>
              <div className="prose prose-sm prose-slate max-w-none">
                {m.text.split('\n').map((line, idx) => (
                  <p key={idx} className="mb-2 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-emerald-600" size={16} />
              <span className="text-slate-500 text-sm">NutiAI está pensando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input de Chat */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-4 bg-slate-100 rounded-3xl p-2 pl-6">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte qualquer coisa sobre nutrição..."
            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 py-3"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
