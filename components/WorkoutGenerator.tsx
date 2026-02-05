
import React, { useState, useEffect, useRef } from 'react';
import { generateWorkout } from '../services/gemini';
import { jsPDF } from 'jspdf';
import { 
  Dumbbell, 
  Loader2, 
  Zap, 
  Target, 
  Timer,
  ChevronDown,
  Activity,
  CalendarDays,
  Play,
  Square,
  Download,
  ChevronRight,
  Save,
  Trophy,
  Flashlight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Workout, Notification, WorkoutSession, SavedWorkout } from '../types';

interface WorkoutGeneratorProps {
  onNotify: (title: string, message: string, type: Notification['type']) => void;
  onSaveWorkout: (workout: Omit<SavedWorkout, 'id' | 'createdAt'>) => void;
}

const WorkoutGenerator: React.FC<WorkoutGeneratorProps> = ({ onNotify, onSaveWorkout }) => {
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [activeSessionIdx, setActiveSessionIdx] = useState(0);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [params, setParams] = useState({
    goal: 'Hipertrofia (Ganhar Massa)',
    level: 'Iniciante',
    location: 'Na Academia (Com aparelhos)',
    daysPerWeek: '3',
    limitations: ''
  });

  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isWorkoutActive) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setTimer(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isWorkoutActive]);

  const handleInputChange = (field: string, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setWorkout(null);
    setActiveSessionIdx(0);
    try {
      const data = await generateWorkout(params);
      setWorkout(data);
    } catch (error) {
      console.error(error);
      onNotify("Erro", "Não foi possível gerar seu treino. Tente novamente.", "info");
    } finally {
      setLoading(false);
    }
  };

  const exportWorkoutToPDF = (wToExport: Workout | SavedWorkout) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text('NutiAI - Seu Treino Inteligente', margin, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Objetivo: ${wToExport.goal} | Nível: ${params.level}`, margin, y);
    
    y += 15;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, 190, y);
    
    wToExport.sessions.forEach((session) => {
      if (y > 230) {
        doc.addPage();
        y = 20;
      }
      
      y += 15;
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text(`${session.dayName} - Foco: ${session.focus}`, margin, y);
      
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      
      session.exercises.forEach((ex, eIdx) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        const text = `${eIdx + 1}. ${ex.name} | ${ex.sets} séries x ${ex.reps} (Descanso: ${ex.rest})`;
        doc.text(text, margin, y);
        y += 7;
      });
      y += 5;
    });

    doc.save(`Treino_NutiAI_${wToExport.goal.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSave = () => {
    if (!workout) return;
    onSaveWorkout({
      name: `Treino ${params.goal} (${new Date().toLocaleDateString()})`,
      goal: params.goal,
      level: params.level,
      sessions: workout.sessions
    });
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setCurrentExerciseIdx(0);
    onNotify("Treino Iniciado", `Bom treino de ${workout?.sessions[activeSessionIdx].focus}!`, "workout");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Configuração de Treino */}
      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
              <Dumbbell size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800">Engenharia de Treino</h2>
              <p className="text-slate-400 font-medium">IA projetada para otimizar seus resultados físicos</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Objetivo Principal</label>
              <div className="relative group">
                <Target className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <select 
                  value={params.goal}
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-10 text-slate-700 font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none transition-all focus:bg-white"
                >
                  <option>Hipertrofia (Ganhar Massa)</option>
                  <option>Emagrecimento</option>
                  <option>Força Máxima</option>
                  <option>Condicionamento</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nível de Experiência</label>
              <div className="relative group">
                <Trophy className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <select 
                  value={params.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-10 text-slate-700 font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none transition-all focus:bg-white"
                >
                  <option>Iniciante</option>
                  <option>Intermediário</option>
                  <option>Avançado</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Local do Treino</label>
              <div className="relative group">
                <Activity className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <select 
                  value={params.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-10 text-slate-700 font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none transition-all focus:bg-white"
                >
                  <option>Na Academia</option>
                  <option>Em Casa (Bodyweight)</option>
                  <option>Com Halteres</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Frequência Semanal</label>
              <div className="relative group">
                <CalendarDays className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="number" 
                  min="1" max="7"
                  value={params.daysPerWeek}
                  onChange={(e) => handleInputChange('daysPerWeek', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-slate-700 font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-10">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Limitações Físicas</label>
            <textarea 
              value={params.limitations}
              onChange={(e) => handleInputChange('limitations', e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-6 px-8 text-slate-700 font-medium focus:ring-4 focus:ring-emerald-500/5 outline-none min-h-[120px] transition-all focus:bg-white resize-none"
              placeholder="Ex: Lesão no joelho, dor lombar, operado recentemente..."
            />
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-slate-900 hover:bg-black text-white font-black py-6 px-20 rounded-[2.5rem] shadow-2xl shadow-black/20 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95 uppercase tracking-widest text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} className="text-emerald-500" />}
              {loading ? 'Consultando IA...' : 'Gerar Rotina de Alta Performance'}
            </button>
          </div>
        </div>
      </section>

      {/* Resultado do Treino */}
      {workout && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col lg:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
             <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full"></div>
             
             <div className="relative z-10 text-center lg:text-left">
                <p className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mb-3">Rotina Gerada</p>
                <h3 className="text-4xl font-black mb-4">{workout.name}</h3>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5"><Target size={14} className="text-emerald-500" /> {workout.goal}</span>
                    <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5"><CalendarDays size={14} className="text-emerald-500" /> {params.daysPerWeek} Sessões</span>
                </div>
             </div>
             
             <div className="flex gap-4 relative z-10">
                <button 
                    onClick={() => exportWorkoutToPDF(workout)}
                    className="w-14 h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all flex items-center justify-center border border-white/10"
                >
                    <Download size={24} />
                </button>
                <button 
                    onClick={handleSave}
                    className="w-14 h-14 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl transition-all flex items-center justify-center border border-emerald-500/20"
                >
                    <Save size={24} />
                </button>
                
                {!isWorkoutActive ? (
                    <button 
                        onClick={startWorkout}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-emerald-600/20 transition-all uppercase text-sm tracking-widest"
                    >
                        <Play size={20} /> INICIAR
                    </button>
                ) : (
                    <div className="flex items-center gap-6 bg-emerald-600 px-6 py-4 rounded-2xl shadow-xl shadow-emerald-600/20">
                        <div className="text-left">
                            <p className="text-[8px] text-white/70 uppercase font-black tracking-widest">Timer</p>
                            <p className="text-xl font-black text-white">{formatTime(timer)}</p>
                        </div>
                        <button 
                            onClick={() => setIsWorkoutActive(false)}
                            className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-all"
                        >
                            <Square size={20} fill="white" />
                        </button>
                    </div>
                )}
             </div>
          </div>

          {/* Seletor de Sessões */}
          <div className="flex gap-3 overflow-x-auto pb-6 custom-scrollbar">
            {workout.sessions.map((session, idx) => (
              <button 
                key={idx}
                onClick={() => { setActiveSessionIdx(idx); setCurrentExerciseIdx(0); }}
                className={`group relative flex flex-col items-start px-8 py-5 rounded-[1.5rem] transition-all min-w-[200px] border ${
                  activeSessionIdx === idx 
                  ? 'bg-white border-emerald-500 shadow-xl' 
                  : 'bg-white border-slate-100 hover:border-emerald-200'
                }`}
              >
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeSessionIdx === idx ? 'text-emerald-500' : 'text-slate-400'}`}>
                  Sessão {String.fromCharCode(65 + idx)}
                </p>
                <p className={`text-lg font-black ${activeSessionIdx === idx ? 'text-slate-900' : 'text-slate-400'}`}>
                  {session.dayName}
                </p>
                {activeSessionIdx === idx && (
                  <div className="absolute bottom-0 left-8 right-8 h-1 bg-emerald-500 rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Detalhes da Sessão */}
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm animate-in slide-in-from-top-4 duration-500">
            <div className="mb-10 pb-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h4 className="text-3xl font-black text-slate-800">{workout.sessions[activeSessionIdx].dayName}</h4>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Foco do Dia: <span className="text-slate-800">{workout.sessions[activeSessionIdx].focus}</span></p>
                    </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 rounded-3xl border border-slate-100 flex items-center gap-4">
                   <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Exercícios</p>
                      <p className="text-xl font-black text-slate-800">{workout.sessions[activeSessionIdx].exercises.length}</p>
                   </div>
                   <div className="w-px h-8 bg-slate-200"></div>
                   <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Tempo Est.</p>
                      <p className="text-xl font-black text-slate-800">45'</p>
                   </div>
                </div>
            </div>

            <div className="space-y-6">
              {workout.sessions[activeSessionIdx].exercises.map((ex, i) => (
                <div 
                  key={i} 
                  onClick={() => isWorkoutActive && setCurrentExerciseIdx(i)}
                  className={`group relative flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2rem] border transition-all cursor-pointer ${
                    isWorkoutActive && currentExerciseIdx === i 
                    ? 'bg-emerald-50 border-emerald-200 shadow-xl shadow-emerald-600/5' 
                    : 'bg-white border-slate-100 hover:border-emerald-100'
                  }`}
                >
                  <div className="flex items-center gap-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 transition-all ${
                       isWorkoutActive && currentExerciseIdx === i 
                       ? 'bg-emerald-600 text-white shadow-lg' 
                       : 'bg-slate-50 text-slate-300 border border-slate-100'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <h5 className={`text-xl font-black transition-colors ${isWorkoutActive && currentExerciseIdx === i ? 'text-slate-900' : 'text-slate-600'}`}>
                        {ex.name}
                      </h5>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <Timer size={14} className="text-emerald-500" /> {ex.rest} descanso
                        </span>
                        {isWorkoutActive && currentExerciseIdx === i && (
                          <span className="flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                            Em Execução
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-10 mt-6 md:mt-0 bg-slate-50 md:bg-transparent p-6 md:p-0 rounded-[1.5rem] md:rounded-none">
                    <div className="text-center min-w-[70px]">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Séries</p>
                      <p className={`text-3xl font-black ${isWorkoutActive && currentExerciseIdx === i ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {ex.sets}
                      </p>
                    </div>
                    <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                    <div className="text-center min-w-[70px]">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Reps</p>
                      <p className={`text-3xl font-black ${isWorkoutActive && currentExerciseIdx === i ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {ex.reps}
                      </p>
                    </div>
                    {isWorkoutActive && currentExerciseIdx === i && (
                       <button className="hidden md:flex w-12 h-12 bg-emerald-600 text-white rounded-2xl items-center justify-center shadow-lg animate-pulse">
                          <CheckCircle2 size={24} />
                       </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isWorkoutActive && (
              <div className="mt-12 flex justify-center">
                <button 
                  onClick={() => setIsWorkoutActive(false)}
                  className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl"
                >
                  Finalizar Treino Completo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutGenerator;
