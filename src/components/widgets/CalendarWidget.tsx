/**
 * Zenislate - Monthly Calendar Widget with Japanese Holidays
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState } from 'react';
import { JapaneseHolidayEngine } from '../../engines/holiday/JapaneseHolidays';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const holidays = JapaneseHolidayEngine.getHolidays(year);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

  // Compute days in month
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0: Sun, 1: Mon, ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekDayHeaders = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified shadow-lg select-none">
      {/* Header Month / Year & Prev / Next buttons */}
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-slate-800 dark:text-slate-200">
            <CalendarIcon className="w-4 h-4 text-slate-800 dark:text-slate-200" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white balanced-text">
            {year}年 {month + 1}月
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            data-focusable="true"
            onClick={prevMonth}
            aria-label="前月"
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            data-focusable="true"
            onClick={nextMonth}
            aria-label="翌月"
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold mb-1">
        {weekDayHeaders.map((day, idx) => (
          <div
            key={day}
            className={`py-1 ${
              idx === 0
                ? 'text-rose-600 dark:text-rose-400 font-bold'
                : idx === 6
                ? 'text-sky-600 dark:text-sky-400 font-bold'
                : 'text-slate-800 dark:text-slate-200 font-bold'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {/* Leading empty spaces */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="py-2" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
            dayNum
          ).padStart(2, '0')}`;
          const holidayName = holidays.get(dateStr);
          const dayOfWeek = (firstDayOfWeek + i) % 7;
          const isToday = isThisMonth && today.getDate() === dayNum;

          return (
            <div
              key={dayNum}
              title={holidayName || undefined}
              className={`py-1.5 px-0.5 rounded-xl relative flex flex-col items-center justify-center transition-all ${
                isToday
                  ? 'bg-sky-500 font-bold text-white shadow-md shadow-sky-500/30'
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span
                className={`${
                  isToday
                    ? 'text-white font-bold'
                    : holidayName || dayOfWeek === 0
                    ? 'text-rose-600 dark:text-rose-400 font-bold'
                    : dayOfWeek === 6
                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-900 dark:text-white font-bold'
                }`}
              >
                {dayNum}
              </span>
              {holidayName && (
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isToday ? 'bg-white' : 'bg-rose-500'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
