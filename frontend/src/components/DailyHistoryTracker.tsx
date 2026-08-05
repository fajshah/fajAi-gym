'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Save, Activity, Moon, Droplets, HeartPulse, CheckCircle2, Award, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface DailyLogEntry {
  date: string;
  energy_score: number;
  sleep_hours: number;
  water_ml: number;
  hrv_ms: number;
  notes: string;
  workout_done: boolean;
  ai_summary?: string;
}

export const DailyHistoryTracker: React.FC = () => {
  const { idToken } = useAuth();
  const [logs, setLogs] = useState<DailyLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<DailyLogEntry>({
    date: todayStr,
    energy_score: 8,
    sleep_hours: 7.5,
    water_ml: 2500,
    hrv_ms: 68,
    notes: 'Felt great after morning walk and 7.5 hours of sleep.',
    workout_done: true,
  });

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/daily-logs', {
        headers: {
          'Authorization': `Bearer ${idToken || 'mock_token'}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setLogs(data);
        } else {
          setLogs([
            {
              date: todayStr,
              energy_score: 9,
              sleep_hours: 8.0,
              water_ml: 2750,
              hrv_ms: 72,
              notes: 'Strong HRV recovery score. 45 min workout completed.',
              workout_done: true,
            },
            {
              date: '2026-08-04',
              energy_score: 7,
              sleep_hours: 7.0,
              water_ml: 2200,
              hrv_ms: 64,
              notes: 'Moderate energy. Completed 10k steps target.',
              workout_done: true,
            }
          ]);
        }
      }
    } catch (e) {
      console.warn("Using fallback daily history logs:", e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [idToken]);

  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/daily-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken || 'mock_token'}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        fetchLogs();
      }
    } catch (err) {
      console.error("Error saving daily log:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logger & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Log New Daily Entry Form (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" /> Daily Health & Wellness Journal
            </h3>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Live Logger
            </span>
          </div>

          <form onSubmit={handleSaveLog} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Entry Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Energy Score */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Daily Energy & Vitality Score</span>
                <span className="text-emerald-400 font-bold">{form.energy_score} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={form.energy_score}
                onChange={(e) => setForm({ ...form, energy_score: parseInt(e.target.value) })}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Sleep & Water Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Sleep Duration</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.sleep_hours}
                  onChange={(e) => setForm({ ...form, sleep_hours: parseFloat(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Water Intake (mL)</label>
                <input
                  type="number"
                  step="100"
                  value={form.water_ml}
                  onChange={(e) => setForm({ ...form, water_ml: parseFloat(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* HRV & Workout Check */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">HRV (ms)</label>
                <input
                  type="number"
                  value={form.hrv_ms}
                  onChange={(e) => setForm({ ...form, hrv_ms: parseInt(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.workout_done}
                    onChange={(e) => setForm({ ...form, workout_done: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span>Workout Completed</span>
                </label>
              </div>
            </div>

            {/* Daily Journal Notes */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Daily Reflection / Journal Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Note down how you felt, nutrition highlights, or recovery progress..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Daily Entry Saved to Firestore!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Today's Health Log</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Daily History Timeline & Calendar Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-400" /> Historical Daily Timeline
            </h3>
            <span className="text-xs text-slate-400 font-medium">{logs.length} Total Logs Saved</span>
          </div>

          <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-emerald-400">{log.date}</span>
                    {log.workout_done && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" /> Workout Done
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-semibold text-slate-300 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>Energy: {log.energy_score}/10</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                  <div className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <Moon className="w-4 h-4 text-teal-400" />
                    <div>
                      <div className="text-[10px] text-slate-400">Sleep</div>
                      <div className="font-bold text-slate-100">{log.sleep_hours} hrs</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-[10px] text-slate-400">Hydration</div>
                      <div className="font-bold text-slate-100">{log.water_ml} mL</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <HeartPulse className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-[10px] text-slate-400">HRV Score</div>
                      <div className="font-bold text-slate-100">{log.hrv_ms} ms</div>
                    </div>
                  </div>
                </div>

                {log.notes && (
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 italic">
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
