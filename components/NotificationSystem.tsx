
import React, { useEffect, useState } from 'react';
import { Bell, X, Droplets, Utensils, Zap, Info } from 'lucide-react';
import { Notification } from '../types';

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 w-80 pointer-events-none">
      {notifications.map((n) => (
        <div 
          key={n.id}
          className="pointer-events-auto bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 flex gap-4 animate-in slide-in-from-right-8 duration-300"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            n.type === 'water' ? 'bg-blue-100 text-blue-600' :
            n.type === 'meal' ? 'bg-emerald-100 text-emerald-600' :
            n.type === 'workout' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
          }`}>
            {n.type === 'water' && <Droplets size={24} />}
            {n.type === 'meal' && <Utensils size={24} />}
            {n.type === 'workout' && <Zap size={24} />}
            {n.type === 'info' && <Info size={24} />}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{n.message}</p>
          </div>
          <button 
            onClick={() => onDismiss(n.id)}
            className="text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
