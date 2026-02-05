
import React, { useState } from 'react';
import SavedDiets from './SavedDiets';
import SavedWorkouts from './SavedWorkouts';
import { SavedDiet, SavedWorkout, Meal } from '../types';
import { Utensils, Dumbbell } from 'lucide-react';

interface LibraryManagerProps {
  savedDiets: SavedDiet[];
  savedWorkouts: SavedWorkout[];
  activeDietId: string | null;
  onSetActiveDiet: (id: string) => void;
  onAddMeal: (meal: Omit<Meal, 'id' | 'date'>) => void;
  onRemoveMeal: (mealInfo: { name: string, calories: number, type: Meal['type'] }) => void;
  todayMeals: Meal[];
  onDeleteDiet: (id: string) => void;
  onDeleteWorkout: (id: string) => void;
}

const LibraryManager: React.FC<LibraryManagerProps> = ({ 
  savedDiets, 
  savedWorkouts, 
  activeDietId, 
  onSetActiveDiet, 
  onAddMeal,
  onRemoveMeal,
  todayMeals,
  onDeleteDiet,
  onDeleteWorkout
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'diets' | 'workouts'>('diets');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-center">
        <div className="bg-slate-200/50 p-1.5 rounded-2xl flex items-center shadow-sm">
          <button 
            onClick={() => setActiveSubTab('diets')}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 uppercase tracking-wider ${
              activeSubTab === 'diets' 
              ? 'bg-white text-emerald-600 shadow-md' 
              : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Utensils size={16} /> 
            <span>Dietas</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeSubTab === 'diets' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-300/50 text-slate-500'}`}>
              {savedDiets.length}/10
            </span>
          </button>
          <button 
            onClick={() => setActiveSubTab('workouts')}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 uppercase tracking-wider ${
              activeSubTab === 'workouts' 
              ? 'bg-white text-emerald-600 shadow-md' 
              : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Dumbbell size={16} /> 
            <span>Treinos</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeSubTab === 'workouts' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-300/50 text-slate-500'}`}>
              {savedWorkouts.length}/10
            </span>
          </button>
        </div>
      </div>

      {activeSubTab === 'diets' ? (
        <SavedDiets 
          diets={savedDiets} 
          activeId={activeDietId} 
          onSetActive={onSetActiveDiet} 
          onAddMeal={onAddMeal} 
          onRemoveMeal={onRemoveMeal}
          todayMeals={todayMeals}
          onDelete={onDeleteDiet} 
        />
      ) : (
        <SavedWorkouts 
          workouts={savedWorkouts} 
          onDelete={onDeleteWorkout} 
        />
      )}
    </div>
  );
};

export default LibraryManager;
