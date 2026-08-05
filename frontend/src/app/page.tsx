'use client';

import React, { useState } from 'react';
import { HeaderNav, DashboardTab } from '@/components/HeaderNav';
import { HealthStatsOverview } from '@/components/HealthStatsOverview';
import { MetricsForm, HealthMetricsState } from '@/components/MetricsForm';
import { WellnessChat } from '@/components/WellnessChat';
import { SessionSidebar } from '@/components/SessionSidebar';
import { DailyHistoryTracker } from '@/components/DailyHistoryTracker';
import { SmartwatchTelemetryView } from '@/components/SmartwatchTelemetryView';
import { AuthModal } from '@/components/AuthModal';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('coach');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<HealthMetricsState>({
    age: 28,
    activity_level: 'moderate',
    daily_water_ml: 2500,
    sleep_hours: 7.5,
    goals: ['stress_reduction', 'rem_sleep'],
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation with Tab Switcher */}
      <HeaderNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Tab 1: FAJAI AI Coach & Real-time Telemetry */}
        {activeTab === 'coach' && (
          <div className="space-y-6">
            <HealthStatsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Metrics & History (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <MetricsForm metrics={metrics} onChange={setMetrics} />
                <SessionSidebar
                  activeSessionId={activeSessionId}
                  onSelectSession={(sid) => setActiveSessionId(sid)}
                  onNewSession={() => setActiveSessionId(null)}
                />
              </div>

              {/* Right Column: AI Coach SSE Stream (8 cols) */}
              <div className="lg:col-span-8">
                <WellnessChat
                  sessionId={activeSessionId}
                  metrics={metrics}
                  onSessionCreated={(newSid) => setActiveSessionId(newSid)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Daily Health History Log & Timeline */}
        {activeTab === 'history' && (
          <DailyHistoryTracker />
        )}

        {/* Tab 3: Smartwatch & Wearables MCP Telemetry */}
        {activeTab === 'smartwatch' && (
          <SmartwatchTelemetryView />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
