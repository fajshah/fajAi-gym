'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw, Mic, Volume2, ShieldCheck, HeartPulse } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { HealthMetricsState } from './MetricsForm';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface WellnessChatProps {
  sessionId: string | null;
  metrics: HealthMetricsState;
  onSessionCreated?: (newSessionId: string) => void;
}

const CATEGORY_PROMPTS = [
  { category: '🩺 Post-Op & Medical', prompt: 'I have an operation, tell me when can I safely start exercising?' },
  { category: '🌙 HRV & REM Sleep', prompt: 'How can I optimize my HRV & REM sleep stage tonight?' },
  { category: '💧 Hydration Plan', prompt: 'Suggest a 24-hour hydration & electrolyte plan for my activity level.' },
  { category: '🏋️ Workout Recovery', prompt: 'What is the best post-workout recovery routine for my age & heart rate?' },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const WellnessChat: React.FC<WellnessChatProps> = ({
  sessionId,
  metrics,
  onSessionCreated,
}) => {
  const { idToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessionId);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveSessionId(sessionId);
    if (sessionId) {
      fetchHistory(sessionId);
    } else {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: '👋 Hello! I am your FAJAI AI Health & Wellness Coach. Synced with your smartwatch HRV telemetry, sleep stages, and personal metrics. How can I assist your health and recovery journey today?',
          timestamp: Date.now(),
        },
      ]);
    }
  }, [sessionId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const fetchHistory = async (sid: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/sessions/${sid}/messages`, {
        headers: {
          'Authorization': `Bearer ${idToken || 'mock_token'}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setMessages(data.map((m: any) => ({
            id: m.message_id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp * 1000
          })));
        }
      }
    } catch (e) {
      console.warn("Could not fetch chat history from backend:", e);
    }
  };

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsStreaming(true);

    const assistantMsgId = String(Date.now() + 1);
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: 'assistant', content: '', timestamp: Date.now() },
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/coach/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken || 'mock_token'}`,
        },
        body: JSON.stringify({
          prompt: promptText,
          session_id: activeSessionId,
          metrics: metrics,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.body) throw new Error('No readable stream available');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const token = line.replace('data: ', '');
            streamedContent += token;
            
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: streamedContent }
                  : msg
              )
            );
          }
        }
      }
    } catch (err: any) {
      console.error('SSE Stream Error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  msg.content +
                  `\n\n[Note: Unable to reach FastAPI backend streaming endpoint. Operating in fallback mode.]`,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="glass-panel flex flex-col h-[680px] rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl relative">
      
      {/* Chat Window Header */}
      <div className="px-5 py-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              FAJAI AI Health Coach
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live SSE Engine
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Smartwatch Synced • Non-diagnostic medical guardrails</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`p-2 rounded-xl border text-xs transition-all flex items-center gap-1 ${
              isVoiceActive
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Voice mode"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{isVoiceActive ? 'Voice ON' : 'Voice'}</span>
          </button>

          <button
            onClick={() => setMessages([])}
            className="text-slate-400 hover:text-slate-200 text-xs p-2 rounded-xl bg-slate-800/80 border border-slate-700 transition-colors"
            title="Clear chat window"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4.5 h-4.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] px-4 py-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold rounded-tr-none shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/95 border border-slate-800 text-slate-100 rounded-tl-none whitespace-pre-wrap shadow-md'
              }`}
            >
              {msg.content ? (
                msg.content
              ) : (
                <div className="flex items-center space-x-2 text-slate-400 py-1">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span className="text-xs">FAJAI is analyzing smartwatch telemetry & streaming advice...</span>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4.5 h-4.5" />
              </div>
            )}
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        {CATEGORY_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(item.prompt)}
            disabled={isStreaming}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 border border-slate-700/80 transition-all duration-150 flex items-center gap-1.5"
          >
            <span>{item.category}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(inputPrompt);
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask FAJAI about post-surgery exercise, HRV recovery, sleep, or hydration..."
          disabled={isStreaming}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isStreaming}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all flex items-center justify-center shadow-lg shadow-emerald-500/20"
        >
          {isStreaming ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};
