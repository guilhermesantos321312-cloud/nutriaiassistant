
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { SavedDiet, Meal, MealDetail } from '../types';
import { Trash2, CheckCircle2, Circle, Clock, ChevronRight, PlusCircle, Calendar, Download } from 'lucide-react';

interface SavedDietsProps {
  diets: SavedDiet[];
  activeId: string | null;
  onSetActive: (id: string) => void;
  onAddMeal: (meal: Omit<Meal, 'id' | 'date'>) => void;
  onRemoveMeal: (mealInfo: { name: string, calories: number, type: Meal['type'] }) => void;
  todayMeals: Meal[];
  onDelete: (id: string) => void;
}

const SavedDiets: React.FC<SavedDietsProps> = ({ diets, activeId, onSetActive, onAddMeal, onRemoveMeal, todayMeals, onDelete }) => {
  const [expandedDiet, setExpandedDiet] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);

  if (diets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="p-6 bg-slate-100 rounded-full mb-6">
          <Calendar size={48} />
        </div>
        <p className="text-lg font-medium">Sua biblioteca está vazia.</p>
        <p className="text-sm">Gere um plano de 7 dias no Gerador para salvá-lo aqui.</p>
      </div>
    );
  }

  const isAlreadyLogged = (detail: MealDetail, type: Meal['type']) => {
    const name = detail.description.split('.')[0];
    return todayMeals.some(m => 
      m.name === name && 
      m.calories === detail.calories && 
      m.type === type
    );
  };

  const logMealItem = (detail: MealDetail, type: Meal['type']) => {
    const name = detail.description.split('.')[0];
    if (isAlreadyLogged(detail, type)) {
      onRemoveMeal({ name, calories: detail.calories, type });
    } else {
      onAddMeal({
        name,
        calories: detail.calories,
        protein: detail.protein,
        carbs: detail.carbs,
        fats: detail.fats,
        type
      });
    }
  };

  const handleExportPDF = (diet: SavedDiet) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text('NutiAI - Plano Alimentar', margin, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`${diet.name} | Gerado em: ${new Date(diet.createdAt).toLocaleDateString()}`, margin, y);
    
    y += 15;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, 190, y);
    
    y += 15;
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Metas Diárias:', margin, y);
    
    y += 10;
    doc.setFontSize(11);
    doc.text(`Calorias: ${diet.targets.calories} kcal`, margin, y);
    doc.text(`Proteinas: ${diet.targets.protein}g`, margin + 60, y);
    doc.text(`Carbos: ${diet.targets.carbs}g`, margin + 100, y);
    doc.text(`Gorduras: ${diet.targets.fats}g`, margin + 140, y);
    
    y += 15;
    
    diet.days.forEach((day) => {
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

    doc.save(`${diet.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {diets.map((diet) => (
        <div 
          key={diet.id}
          className={`bg-white rounded-[1.5rem] border transition-all overflow-hidden relative group ${
            activeId === diet.id ? 'border-emerald-500 shadow-xl' : 'border-slate-100 shadow-sm'
          }`}
        >
          {activeId === diet.id && (
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
              Ativa no Painel
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{diet.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> Salva em {new Date(diet.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onSetActive(diet.id)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
                    activeId === diet.id 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  {activeId === diet.id ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  Ativar
                </button>
                <button 
                  onClick={() => handleExportPDF(diet)}
                  className="p-3 bg-white text-slate-500 rounded-xl hover:bg-slate-50 border border-slate-200 transition-all shadow-sm"
                >
                  <Download size={20} />
                </button>
                <button 
                  onClick={() => setExpandedDiet(expandedDiet === diet.id ? null : diet.id)}
                  className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 border border-slate-100"
                >
                  <ChevronRight className={`transition-transform ${expandedDiet === diet.id ? 'rotate-90' : ''}`} size={20} />
                </button>
                <button onClick={() => onDelete(diet.id)} className="p-3 text-slate-300 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase">Kcal</p>
                <p className="text-lg font-black text-slate-700">{diet.targets.calories}</p>
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-xl text-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase">P</p>
                <p className="text-lg font-black text-emerald-600">{diet.targets.protein}g</p>
              </div>
              <div className="bg-blue-50/50 p-3 rounded-xl text-center">
                <p className="text-[10px] font-black text-blue-600 uppercase">C</p>
                <p className="text-lg font-black text-blue-600">{diet.targets.carbs}g</p>
              </div>
              <div className="bg-amber-50/50 p-3 rounded-xl text-center">
                <p className="text-[10px] font-black text-amber-600 uppercase">G</p>
                <p className="text-lg font-black text-amber-600">{diet.targets.fats}g</p>
              </div>
            </div>
          </div>

          <div className={`${expandedDiet === diet.id ? 'block' : 'hidden'} border-t border-slate-100 bg-slate-50/30 p-8`}>
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-500" /> Cardápio da Semana
            </h4>
            
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {diet.days.map((day, dIdx) => (
                <button 
                  key={dIdx}
                  onClick={() => setSelectedDay(dIdx)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedDay === dIdx ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100 hover:border-emerald-200'
                  }`}
                >
                  {day.dayName}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {diet.days.map((day, dIdx) => (
                <div key={dIdx} className={`${selectedDay === dIdx ? 'block' : 'hidden'} space-y-4`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MealItem detail={day.breakfast} label="Café" onAdd={() => logMealItem(day.breakfast, 'breakfast')} isLogged={isAlreadyLogged(day.breakfast, 'breakfast')} />
                    <MealItem detail={day.snack} label="Lanche" onAdd={() => logMealItem(day.snack, 'snack')} isLogged={isAlreadyLogged(day.snack, 'snack')} />
                    <MealItem detail={day.lunch} label="Almoço" onAdd={() => logMealItem(day.lunch, 'lunch')} isLogged={isAlreadyLogged(day.lunch, 'lunch')} />
                    <MealItem detail={day.dinner} label="Jantar" onAdd={() => logMealItem(day.dinner, 'dinner')} isLogged={isAlreadyLogged(day.dinner, 'dinner')} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MealItem = ({ detail, label, onAdd, isLogged }: { detail: MealDetail, label: string, onAdd: () => void, isLogged: boolean }) => (
  <div className={`p-4 rounded-xl border flex justify-between gap-4 shadow-sm transition-all ${isLogged ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-100'}`}>
    <div className="flex-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-slate-700 font-medium">{detail.description}</p>
      <div className="flex gap-2 mt-2 opacity-60">
        <span className="text-[9px] font-bold">KCAL: {detail.calories}</span>
        <span className="text-[9px] font-bold">P: {detail.protein}g</span>
        <span className="text-[9px] font-bold">C: {detail.carbs}g</span>
      </div>
    </div>
    <button 
      onClick={onAdd} 
      className={`p-2 h-fit rounded-lg transition-all ${
        isLogged 
        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
      }`}
    >
      {isLogged ? <CheckCircle2 size={18} /> : <PlusCircle size={18} />}
    </button>
  </div>
);

export default SavedDiets;
