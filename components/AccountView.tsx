
import React, { useState } from 'react';
import { User, Mail, CreditCard, ShieldCheck, Utensils, Dumbbell, Calendar, ArrowRight, Save, X } from 'lucide-react';

interface AccountViewProps {
  user: { name: string; email: string };
  onUpdateUser: (userData: { name: string; email: string }) => void;
  stats: { diets: number; workouts: number };
}

const AccountView: React.FC<AccountViewProps> = ({ user, onUpdateUser, stats }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  const handleSave = () => {
    onUpdateUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Perfil Header */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <img 
            src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff&size=128`} 
            alt="Avatar" 
            className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-xl" 
          />
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black text-slate-800">{user.name}</h2>
            <p className="text-slate-400 font-medium mb-4">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Plano Vitalício
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-emerald-100 transition-all">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Utensils size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dietas Salvas</p>
            <p className="text-3xl font-black text-slate-800">{stats.diets}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-blue-100 transition-all">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Dumbbell size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Treinos Salvos</p>
            <p className="text-3xl font-black text-slate-800">{stats.workouts}</p>
          </div>
        </div>
      </div>

      {/* Detalhes da Conta */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Detalhes do Perfil</h3>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:translate-x-1 transition-transform"
            >
              Editar Informações <ArrowRight size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-3">
               <button 
                onClick={handleCancel}
                className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
              >
                <X size={16} /> Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
              >
                <Save size={16} /> Salvar
              </button>
            </div>
          )}
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome de Exibição</label>
              {isEditing ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 animate-in fade-in duration-300">
                  <User size={18} className="text-emerald-500" />
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="bg-transparent border-none outline-none font-bold text-slate-700 w-full"
                    placeholder="Seu nome"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <User size={18} className="text-slate-400" />
                  <span className="font-bold text-slate-700">{user.name}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Endereço de Email</label>
              {isEditing ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 animate-in fade-in duration-300">
                  <Mail size={18} className="text-emerald-500" />
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="bg-transparent border-none outline-none font-bold text-slate-700 w-full"
                    placeholder="seu@email.com"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Mail size={18} className="text-slate-400" />
                  <span className="font-bold text-slate-700">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagamento */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
            <CreditCard size={28} />
          </div>
          <div>
            <p className="text-sm font-bold">Gerenciar Assinatura</p>
            <p className="text-xs text-slate-400">Plano Vitalício de R$ 10 Ativado</p>
          </div>
        </div>
        <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">
          Ver Comprovante
        </button>
      </div>
    </div>
  );
};

export default AccountView;
