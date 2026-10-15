/**
 * Zenislate - Mobile Portrait Mode View
 * One-hand thumb-friendly layout optimized for vertical smartphone use
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState } from 'react';
import { ClockWidget } from '../widgets/ClockWidget';
import { WeatherWidget } from '../widgets/WeatherWidget';
import { TimerWidget } from '../widgets/TimerWidget';
import { AudioMixerWidget } from '../widgets/AudioMixerWidget';
import { MemoWidget } from '../widgets/MemoWidget';
import { NewsWidget } from '../widgets/NewsWidget';
import { CalculatorWidget } from '../widgets/CalculatorWidget';
import { BreathingWidget } from '../widgets/BreathingWidget';
import { AlarmManagerWidget } from '../widgets/AlarmManagerWidget';
import {
  LayoutDashboard,
  CloudSun,
  Timer,
  Sliders,
  FileText,
  Newspaper,
  Calculator,
  Wind,
  Bell,
} from 'lucide-react';

export const MobilePortraitView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hub' | 'alarm' | 'weather' | 'timer' | 'audio' | 'memo' | 'news' | 'calc' | 'breathe'>('hub');

  const tabs = [
    { id: 'hub', label: 'ホーム', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'alarm', label: 'アラーム', icon: <Bell className="w-5 h-5" /> },
    { id: 'weather', label: '天気', icon: <CloudSun className="w-5 h-5" /> },
    { id: 'timer', label: 'タイマー', icon: <Timer className="w-5 h-5" /> },
    { id: 'audio', label: '環境音', icon: <Sliders className="w-5 h-5" /> },
    { id: 'breathe', label: '呼吸', icon: <Wind className="w-5 h-5" /> },
    { id: 'memo', label: 'メモ', icon: <FileText className="w-5 h-5" /> },
    { id: 'news', label: 'ニュース', icon: <Newspaper className="w-5 h-5" /> },
    { id: 'calc', label: '電卓', icon: <Calculator className="w-5 h-5" /> },
  ] as const;

  return (
    <div className="w-full h-full flex flex-col justify-between max-w-md mx-auto p-3">
      {/* Scrollable Content Card Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-20 pt-2 flex flex-col items-center">
        {activeTab === 'hub' && (
          <div className="w-full space-y-4 flex flex-col items-center">
            <ClockWidget size="normal" />
            <WeatherWidget />
            <TimerWidget />
            <AudioMixerWidget />
          </div>
        )}

        {activeTab === 'alarm' && <AlarmManagerWidget />}
        {activeTab === 'weather' && <WeatherWidget />}
        {activeTab === 'timer' && <TimerWidget />}
        {activeTab === 'audio' && <AudioMixerWidget />}
        {activeTab === 'breathe' && <BreathingWidget />}
        {activeTab === 'memo' && <MemoWidget />}
        {activeTab === 'news' && <NewsWidget />}
        {activeTab === 'calc' && <CalculatorWidget />}
      </div>

      {/* Thumb-friendly Fixed Bottom Navigation */}
      <nav className="fixed bottom-3 left-3 right-3 max-w-md mx-auto glass-panel-elevated py-2 px-3 rounded-2xl flex items-center justify-around z-30 border border-white/10 shadow-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-focusable="true"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'text-sky-400 scale-105 font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
