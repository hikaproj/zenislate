/**
 * Zenislate - Modern Frosted Ambient Clock Banner
 * High-definition ambient timepiece, contextual greeting capsule, and refined quick actions
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useTimerStore } from '../../stores/useTimerStore';
import { useMediaStore } from '../../stores/useMediaStore';
import { useAlarmStore } from '../../stores/useAlarmStore';
import { JapaneseHolidayEngine } from '../../engines/holiday/JapaneseHolidays';
import {
  Calendar,
  Sparkles,
  Play,
  CloudRain,
  Waves,
  Maximize2,
  Bell,
  MapPin,
} from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

interface HeroClockBannerProps {
  compact?: boolean;
}

export const HeroClockBanner: React.FC<HeroClockBannerProps> = ({ compact = true }) => {
  const { settings } = useSettingsStore();
  const { startPomodoro } = useTimerStore();
  const { setTrackVolume, ambientTracks } = useMediaStore();
  const { alarms } = useAlarmStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let animId: number;
    const update = () => {
      setTime(new Date());
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const displayHours = settings.use24Hour
    ? String(hours).padStart(2, '0')
    : String(hours % 12 || 12).padStart(2, '0');
  const displayMinutes = String(minutes).padStart(2, '0');
  const displaySeconds = String(seconds).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const holidayInfo = JapaneseHolidayEngine.isHoliday(time);
  const nextAlarm = alarms.find((a) => a.enabled);

  const handleStartQuickFocus = () => {
    SynthEngine.playClick(0.2);
    startPomodoro();
  };

  const handleToggleRain = () => {
    SynthEngine.playClick(0.2);
    const rainTrack = ambientTracks.find((t) => t.type === 'rain');
    const newVol = (rainTrack?.volume || 0) > 0 ? 0 : 0.6;
    setTrackVolume('rain', newVol);
  };

  const handleToggleWaves = () => {
    SynthEngine.playClick(0.2);
    const wavesTrack = ambientTracks.find((t) => t.type === 'waves');
    const newVol = (wavesTrack?.volume || 0) > 0 ? 0 : 0.6;
    setTrackVolume('waves', newVol);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const rainActive = (ambientTracks.find((t) => t.type === 'rain')?.volume || 0) > 0;
  const wavesActive = (ambientTracks.find((t) => t.type === 'waves')?.volume || 0) > 0;

  // 1. Sleek Compact Ambient Bar (for SmartHubView - Low-Profile, No Vertical Waste)
  if (compact) {
    return (
      <div className="w-full glass-panel px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-2.5 select-none shrink-0 shadow-md">
        {/* Left: Time & Period */}
        <div className="flex items-baseline space-x-2 shrink-0">
          <div className="flex items-baseline font-mono font-bold tracking-tight drop-shadow-sm">
            <span className="text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white">{displayHours}</span>
            <span className="text-xl sm:text-2xl text-slate-500 dark:text-white/80 mx-0.5 animate-pulse">:</span>
            <span className="text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white">{displayMinutes}</span>
            {settings.showSeconds && (
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80 ml-1 font-mono">
                :{displaySeconds}
              </span>
            )}
          </div>
          {!settings.use24Hour && (
            <span className="text-[11px] font-bold uppercase text-slate-700 dark:text-white/80 tracking-wider">
              {ampm}
            </span>
          )}
        </div>

        {/* Center: Date, City, Holiday & Alarm Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            <Calendar className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>
              {time.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/15 border border-black/5 dark:border-white/20 text-xs font-bold text-slate-900 dark:text-white nowrap-pill shadow-xs backdrop-blur-md">
            <MapPin className="w-3 h-3 text-slate-700 dark:text-slate-300" />
            <span>{settings.cityName || '東京都'}</span>
          </div>

          {holidayInfo.isHoliday && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-800 dark:text-amber-200 nowrap-pill shadow-xs backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-300" />
              <span>祝日: {holidayInfo.name}</span>
            </div>
          )}

          {nextAlarm && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-800 dark:text-rose-200 nowrap-pill shadow-xs backdrop-blur-md">
              <Bell className="w-3 h-3 text-rose-600 dark:text-rose-300" />
              <span>次回 {nextAlarm.time}</span>
            </div>
          )}
        </div>

        {/* Right: Quick Ambient Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            data-focusable="true"
            onClick={handleStartQuickFocus}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/25 active:scale-95 text-xs text-slate-900 dark:text-white font-bold border border-black/5 dark:border-white/20 transition-all nowrap-pill shadow-xs backdrop-blur-md"
            title="25分集中ポモドーロ開始"
          >
            <Play className="w-3 h-3 fill-current text-slate-900 dark:text-white" />
            <span>25分集中</span>
          </button>

          <button
            data-focusable="true"
            onClick={handleToggleRain}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all active:scale-95 nowrap-pill shadow-xs backdrop-blur-md ${
              rainActive
                ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/25 text-slate-900 dark:text-white border-black/5 dark:border-white/20'
            }`}
            title="雨音環境音の再生/停止"
          >
            <CloudRain className="w-3 h-3" />
            <span>雨音 {rainActive ? 'ON' : ''}</span>
          </button>

          <button
            data-focusable="true"
            onClick={handleToggleWaves}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all active:scale-95 nowrap-pill shadow-xs backdrop-blur-md ${
              wavesActive
                ? 'bg-cyan-500 text-white border-cyan-400 shadow-sm'
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/25 text-slate-900 dark:text-white border-black/5 dark:border-white/20'
            }`}
            title="波音環境音の再生/停止"
          >
            <Waves className="w-3 h-3" />
            <span>波音 {wavesActive ? 'ON' : ''}</span>
          </button>

          <button
            data-focusable="true"
            onClick={handleToggleFullscreen}
            className="p-1 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/25 active:scale-95 text-slate-900 dark:text-white border border-black/5 dark:border-white/20 transition-all shadow-xs backdrop-blur-md"
            title="全画面表示切替"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Full Standalone Display Clock Card (Balanced & Proportional, for SmartDisplay Clock Page)
  return (
    <div className="w-full max-w-xl glass-panel-elevated p-6 sm:p-7 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center select-none shadow-xl">
      {/* Top Status Capsule */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/15 border border-black/5 dark:border-white/20 text-xs font-bold text-slate-900 dark:text-white nowrap-pill backdrop-blur-md shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
          <span>{settings.cityName || '東京都'}</span>
        </div>

        {holidayInfo.isHoliday && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-800 dark:text-amber-200 nowrap-pill backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
            <span>祝日: {holidayInfo.name}</span>
          </div>
        )}

        {nextAlarm && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-800 dark:text-rose-200 nowrap-pill backdrop-blur-md shadow-xs">
            <Bell className="w-3.5 h-3.5 text-rose-600 dark:text-rose-300" />
            <span>次回 {nextAlarm.time}</span>
          </div>
        )}
      </div>

      {/* Modern Master Timepiece (Balanced, Crisp & Bold) */}
      <div className="flex items-baseline justify-center font-sans tracking-tight my-2 select-none">
        <span className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight drop-shadow-sm font-mono text-slate-900 dark:text-white">
          {displayHours}
        </span>
        <span className="text-4xl sm:text-5xl md:text-6xl text-slate-500 dark:text-white/80 mx-1 sm:mx-2 font-light animate-pulse">
          :
        </span>
        <span className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight drop-shadow-sm font-mono text-slate-900 dark:text-white">
          {displayMinutes}
        </span>

        {settings.showSeconds && (
          <span className="text-xl sm:text-2xl text-slate-700 dark:text-white/80 font-mono ml-2 font-bold">
            :{displaySeconds}
          </span>
        )}

        {!settings.use24Hour && (
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80 ml-2 uppercase tracking-wider">
            {ampm}
          </span>
        )}
      </div>

      {/* Date Line */}
      <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-slate-900 dark:text-white font-bold tracking-wide mt-1 mb-4">
        <Calendar className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        <span>
          {time.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </span>
      </div>

      {/* Quick Action Frosted Capsules */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-black/5 dark:border-white/10 w-full">
        <button
          data-focusable="true"
          onClick={handleStartQuickFocus}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/25 active:scale-95 text-xs text-slate-900 dark:text-white font-bold border border-black/5 dark:border-white/20 transition-all nowrap-pill shadow-xs backdrop-blur-md"
        >
          <Play className="w-3.5 h-3.5 fill-current text-slate-900 dark:text-white" />
          <span>25分集中</span>
        </button>

        <button
          data-focusable="true"
          onClick={handleToggleRain}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 nowrap-pill shadow-xs backdrop-blur-md ${
            rainActive
              ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
              : 'bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/25 text-slate-900 dark:text-white border-black/5 dark:border-white/20'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>雨音 {rainActive ? '再生中' : 'を再生'}</span>
        </button>

        <button
          data-focusable="true"
          onClick={handleToggleWaves}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 nowrap-pill shadow-xs backdrop-blur-md ${
            wavesActive
              ? 'bg-cyan-500 text-white border-cyan-400 shadow-sm'
              : 'bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/25 text-slate-900 dark:text-white border-black/5 dark:border-white/20'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>波音 {wavesActive ? '再生中' : 'を再生'}</span>
        </button>

        <button
          data-focusable="true"
          onClick={handleToggleFullscreen}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/25 active:scale-95 text-xs text-slate-900 dark:text-white font-bold border border-black/5 dark:border-white/20 transition-all nowrap-pill shadow-xs backdrop-blur-md"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>全画面</span>
        </button>
      </div>
    </div>
  );
};
