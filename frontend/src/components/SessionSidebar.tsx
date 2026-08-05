'use client';

import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, History, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface SessionItem {
  session_id: string;
  title: string;
  created_at: number;
  updated_at: number;
}

interface SessionSidebarProps {
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  activeSessionId,
  onSelectSession,
  onNewSession,
}) => {
  const { idToken } = useAuth();
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/sessions`, {
        headers: {
          'Authorization': `Bearer ${idToken || 'mock_token'}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.warn("Could not fetch user sessions:", e);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [idToken, activeSessionId]);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col h-[650px]">
      <button
        onClick={onNewSession}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-md mb-4"
      >
        <Plus className="w-4 h-4" />
        <span>New Consultation</span>
      </button>

      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
        <History className="w-3.5 h-3.5 text-emerald-400" />
        <span>Consultation History</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No past sessions saved.<br />Start a consultation!
          </div>
        ) : (
          sessions.map((s) => {
            const isActive = s.session_id === activeSessionId;
            return (
              <button
                key={s.session_id}
                onClick={() => onSelectSession(s.session_id)}
                className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start space-x-2.5 ${
                  isActive
                    ? 'bg-slate-800 border border-emerald-500/40 text-slate-100 font-semibold shadow-sm'
                    : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <MessageSquare className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div className="truncate">
                  <div className="truncate font-medium">{s.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {new Date(s.updated_at * 1000).toLocaleDateString()}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
