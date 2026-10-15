/**
 * Zenislate - Ultra-Light / E-Paper Mode View
 * High-contrast monochrome layout with 0 GPU shaders, 0 gradients, 0 blurs.
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { JapaneseHolidayEngine } from '../../engines/holiday/JapaneseHolidays';
import { useAlarmStore } from '../../stores/useAlarmStore';
import { useSettingsStore } from '../../stores/useSettingsStore';

export const UltraLightView: React.FC = () => {
  const { settings } = useSettingsStore();
  const { alarms } = useAlarmStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Only update once every second, low CPU footprint
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const holidayInfo = JapaneseHolidayEngine.isHoliday(time);
  const nextAlarm = alarms.find((a) => a.enabled);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const displayHours = settings.use24Hour
    ? String(hours).padStart(2, '0')
    : String(hours % 12 || 12).padStart(2, '0');
  const displayMinutes = String(minutes).padStart(2, '0');
  const displaySeconds = String(seconds).padStart(2, '0');

  return (
    <div className="w-full h-full bg-[#fdfdfc] text-black flex flex-col items-center justify-between p-6 border-4 border-black font-mono select-none">
      {/* Top Status */}
      <div className="w-full flex justify-between items-center border-b-2 border-black pb-2 text-sm font-bold">
        <span>ZENISLATE ULTRA-LIGHT / E-PAPER</span>
        <span>省電力モード</span>
      </div>

      {/* Center Giant High-Contrast Clock */}
      <div className="flex flex-col items-center my-auto">
        <div className="text-8xl md:text-9xl font-black tracking-tighter">
          {displayHours}:{displayMinutes}
          {settings.showSeconds && (
            <span className="text-4xl md:text-5xl ml-2 font-normal">
              :{displaySeconds}
            </span>
          )}
        </div>

        {/* Date & Holiday */}
        <div className="text-lg md:text-2xl font-bold mt-4">
          {time.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </div>

        {holidayInfo.isHoliday && (
          <div className="mt-3 px-4 py-1 border-2 border-black text-sm font-bold uppercase tracking-wider">
            祝日: {holidayInfo.name}
          </div>
        )}
      </div>

      {/* Bottom Information */}
      <div className="w-full border-t-2 border-black pt-3 flex flex-wrap justify-between items-center text-xs font-bold gap-2">
        <div>
          {nextAlarm ? `次期アラーム: ${nextAlarm.time} (${nextAlarm.label})` : '設定中アラームなし'}
        </div>
        <div>ゼロ・GPUシェーダー / バッテリー超長持ち</div>
      </div>
    </div>
  );
};
