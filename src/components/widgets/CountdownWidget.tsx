/**
 * Zenislate - Countdown Widget
 * Counts down to customizable events (e.g. New Year or Target Date)
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { Hourglass, Trophy } from 'lucide-react';

interface CountdownWidgetProps {
  targetDate?: Date;
  eventTitle?: string;
}

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({
  targetDate,
  eventTitle = '新年カウントダウン',
}) => {
  // Default to next year's Jan 1st if not specified
  const now = new Date();
  const nextTarget =
    targetDate || new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: false });

  useEffect(() => {
    const calc = () => {
      const current = Date.now();
      const diff = nextTarget.getTime() - current;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, completed: false });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [nextTarget]);

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none items-center">
      <div className="h-8 shrink-0 flex items-center justify-between w-full mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <Hourglass className="w-4 h-4 text-slate-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            {eventTitle}
          </span>
        </div>
      </div>

      {timeLeft.completed ? (
        <div className="flex items-center gap-2 text-emerald-400 font-bold py-2">
          <Trophy className="w-5 h-5" />
          <span>到達しました！</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 text-center w-full">
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-xl md:text-2xl font-mono font-bold text-white">
              {timeLeft.days}
            </div>
            <div className="text-[10px] text-gray-400 font-medium">日</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-xl md:text-2xl font-mono font-bold text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-gray-400 font-medium">時間</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-xl md:text-2xl font-mono font-bold text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-gray-400 font-medium">分</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-xl md:text-2xl font-mono font-bold text-white">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-gray-400 font-medium">秒</div>
          </div>
        </div>
      )}
    </div>
  );
};
