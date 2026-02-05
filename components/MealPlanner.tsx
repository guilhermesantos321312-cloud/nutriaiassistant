
import React, { useState } from 'react';
import { generateMealPlan } from '../services/gemini';
import { jsPDF } from 'jspdf';
import { 
  PlusCircle, 
  Loader2, 
  Calendar, 
  Zap,
  Save,
  Download,
  ChevronRight,
  ArrowDown,
  Scale,
  ClipboardList,
  ChevronDown,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Target,
  Sparkles
} from 'lucide-react';
import { SavedDiet, DayPlan, MealDetail } from '../types';

// Fixed InputCard prop types to make children optional, resolving JSX children mismatch error
const InputCard = ({ label, icon, children }: { label: string, icon: React.ReactNode, children?: React.ReactNode }) => (
  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:bg-white transition-all">
    <div className="flex items-center gap-2 mb-2">
      <div className="text-slate-300 group-focus-within:text-emerald-500 transition-colors">
        {icon}
      </div>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
    </div>
    <div className="relative">
      {children}
    </div>
  </div>
);

const MealCard = ({ detail, label, icon, color }: { detail: MealDetail, label: string, icon: React.ReactNode, color: string }) => {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return (
    <div className="p-8 rounded-[2rem] border bg-slate-50/50 border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:scale-[1.02] group">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color]} shadow-sm`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
          <p className="text-xl font-black text-slate-800">{detail.calories} <span className="text-[10px] text-slate-400">kcal</span></p>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 font-bold leading-relaxed mb-6 h-12 overflow-hidden line-clamp-2">
        {detail.description}
      </p>
      
      <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100">
        <div className="text-center">
          <p className="text-[8px] font-black text-emerald-600 uppercase mb-0.5">Prot</p>
          <p className="text-sm font-black text-slate-700">{detail.protein}g</p>
        </div>
        <div className="text-center border-x border-slate-100">
          <p className="text-[8px] font-black text-blue-600 uppercase mb-0.5">Carb</p>
          <p className="text-sm font-black text-slate-700">{detail.carbs}g</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] font-black text-amber-600 uppercase mb-0.5">Gord</p>
          <p className="text-sm font-black text-slate-700">{detail.fats}g</p>
        </div>
      </div>
    </div>
  );
};

interface MealPlannerProps {
  onSaveDiet: (diet: Omit<SavedDiet, 'id' | 'createdAt'>) => void;
}

const MealPlanner: React.FC<MealPlannerProps> = ({ onSaveDiet }) => {
  const [profile, setProfile] = useState({
    age: '30', gender: 'Masculino', height: '180', weight: '75',
    activity: 'Moderadamente Ativo', goal: 'Manter Peso', restrictions: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<{targets: any, days: DayPlan[]} | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  const handleGenerate = async () => {
    setLoading(true);
    setPlanResult(null);
    try {
      const data = await generateMealPlan(profile);
      setPlanResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!planResult) return;
    
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text('NutiAI - Plano Alimentar', margin, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Objetivo: ${profile.goal} | Gerado em: ${new Date().toLocaleDateString()}`, margin, y);
    
    y += 15;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, 190, y);
    
    y += 15;
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Metas Diárias Recomendadas:', margin, y);
    
    y += 10;
    doc.setFontSize(11);
    doc.text(`Calorias: ${planResult.targets.calories} kcal`, margin, y);
    doc.text(`Proteinas: ${planResult.targets.protein}g`, margin + 60, y);
    doc.text(`Carbos: ${planResult.targets.carbs}g`, margin + 100, y);
    doc.text(`Gorduras: ${planResult.targets.fats}g`, margin + 140, y);
    
    y += 15;
    
    planResult.days.forEach((day) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129);
      doc.text(`${day.dayName}`, margin, y);
      
      y += 8;
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      
      const meals = [
        { label: 'Café da Manhã', data: day.breakfast },
        { label: 'Lanche', data: day.snack },
        { label: 'Almoço', data: day.lunch },
        { label: 'Jantar', data: day.dinner }
      ];
      
      meals.forEach(m => {
        const text = `${m.label}: ${m.data.description} (${m.data.calories}kcal | P: ${m.data.protein}g | C: ${m.data.carbs}g | G: ${m.data.fats}g)`;
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, margin, y);
        y += (lines.length * 5) + 2;
      });
      
      y += 5;
    });

    doc.save(`Dieta_NutiAI_${profile.goal.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Seção de Configuração */}
      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800">Inteligência Alimentar</h2>
              <p className="text-slate-400 font-medium">Preencha seu perfil para gerar seu plano personalizado</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <InputCard label="Idade" icon={<Calendar size={18} />}>
              <input 
                type="number" 
                value={profile.age} 
                onChange={(e) => setProfile(p => ({...p, age: e.target.value}))} 
                className="w-full bg-transparent border-none outline-none font-bold text-slate-700" 
              />
            </InputCard>

            <InputCard label="Gênero" icon={<ChevronDown size={18} />}>
              <select 
                value={profile.gender} 
                onChange={(e) => setProfile(p => ({...p, gender: e.target.value}))} 
                className="w-full bg-transparent border-none outline-none font-bold text-slate-700 appearance-none"
              >
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
              </select>
            </InputCard>

            <InputCard label="Altura (cm)" icon={<ArrowDown size={18} />}>
              <input 
                type="number" 
                value={profile.height} 
                onChange={(e) => setProfile(p => ({...p, height: e.target.value}))} 
                className="w-full bg-transparent border-none outline-none font-bold text-slate-700" 
              />
            </InputCard>

            <InputCard label="Peso (kg)" icon={<Scale size={18} />}>
              <input 
                type="number" 
                value={profile.weight} 
                onChange={(e) => setProfile(p => ({...p, weight: e.target.value}))} 
                className="w-full bg-transparent border-none outline-none font-bold text-slate-700" 
              />
            </InputCard>

            <InputCard label="Atividade" icon={<Zap size={18} />}>
              <select 
                value={profile.activity} 
                onChange={(e) => setProfile(p => ({...p, activity: e.target.value}))} 
                className="w-full bg-transparent border-none outline-none font-bold text-slate-700 appearance-none"
              >
                <option>Sedentário</option>
                <option>Levemente Ativo</option>
                <option>Moderadamente Ativo</option>
                <option>Muito Ativo</option>
              </select>
            </InputCard>

            <InputCard label="Objetivo" icon={<Target size={18} />}>
              <select 
                value={profile.goal} 
                onChange={(e) => setProfile(p => ({...p, goal: e.target.value}))} 
                className="w-full bg-transparent border-none outline-none font-bold text-slate-700 appearance-none"
              >
                <option>Manter Peso</option>
                <option>Emagrecer</option>
                <option>Ganhar Massa</option>
                <option>Definição</option>
              </select>
            </InputCard>
          </div>

          <div className="space-y-2 mb-10">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Restrições ou Preferências</label>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:bg-white transition-all flex items-start gap-4">
              <ClipboardList className="text-slate-300 mt-1" size={20} />
              <textarea 
                value={profile.restrictions} 
                onChange={(e) => setProfile(p => ({...p, restrictions: e.target.value}))} 
                className="w-full bg-transparent border-none outline-none h-24 font-medium text-slate-600 resize-none" 
                placeholder="Ex: Sou vegetariano, não gosto de brócolis, alergia a ovo..."
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleGenerate} 
              disabled={loading} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 px-20 rounded-[2rem] shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95 text-sm tracking-widest uppercase"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
              {loading ? 'Processando IA...' : 'Gerar Plano 7 Dias'}
            </button>
          </div>
        </div>
      </section>

      {/* Resultado do Plano */}
      {planResult && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-4xl font-black mb-2">Plano Estratégico</h3>
              <p className="text-slate-400 font-medium">Alvos diários baseados no seu objetivo de {profile.goal}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 relative z-10">
               <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] backdrop-blur-md text-center">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Calorias</p>
                  <p className="text-3xl font-black">{planResult.targets.calories}</p>
               </div>
               <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] backdrop-blur-md text-center">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Proteínas</p>
                  <p className="text-3xl font-black">{planResult.targets.protein}g</p>
               </div>
            </div>

            <div className="flex gap-3 relative z-10">
              <button 
                onClick={() => onSaveDiet({
                  name: `Dieta ${profile.goal} (${new Date().toLocaleDateString()})`,
                  targets: planResult.targets,
                  days: planResult.days
                })} 
                className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg"
                title="Salvar na Biblioteca"
              >
                <Save size={24} />
              </button>
              <button 
                onClick={exportToPDF} 
                className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 border border-white/10 transition-all"
                title="Exportar PDF"
              >
                <Download size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {planResult.days.map((day, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <button 
                  onClick={() => setExpandedDay(expandedDay === idx ? null : idx)} 
                  className={`w-full flex items-center justify-between p-8 transition-colors ${expandedDay === idx ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-xl text-slate-300 border border-slate-100 shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="text-left">
                      <span className="text-2xl font-black text-slate-800">{day.dayName}</span>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Clique para ver o cardápio</p>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center transition-transform duration-500 ${expandedDay === idx ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} className="text-slate-400" />
                  </div>
                </button>
                
                {expandedDay === idx && (
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                    <MealCard detail={day.breakfast} label="Café da Manhã" icon={<Coffee size={20} />} color="emerald" />
                    <MealCard detail={day.snack} label="Lanche Rápido" icon={<Cookie size={20} />} color="amber" />
                    <MealCard detail={day.lunch} label="Almoço Nutritivo" icon={<Sun size={20} />} color="blue" />
                    <MealCard detail={day.dinner} label="Jantar Leve" icon={<Moon size={20} />} color="purple" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
