
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Meal, DailyGoal } from '../types';
import { Target, Zap, Flame } from 'lucide-react';

interface DashboardProps {
  meals: Meal[];
  goal: DailyGoal;
}

const Dashboard: React.FC<DashboardProps> = ({ meals, goal }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === today);

  const totals = todayMeals.reduce((acc, curr) => ({
    calories: acc.calories + curr.calories,
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fats: acc.fats + curr.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const macroData = [
    { name: 'Proteínas', value: totals.protein, color: '#10b981' },
    { name: 'Carbos', value: totals.carbs, color: '#3b82f6' },
    { name: 'Gorduras', value: totals.fats, color: '#f59e0b' },
  ];

  const calPercentage = Math.min(Math.round((totals.calories / goal.calories) * 100), 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Flame size={24} /></div>
          <div>
            <p className="text-sm text-slate-500">Calorias</p>
            <p className="text-xl font-bold">{totals.calories} / {goal.calories}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Zap size={24} /></div>
          <div>
            <p className="text-sm text-slate-500">Proteínas</p>
            <p className="text-xl font-bold">{totals.protein}g / {goal.protein}g</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Target size={24} /></div>
          <div>
            <p className="text-sm text-slate-500">Carbos</p>
            <p className="text-xl font-bold">{totals.carbs}g / {goal.carbs}g</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Flame size={24} className="rotate-180" /></div>
          <div>
            <p className="text-sm text-slate-500">Gorduras</p>
            <p className="text-xl font-bold">{totals.fats}g / {goal.fats}g</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">Progresso Diário</h2>
              <div className="text-sm text-slate-500">Hoje, {new Date().toLocaleDateString('pt-BR')}</div>
            </div>
            
            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-12">
              <div 
                className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${calPercentage}%` }}
              />
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macroData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Balanço Nutricional</h2>
          <div className="h-[300px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {macroData.map(m => (
              <div key={m.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-sm text-slate-600">{m.name}</span>
                </div>
                <span className="text-sm font-semibold">{m.value}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
