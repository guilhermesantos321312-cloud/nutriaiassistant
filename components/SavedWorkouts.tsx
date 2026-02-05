
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { SavedWorkout } from '../types';
import { Trash2, Clock, ChevronRight, Download, Dumbbell, Target } from 'lucide-react';

interface SavedWorkoutsProps {
  workouts: SavedWorkout[];
  onDelete: (id: string) => void;
}

const SavedWorkouts: React.FC<SavedWorkoutsProps> = ({ workouts, onDelete }) => {
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<number>(0);

  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="p-6 bg-slate-100 rounded-full mb-6">
          <Dumbbell size={48} />
        </div>
        <p className="text-lg font-medium">Nenhum treino salvo.</p>
        <p className="text-sm">Gere um treino completo para salvá-lo aqui.</p>
      </div>
    );
  }

  const handleExportPDF = (workout: SavedWorkout) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text('NutiAI - Seu Treino Inteligente', margin, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`${workout.name} | Gerado em: ${new Date(workout.createdAt).toLocaleDateString()}`, margin, y);
    
    y += 15;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, 190, y);
    
    workout.sessions.forEach((session) => {
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

    doc.save(`${workout.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {workouts.map((workout) => (
        <div 
          key={workout.id}
          className="bg-white rounded-[1.5rem] border border-slate-100 transition-all overflow-hidden relative shadow-sm"
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{workout.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> Salvo em {new Date(workout.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleExportPDF(workout)}
                  className="p-3 bg-white text-slate-500 rounded-xl hover:bg-slate-50 border border-slate-200 transition-all shadow-sm"
                >
                  <Download size={20} />
                </button>
                <button 
                  onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                  className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 border border-slate-100"
                >
                  <ChevronRight className={`transition-transform ${expandedWorkout === workout.id ? 'rotate-90' : ''}`} size={20} />
                </button>
                <button onClick={() => onDelete(workout.id)} className="p-3 text-slate-300 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <Target size={14} /> {workout.goal}
              </div>
              <div className="bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-xs font-bold">
                {workout.sessions.length} Treinos / Semana
              </div>
            </div>
          </div>

          <div className={`${expandedWorkout === workout.id ? 'block' : 'hidden'} border-t border-slate-100 bg-slate-50/30 p-8`}>
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {workout.sessions.map((session, sIdx) => (
                <button 
                  key={sIdx}
                  onClick={() => setSelectedSession(sIdx)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedSession === sIdx ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'
                  }`}
                >
                  {session.dayName}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <h5 className="font-bold text-slate-700 flex items-center gap-2">
                Foco: <span className="text-emerald-600">{workout.sessions[selectedSession].focus}</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workout.sessions[selectedSession].exercises.map((ex, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <p className="font-bold text-slate-800 text-sm">{ex.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      {ex.sets} séries x {ex.reps} | Descanso: {ex.rest}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedWorkouts;
