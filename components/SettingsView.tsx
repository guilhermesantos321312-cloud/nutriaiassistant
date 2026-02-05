
import React, { useState } from 'react';
import { Settings, Bell, Shield, Sliders, Save, Info, BellOff, Lock, X, Loader2 } from 'lucide-react';
import { DailyGoal, Notification } from '../types';

interface SettingsViewProps {
  goal: DailyGoal;
  onUpdateGoal: (goal: DailyGoal) => void;
  onNotify: (title: string, message: string, type: Notification['type']) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ goal, onUpdateGoal, onNotify }) => {
  const [tempGoal, setTempGoal] = useState<DailyGoal>(goal);
  const [notifications, setNotifications] = useState(true);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleSave = () => {
    onUpdateGoal(tempGoal);
    onNotify("Configurações Salvas", "Suas metas e preferências foram atualizadas com sucesso.", "info");
  };

  const handlePassChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.new !== passForm.confirm) {
      onNotify("Erro", "As novas senhas não coincidem.", "info");
      return;
    }
    
    setIsChangingPass(true);
    // Simulação de alteração de senha
    setTimeout(() => {
      setIsChangingPass(false);
      setShowPassModal(false);
      setPassForm({ current: '', new: '', confirm: '' });
      onNotify("Segurança", "Sua senha foi alterada com sucesso.", "info");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
            <Sliders size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Configurações Gerais</h2>
            <p className="text-slate-400 text-sm font-medium">Personalize sua experiência no NutiAI</p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Metas Nutricionais */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-lg font-bold text-slate-800">Metas Nutricionais Base</h3>
              <div className="group relative">
                <Info size={14} className="text-slate-300" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  Estas são as metas usadas quando nenhuma dieta da biblioteca está ativa.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Calorias Diárias (kcal)</label>
                <input 
                  type="number" 
                  value={tempGoal.calories}
                  onChange={e => setTempGoal({...tempGoal, calories: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Proteínas (g)</label>
                <input 
                  type="number" 
                  value={tempGoal.protein}
                  onChange={e => setTempGoal({...tempGoal, protein: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Carboidratos (g)</label>
                <input 
                  type="number" 
                  value={tempGoal.carbs}
                  onChange={e => setTempGoal({...tempGoal, carbs: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Gorduras (g)</label>
                <input 
                  type="number" 
                  value={tempGoal.fats}
                  onChange={e => setTempGoal({...tempGoal, fats: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </section>

          {/* Notificações */}
          <section className="pt-8 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Notificações e Alertas</h3>
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${notifications ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                  {notifications ? <Bell size={24} /> : <BellOff size={24} />}
                </div>
                <div>
                  <p className="font-bold text-slate-700">Alertas de Refeição</p>
                  <p className="text-xs text-slate-400">Receba notificações ao adicionar ou remover itens.</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full relative transition-colors ${notifications ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </section>

          {/* Segurança */}
          <section className="pt-8 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Segurança</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setShowPassModal(true)}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-sm font-bold text-slate-600">Alterar Senha de Acesso</span>
                </div>
                <Lock size={14} className="text-slate-300" />
              </button>
            </div>
          </section>

          {/* Botão Salvar */}
          <div className="pt-8 flex justify-end">
            <button 
              onClick={handleSave}
              className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2"
            >
              <Save size={18} /> Salvar Alterações
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Alteração de Senha */}
      {showPassModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !isChangingPass && setShowPassModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Alterar Senha</h3>
              </div>
              {!isChangingPass && (
                <button onClick={() => setShowPassModal(false)} className="text-slate-300 hover:text-slate-500">
                  <X size={20} />
                </button>
              )}
            </div>
            <form onSubmit={handlePassChange} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Senha Atual</label>
                <input 
                  type="password" 
                  required
                  value={passForm.current}
                  onChange={e => setPassForm({...passForm, current: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nova Senha</label>
                <input 
                  type="password" 
                  required
                  value={passForm.new}
                  onChange={e => setPassForm({...passForm, new: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Confirmar Nova Senha</label>
                <input 
                  type="password" 
                  required
                  value={passForm.confirm}
                  onChange={e => setPassForm({...passForm, confirm: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Repita a nova senha"
                />
              </div>
              <button 
                type="submit"
                disabled={isChangingPass}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isChangingPass ? <Loader2 className="animate-spin" size={18} /> : 'Confirmar Alteração'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
