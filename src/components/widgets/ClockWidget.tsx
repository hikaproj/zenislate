/**
 * Zenislate - Clock Widget (Digital & Smooth Analog)
 * Includes Japanese Holiday detection
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { JapaneseHolidayEngine } from '../../engines/holiday/JapaneseHolidays';
import { Calendar, Sparkles } from 'lucide-react';

interface ClockWidgetProps {
  size?: 'normal' | 'large' | 'giant';
  showAnalog?: boolean;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({
  size = 'normal',
  showAnalog = false,
}) => {
  const { settings } = useSettingsStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let animId: number;
    const updateTime = () => {
      setTime(new Date());
      animId = requestAnimationFrame(updateTime);
    };
    animId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animId);
  }, []);

  const holidayInfo = JapaneseHolidayEngine.isHoliday(time);

  // Time components
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const displayHours = settings.use24Hour
    ? String(hours).padStart(2, '0')
    : String(hours % 12 || 12).padStart(2, '0');
  const displayMinutes = String(minutes).padStart(2, '0');
  const displaySeconds = String(seconds).padStart(2, '0');
  const displayMilli = String(Math.floor(milliseconds / 10)).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Analog angles
  const secondDeg = (seconds + milliseconds / 1000) * 6; // 360 / 60
  const minuteDeg = (minutes + seconds / 60) * 6;
  const hourDeg = ((hours % 12) + minutes / 60) * 30; // 360 / 12

  const isUltraLight = settings.mode === 'ultra-light';
  const isBedside = settings.mode === 'bedside-night';

  const fontSizes = {
    normal: 'text-4xl md:text-5xl',
    large: 'text-6xl md:text-7xl',
    giant: 'text-7xl md:text-9xl',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {showAnalog || settings.clockType === 'analog' ? (
        // SVG Analog Clock
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Clock Face Circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              className={
                isUltraLight
                  ? 'fill-white stroke-black stroke-[3]'
                  : isBedside
                  ? 'fill-black stroke-[#ff9900]/40 stroke-[2]'
                  : 'fill-slate-900/60 stroke-white/15 stroke-[2] shadow-inner'
              }
            />

            {/* Dial Hour Markers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 100 + 74 * Math.cos(angle);
              const y1 = 100 + 74 * Math.sin(angle);
              const x2 = 100 + 84 * Math.cos(angle);
              const y2 = 100 + 84 * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className={
                    isUltraLight
                      ? 'stroke-black stroke-[2]'
                      : isBedside
                      ? 'stroke-[#ff9900]/60 stroke-[2]'
                      : 'stroke-white/40 stroke-[2]'
                  }
                />
              );
            })}

            {/* Hour Hand */}
            <line
              x1="100"
              y1="100"
              x2={100 + 50 * Math.cos((hourDeg * Math.PI) / 180)}
              y2={100 + 50 * Math.sin((hourDeg * Math.PI) / 180)}
              className={
                isUltraLight
                  ? 'stroke-black stroke-[5] stroke-linecap-round'
                  : isBedside
                  ? 'stroke-[#ff9900] stroke-[5] stroke-linecap-round'
                  : 'stroke-white stroke-[5] stroke-linecap-round'
              }
            />

            {/* Minute Hand */}
            <line
              x1="100"
              y1="100"
              x2={100 + 70 * Math.cos((minuteDeg * Math.PI) / 180)}
              y2={100 + 70 * Math.sin((minuteDeg * Math.PI) / 180)}
              className={
                isUltraLight
                  ? 'stroke-black stroke-[3] stroke-linecap-round'
                  : isBedside
                  ? 'stroke-[#ffaa33] stroke-[3.5] stroke-linecap-round'
                  : 'stroke-sky-400 stroke-[3.5] stroke-linecap-round'
              }
            />

            {/* Smooth Second Hand */}
            {settings.showSeconds && (
              <line
                x1="100"
                y1="100"
                x2={100 + 80 * Math.cos((secondDeg * Math.PI) / 180)}
                y2={100 + 80 * Math.sin((secondDeg * Math.PI) / 180)}
                className={
                  isUltraLight
                    ? 'stroke-black stroke-[1.5]'
                    : isBedside
                    ? 'stroke-[#ff5500] stroke-[1.5]'
                    : 'stroke-rose-500 stroke-[1.5]'
                }
              />
            )}

            {/* Center Cap */}
            <circle
              cx="100"
              cy="100"
              r="4.5"
              className={
                isUltraLight
                  ? 'fill-black'
                  : isBedside
                  ? 'fill-[#ff9900]'
                  : 'fill-rose-500'
              }
            />
          </svg>
        </div>
      ) : (
        // Digital Clock
        <div className="flex items-baseline font-mono font-bold tracking-tight">
          <span className={`${fontSizes[size]} drop-shadow-sm`}>
            {displayHours}:{displayMinutes}
          </span>
          {settings.showSeconds && (
            <span className="text-xl md:text-3xl opacity-80 ml-2 font-medium">
              :{displaySeconds}
            </span>
          )}
          {settings.showMilliseconds && (
            <span className="text-xs md:text-sm opacity-50 ml-1.5 font-mono">
              .{displayMilli}
            </span>
          )}
          {!settings.use24Hour && (
            <span className="text-xs md:text-sm font-semibold opacity-70 ml-2.5 uppercase tracking-wider">
              {ampm}
            </span>
          )}
        </div>
      )}

      {/* Date & Japanese Holiday Line */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-sm md:text-base font-medium opacity-90">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 opacity-70" />
          {time.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
        </span>

        {holidayInfo.isHoliday && (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isUltraLight
                ? 'border border-black text-black'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-sm'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {holidayInfo.name}
          </span>
        )}
      </div>
    </div>
  );
};
