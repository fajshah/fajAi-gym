'use client';

import React, { useState } from 'react';
import { Sliders, CheckCircle, Sparkles } from 'lucide-react';

export interface HealthMetricsState {
  age: number;
  activity_level: string;
  daily_water_ml: number;
  sleep_hours: number;
  goals: string[];
}

interface MetricsFormProps {
  metrics: HealthMetricsState;
  onChange: (updated: HealthMetricsState) => void;
}

const GOAL_OPTIONS = [
  { id: 'stress_reduction', label: '🧘 Stress Reduction' },
  { id: 'rem_sleep', label: '🌙 Deep REM Sleep' },
  { id: 'weight_management', label: '⚖️ Weight Management' },
  { id: 'energy_boost', label: '⚡ All-day Energy' },
  { id: 'cardio_endurance', label: '🏃 Cardio Endurance' },
];

export const MetricsForm: React.FC<MetricsFormProps> = ({ metrics, onChange }) => {
  const toggleGoal = (goalId: string) => {
    const current = [...metrics.goals];
    const index = current.indexOf(goalId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(goalId);
    }
    onChange({ ...metrics, goals: current });
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" /> User Profile & Baseline
        </h3>
        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Autosynced
        </span>
      </div>

      {/* Age & Activity Level */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Age (Years)</label>
          <input
            type="number"
            value={metrics.age}
            onChange={(e) => onChange({ ...metrics, age: parseInt(e.target.value) || 25 })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Activity Level</label>
          <select
            value={metrics.activity_level}
            onChange={(e) => onChange({ ...metrics, activity_level: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="sedentary">Sedentary</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="intense">Athlete / Intense</option>
          </select>
        </div>
      </div>

      {/* Sleep Slider */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Daily Sleep Target</span>
          <span className="text-emerald-400 font-bold">{metrics.sleep_hours} hrs</span>
        </div>
        <input
          type="range"
          min="4"
          max="12"
          step="0.5"
          value={metrics.sleep_hours}
          onChange={(e) => onChange({ ...metrics, sleep_hours: parseFloat(e.target.value) })}
          className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
        />
      </div>

      {/* Hydration Slider */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Water Intake</span>
          <span className="text-cyan-400 font-bold">{metrics.daily_water_ml} mL</span>
        </div>
        <input
          type="range"
          min="1000"
          max="5000"
          step="250"
          value={metrics.daily_water_ml}
          onChange={(e) => onChange({ ...metrics, daily_water_ml: parseFloat(e.target.value) })}
          className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
        />
      </div>

      {/* Goal Tags */}
      <div>
        <label className="text-xs text-slate-400 block mb-2">Active Wellness Focus</label>
        <div className="flex flex-wrap gap-1.5">
          {GOAL_OPTIONS.map((g) => {
            const active = metrics.goals.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGoal(g.id)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-150 ${
                  active
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
