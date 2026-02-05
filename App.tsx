
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Camera, 
  Dumbbell, 
  Apple,
  Library,
  LogOut,
  ChevronDown,
  User,
  Settings,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import MealPlanner from './components/MealPlanner';
import FoodVision from './components/FoodVision';
import WorkoutGenerator from './components/WorkoutGenerator';
import LibraryManager from './components/LibraryManager';
import NotificationSystem from './components/NotificationSystem';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import AccountView from './components/AccountView';
import SettingsView from './components/SettingsView';
import { Meal, DailyGoal, Notification, SavedDiet, SavedWorkout } from './types';

interface UserData {
  name: string;
  email: string;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [showUserPanel, setShowUserPanel] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>({ name: 'Visitante', email: 'convidado@nutiai.com' });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planner' | 'vision' | 'workout' | 'library' | 'account' | 'settings'>('dashboard');
  
  const [meals, setMeals] = useState<Meal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [savedDiets, setSavedDiets] = useState<SavedDiet[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [activeDietId, setActiveDietId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
  const userPanelRef = useRef<HTMLDivElement>(null);

  const [baseGoal, setBaseGoal] = useState<DailyGoal>({
    calories: 2000,
    protein: 140,
    carbs: 220,
    fats: 60
  });

  useEffect(() => {
    const logged = localStorage.getItem('nutiai_auth');
    const savedUser = localStorage.getItem('nutiai_user');
    const savedGoal = localStorage.getItem('nutiai_base_goal');

    if (logged === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    
    if (savedGoal) setBaseGoal(JSON.parse(savedGoal));
    
    const savedM = localStorage.getItem('nutiai_meals');
    if (savedM) setMeals(JSON.parse(savedM));
    
    const diets = localStorage.getItem('nutiai_saved_diets');
    if (diets) setSavedDiets(JSON.parse(diets));

    const workouts = localStorage.getItem('nutiai_saved_workouts');
    if (workouts) setSavedWorkouts(JSON.parse(workouts));

    const activeId = localStorage.getItem('nutiai_active_diet_id');
    if (activeId) setActiveDietId(activeId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userPanelRef.current && !userPanelRef.current.contains(event.target as Node)) {
        setShowUserPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('nutiai_meals', JSON.stringify(meals));
    localStorage.setItem('nutiai_saved_diets', JSON.stringify(savedDiets));
    localStorage.setItem('nutiai_saved_workouts', JSON.stringify(savedWorkouts));
    localStorage.setItem('nutiai_base_goal', JSON.stringify(baseGoal));
    if (activeDietId) localStorage.setItem('nutiai_active_diet_id', activeDietId);
    else localStorage.removeItem('nutiai_active_diet_id');
  }, [meals, savedDiets, savedWorkouts, activeDietId, baseGoal]);

  const todayMeals = useMemo(() => meals.filter(m => m.date === currentDate), [meals, currentDate]);

  const currentGoal = useMemo(() => {
    const activeDiet = savedDiets.find(d => d.id === activeDietId);
    if (activeDiet) return activeDiet.targets;
    return baseGoal;
  }, [activeDietId, savedDiets, baseGoal]);

  const notify = useCallback((title: string, message: string, type: Notification['type']) => {
    const id = Math.random().toString();
    setNotifications(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  }, []);

  const handleLogin = (userData: UserData) => {
    localStorage.setItem('nutiai_auth', 'true');
    localStorage.setItem('nutiai_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('nutiai_auth');
    localStorage.removeItem('nutiai_user');
    setIsAuthenticated(false);
    setShowUserPanel(false);
    setActiveTab('dashboard');
  };

  const updateUserData = (newData: UserData) => {
    setUser(newData);
    localStorage.setItem('nutiai_user', JSON.stringify(newData));
    notify("Perfil Atualizado", "Suas informações foram salvas com sucesso.", "info");
  };

  if (!isAuthenticated) {
    if (showAuth) {
      return <Auth onLogin={handleLogin} onBack={() => setShowAuth(false)} />;
    }
    return <LandingPage onStart={() => setShowAuth(true)} />;
  }

  const addMeal = (meal: Omit<Meal, 'id' | 'date'>) => {
    const newMeal: Meal = {
      ...meal,
      id: Math.random().toString(36).substr(2, 9),
      date: currentDate
    };
    setMeals(prev => [newMeal, ...prev]);
    notify("Refeição Adicionada", `${meal.name} foi registrado no seu diário.`, "meal");
  };

  const removeMeal = (mealInfo: { name: string, calories: number, type: Meal['type'] }) => {
    setMeals(prev => {
      const index = prev.findIndex(m => 
        m.date === currentDate && 
        m.name === mealInfo.name && 
        m.calories === mealInfo.calories && 
        m.type === mealInfo.type
      );
      if (index !== -1) {
        const newMeals = [...prev];
        newMeals.splice(index, 1);
        return newMeals;
      }
      return prev;
    });
    notify("Refeição Removida", `${mealInfo.name} foi removida do diário.`, "info");
  };

  const handleSaveDiet = (diet: Omit<SavedDiet, 'id' | 'createdAt'>) => {
    if (savedDiets.length >= 10) {
      notify("Limite Atingido", "Você atingiu o limite de 10 dietas salvas.", "info");
      return;
    }
    const newDiet: SavedDiet = {
      ...diet,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setSavedDiets(prev => [...prev, newDiet]);
    notify("Dieta Salva", "A dieta foi guardada na sua biblioteca.", "info");
  };

  const handleSaveWorkout = (workout: Omit<SavedWorkout, 'id' | 'createdAt'>) => {
    if (savedWorkouts.length >= 10) {
      notify("Limite Atingido", "Você atingiu o limite de 10 treinos salvos.", "info");
      return;
    }
    const newWorkout: SavedWorkout = {
      ...workout,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setSavedWorkouts(prev => [...prev, newWorkout]);
    notify("Treino Salvo", "O treino foi guardado na sua biblioteca.", "info");
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Painel' },
    { id: 'planner', icon: Utensils, label: 'Gerador' },
    { id: 'library', icon: Library, label: 'Bibliotecas' },
    { id: 'vision', icon: Camera, label: 'Visão' },
    { id: 'workout', icon: Dumbbell, label: 'Treinos' },
  ] as const;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <NotificationSystem 
        notifications={notifications} 
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} 
      />

      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <Apple size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">NutiAI</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-emerald-50 text-emerald-700 font-medium shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
           <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100 mb-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                 <ShieldCheck size={16} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400">Plano Ativo</p>
                 <p className="text-xs font-bold text-emerald-600">Vitalício</p>
              </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-slate-800">
            {activeTab === 'account' ? 'Minha Conta' : activeTab === 'settings' ? 'Configurações' : navItems.find(i => i.id === activeTab)?.label}
          </h1>
          
          <div className="relative" ref={userPanelRef}>
            <button 
              onClick={() => setShowUserPanel(!showUserPanel)}
              className={`flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all border ${
                showUserPanel ? 'bg-slate-100 border-slate-200' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
              }`}
            >
              <div className="relative">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-emerald-100" 
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">Conta Pro</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserPanel ? 'rotate-180' : ''}`} />
            </button>

            {showUserPanel && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="p-6 pb-4 bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} 
                      alt="Avatar Large" 
                      className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" 
                    />
                    <div>
                      <h4 className="font-bold text-slate-800">{user.name}</h4>
                      <p className="text-xs text-slate-400 truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => { setActiveTab('account'); setShowUserPanel(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all text-sm font-medium"
                  >
                    <User size={18} className="text-slate-400" /> Minha Conta
                  </button>
                  <button 
                    onClick={() => { setActiveTab('settings'); setShowUserPanel(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all text-sm font-medium"
                  >
                    <Settings size={18} className="text-slate-400" /> Configurações
                  </button>
                  <div className="h-px bg-slate-100 mx-4 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-bold"
                  >
                    <LogOut size={18} /> Encerrar Sessão
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeTab === 'dashboard' && <Dashboard meals={meals} goal={currentGoal} />}
          {activeTab === 'planner' && <MealPlanner onSaveDiet={handleSaveDiet} />}
          {activeTab === 'library' && (
            <LibraryManager 
              savedDiets={savedDiets}
              savedWorkouts={savedWorkouts}
              activeDietId={activeDietId}
              onSetActiveDiet={setActiveDietId}
              onAddMeal={addMeal}
              onRemoveMeal={removeMeal}
              todayMeals={todayMeals}
              onDeleteDiet={(id) => setSavedDiets(prev => prev.filter(d => d.id !== id))}
              onDeleteWorkout={(id) => setSavedWorkouts(prev => prev.filter(w => w.id !== id))}
            />
          )}
          {activeTab === 'vision' && <FoodVision onAddMeal={addMeal} />}
          {activeTab === 'workout' && <WorkoutGenerator onNotify={notify} onSaveWorkout={handleSaveWorkout} />}
          {activeTab === 'account' && <AccountView user={user} onUpdateUser={updateUserData} stats={{ diets: savedDiets.length, workouts: savedWorkouts.length }} />}
          {activeTab === 'settings' && <SettingsView goal={baseGoal} onUpdateGoal={setBaseGoal} onNotify={notify} />}
        </div>

        <nav className="md:hidden flex items-center justify-around h-16 bg-white border-t border-slate-200 px-2 sticky bottom-0 z-30">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          <button 
            onClick={() => setShowUserPanel(true)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-slate-400"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} alt="Mob" />
            </div>
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default App;
