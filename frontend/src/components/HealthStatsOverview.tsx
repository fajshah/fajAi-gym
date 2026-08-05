'use client';

import React from 'react';
import { HeartPulse, Moon, Droplets, Flame, Cpu, Zap, Activity, Award } from 'lucide-react';

export const HealthStatsOverview: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Top Vitality Summary Bar */}
      <div className="glass-panel-glow p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-emerald-950/20 to-slate-900/90">
        
        {/* Left: Overall Vitality Radial Meter */}
        <div className="flex items-center space-x-5">
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            {/* SVG Ring Progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 stroke-current"
                strokeDasharray="92, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-slate-100">92</span>
              <span className="text-[9px] text-emerald-400 font-bold uppercase">Vitality</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-100">Optimal Recovery Status</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-400" /> Peak State
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Smartwatch autonomic balance is <strong className="text-emerald-400 font-medium">92% primed</strong> for high performance & cognitive endurance today.
            </p>
          </div>
        </div>

        {/* Right: Quick Action Badges */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400">RHR Baseline</div>
              <div className="font-bold text-slate-100">54 bpm</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400">CGM Glucose</div>
              <div className="font-bold text-slate-100">98 mg/dL</div>
            </div>
          </div>
        </div>

      </div>

      {/* Grid of 4 Key Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* HRV & Recovery Widget */}
        <div className="glass-panel-glow p-4 border border-emerald-500/20 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Heart Rate Var.</span>
            <HeartPulse className="w-5 h-5 text-emerald-400 animate-heart-beat" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-100">68</span>
            <span className="text-xs text-emerald-400 font-bold">ms (Optimal)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-emerald-400" /> Synced via Apple Watch
          </div>
        </div>

        {/* Sleep Architecture Widget */}
        <div className="glass-panel-glow p-4 border border-teal-500/20 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sleep Quality</span>
            <Moon className="w-5 h-5 text-teal-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-100">7.6</span>
            <span className="text-xs text-teal-400 font-bold">hrs (89% score)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-teal-400" /> 105m Deep Sleep
          </div>
        </div>

        {/* Hydration Goal Widget */}
        <div className="glass-panel-glow p-4 border border-cyan-500/20 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hydration Target</span>
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-100">2.5</span>
            <span className="text-xs text-cyan-400 font-bold">Liters / day</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>

        {/* Activity Burn Widget */}
        <div className="glass-panel-glow p-4 border border-amber-500/20 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Burn</span>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-100">580</span>
            <span className="text-xs text-amber-400 font-bold">kcal (10.4k steps)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-amber-400" /> Garmin Forerunner
          </div>
        </div>
      </div>
    </div>
  );
};
