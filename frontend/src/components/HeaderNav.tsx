'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, User, LogOut, MessageSquare, Calendar, Cpu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export type DashboardTab = 'coach' | 'history' | 'smartwatch';

interface HeaderNavProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenAuthModal: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const HeaderNav: React.FC<HeaderNavProps> = ({ activeTab, onSelectTab, onOpenAuthModal }) => {
  const { user, logout } = useAuth();
  const [apiOnline, setApiOnline] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => setApiOnline(res.ok))
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <header className="w-full glass-panel border-b border-emerald-500/20 px-6 py-3.5 flex flex-wrap items-center justify-between sticky top-0 z-40 backdrop-blur-md gap-4">
      {/* Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center">
          <Activity className="w-6 h-6 text-slate-950 font-bold" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            FAJAI <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">Gemini 2.5</span>
          </h1>
          <p className="text-[11px] text-slate-400">Agentic Health & Daily History Platform</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => onSelectTab('coach')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'coach'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>FAJAI AI Coach</span>
        </button>

        <button
          onClick={() => onSelectTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daily Health History</span>
        </button>

        <button
          onClick={() => onSelectTab('smartwatch')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'smartwatch'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Smartwatch MCP</span>
        </button>
      </div>

      {/* Status & Auth Actions */}
      <div className="flex items-center space-x-3">
        {/* Backend Status Badge */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-slate-300 font-medium">
            {apiOnline ? 'FastAPI Active' : 'Dev Mode'}
          </span>
        </div>

        {/* User Auth Info */}
        {user ? (
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-emerald-500/30 rounded-xl px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
              {user.email ? user.email[0].toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <span className="text-xs font-medium text-slate-200 hidden md:inline">
              {user.displayName || user.email?.split('@')[0]}
            </span>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-400 transition-colors p-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs transition-all duration-200 shadow-md shadow-emerald-500/20 flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
