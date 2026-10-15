/**
 * Zenislate - Bedside Night Mode View
 * Pure #000000 background, warm amber/crimson glow, and active Pixel Shifter burn-in protection
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useAlarmStore } from '../../stores/useAlarmStore';
import { Bell, Shield } from 'lucide-react';

export const BedsideNightView: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { alarms } = useAlarmStore();
  const [time, setTime] = useState(new Date());

  // Pixel shift offset state
  const [shiftOffset, setShiftOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Pixel shift every 3 minutes if burn-in protection enabled
    const pixelShiftTimer = setInterval(() => {
      if (settings.burnInProtection) {
        const randX = Math.floor(Math.random() * 9) - 4; // -4 to +4 px
        const randY = Math.floor(Math.random() * 9) - 4;
        setShiftOffset({ x: randX, y: randY });
      }
    }, 3 * 60 * 1000);

    return () => {
      clearInterval(timer);
      clearInterval(pixelShiftTimer);
    };
  }, [settings.burnInProtection]);

  const nextAlarm = alarms.find((a) => a.enabled);

  const getColorTheme = () => {
    switch (settings.nightColor) {
      case 'crimson':
        return {
          text: 'text-red-500',
          glow: 'shadow-red-950',
          accent: 'border-red-900/40 bg-red-950/20 text-red-400',
        };
      case 'emerald':
        return {
          text: 'text-emerald-500',
          glow: 'shadow-emerald-950',
          accent: 'border-emerald-900/40 bg-emerald-950/20 text-emerald-400',
        };
      case 'amber':
      default:
        return {
          text: 'text-amber-500',
          glow: 'shadow-amber-950',
          accent: 'border-amber-900/40 bg-amber-950/20 text-amber-400',
        };
    }
  };

  const theme = getColorTheme();

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const displayHours = settings.use24Hour
    ? String(hours).padStart(2, '0')
    : String(hours % 12 || 12).padStart(2, '0');
  const displayMinutes = String(minutes).padStart(2, '0');

  return (
    <div
      className="w-full h-full bg-black flex flex-col items-center justify-center p-6 select-none relative transition-transform duration-1000"
      style={{
        transform: `translate(${shiftOffset.x}px, ${shiftOffset.y}px)`,
      }}
    >
      {/* Dimmed Clock */}
      <div className="flex flex-col items-center">
        <div
          className={`text-7xl md:text-9xl font-mono font-bold tracking-tight opacity-75 ${theme.text}`}
        >
          {displayHours}
          <span className="opacity-50 animate-pulse">:</span>
          {displayMinutes}
        </div>

        <div className={`text-base md:text-lg font-medium opacity-60 mt-2 ${theme.text}`}>
          {time.toLocaleDateString('ja-JP', {
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </div>
      </div>

      {/* Next Alarm Pill */}
      {nextAlarm && (
        <div
          className={`mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold ${theme.accent}`}
        >
          <Bell className="w-4 h-4 animate-bounce" />
          <span>次期アラーム: {nextAlarm.time} ({nextAlarm.label})</span>
        </div>
      )}

      {/* Night Settings Bar */}
      <div className="absolute bottom-6 flex items-center space-x-3 text-xs opacity-50 hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[11px] text-gray-500">ピクセルシフト保護稼働中</span>
        </div>
        <span className="text-gray-700">•</span>
        <div className="flex items-center space-x-1">
          {(['amber', 'crimson', 'emerald'] as const).map((color) => (
            <button
              key={color}
              data-focusable="true"
              onClick={() => updateSettings({ nightColor: color })}
              className={`w-3.5 h-3.5 rounded-full ${
                color === 'amber'
                  ? 'bg-amber-600'
                  : color === 'crimson'
                  ? 'bg-red-600'
                  : 'bg-emerald-600'
              } ${settings.nightColor === color ? 'ring-2 ring-white scale-125' : 'opacity-40'}`}
              title={`${color}モード`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
