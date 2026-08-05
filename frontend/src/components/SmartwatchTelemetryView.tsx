'use client';

import React from 'react';
import { Cpu, HeartPulse, Moon, Flame, Zap, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

export const SmartwatchTelemetryView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Device Connection Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 glow-emerald">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Model Context Protocol (MCP) Wearable Hub
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Active Telemetry
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Synced with Apple Watch Series 9, Oura Ring Gen3, Garmin Forerunner, & Dexcom G7 CGM
            </p>
          </div>
        </div>

        <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center space-x-2">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sync Now (MCP Bridge)</span>
        </button>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* HRV Card */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">HRV Recovery</span>
            <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">68</span>
            <span className="text-xs text-emerald-400 font-bold">ms (Optimal)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Parasympathetic nervous system recovery is prime for training.
          </p>
        </div>

        {/* Sleep Stages Card */}
        <div className="glass-panel p-5 rounded-2xl border border-teal-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Sleep Architecture</span>
            <Moon className="w-5 h-5 text-teal-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">7.6</span>
            <span className="text-xs text-teal-400 font-bold">hrs (105m Deep)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            REM duration: 92 mins • Sleep Efficiency: 89%
          </p>
        </div>

        {/* Calories & Active Burn Card */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Energy</span>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">580</span>
            <span className="text-xs text-amber-400 font-bold">kcal (10.4k steps)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Exercise minutes: 45 mins • Floors climbed: 12
          </p>
        </div>

        {/* Dexcom CGM Glucose Card */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Continuous Glucose</span>
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">98</span>
            <span className="text-xs text-cyan-400 font-bold">mg/dL (Stable)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Time in Range: 94% • Variability: 14%
          </p>
        </div>
      </div>
    </div>
  );
};
