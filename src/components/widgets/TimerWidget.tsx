/**
 * Zenislate - Countdown Timer Widget
 * Created by Hikaproj
 * License: MIT
 */

import React from 'react';
import { useTimerStore } from '../../stores/useTimerStore';
import { Play, Pause, RotateCcw, Trash2, Timer as TimerIcon } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

export const TimerWidget: React.FC = () => {
  const { timers, startTimer, pauseTimer, resetTimer, deleteTimer, addTimer } =
    useTimerStore();

  const handleStart = (id: string) => {
    SynthEngine.playClick(0.2);
    startTimer(id);
  };

  const handlePause = (id: string) => {
    SynthEngine.playClick(0.2);
    pauseTimer(id);
  };

  const handleReset = (id: string) => {
    SynthEngine.playClick(0.2);
    resetTimer(id);
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <TimerIcon className="w-4 h-4 text-slate-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            タイマー
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <button
            data-focusable="true"
            onClick={() => addTimer('3分', 3 * 60 * 1000)}
            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-mono transition-colors"
          >
            +3分
          </button>
          <button
            data-focusable="true"
            onClick={() => addTimer('5分', 5 * 60 * 1000)}
            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-mono transition-colors"
          >
            +5分
          </button>
        </div>
      </div>

      {timers.length === 0 ? (
        <div className="text-center py-6 text-xs text-gray-400">
          タイマーが設定されていません
        </div>
      ) : (
        <div className="space-y-3">
          {timers.map((t) => {
            const progress = t.durationMs > 0 ? (t.remainingMs / t.durationMs) * 100 : 0;
            return (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400 truncate mb-0.5">{t.label}</div>
                  <div className="text-2xl font-mono font-bold text-white tracking-tight">
                    {formatTime(t.remainingMs)}
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {t.isRunning ? (
                    <button
                      data-focusable="true"
                      onClick={() => handlePause(t.id)}
                      className="p-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                      aria-label="一時停止"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      data-focusable="true"
                      onClick={() => handleStart(t.id)}
                      className="p-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 shadow-md shadow-indigo-500/30 transition-colors"
                      aria-label="開始"
                    >
                      <Play className="w-4 h-4 fill-white" />
                    </button>
                  )}

                  <button
                    data-focusable="true"
                    onClick={() => handleReset(t.id)}
                    className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    aria-label="リセット"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    data-focusable="true"
                    onClick={() => deleteTimer(t.id)}
                    className="p-2 rounded-xl hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                    aria-label="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
