/**
 * Zenislate - Pomodoro Focus Timer Widget
 * 25m work / 5m short break / 15m long break cycles
 * Created by Hikaproj
 * License: MIT
 */

import React from 'react';
import { useTimerStore } from '../../stores/useTimerStore';
import { Play, Pause, RotateCcw, SkipForward, BrainCircuit, Coffee } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

export const PomodoroWidget: React.FC = () => {
  const {
    pomodoro,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    skipPomodoroPhase,
  } = useTimerStore();

  const handleStart = () => {
    SynthEngine.playClick(0.2);
    startPomodoro();
  };

  const handlePause = () => {
    SynthEngine.playClick(0.2);
    pausePomodoro();
  };

  const handleReset = () => {
    SynthEngine.playClick(0.2);
    resetPomodoro();
  };

  const handleSkip = () => {
    SynthEngine.playClick(0.2);
    skipPomodoroPhase();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getModeLabel = () => {
    switch (pomodoro.mode) {
      case 'work':
        return { label: '集中タイム', color: 'text-rose-400', icon: <BrainCircuit className="w-4 h-4" /> };
      case 'shortBreak':
        return { label: '小休憩 (5分)', color: 'text-emerald-400', icon: <Coffee className="w-4 h-4" /> };
      case 'longBreak':
        return { label: '大休憩 (15分)', color: 'text-sky-400', icon: <Coffee className="w-4 h-4" /> };
    }
  };

  const modeInfo = getModeLabel();
  const currentTotal =
    pomodoro.mode === 'work'
      ? pomodoro.workDurationMs
      : pomodoro.mode === 'shortBreak'
      ? pomodoro.shortBreakDurationMs
      : pomodoro.longBreakDurationMs;

  const progress = currentTotal > 0 ? (pomodoro.remainingMs / currentTotal) * 100 : 0;

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none items-center">
      <div className="h-8 shrink-0 flex items-center justify-between w-full mb-2">
        <div className={`flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider ${modeInfo.color}`}>
          {modeInfo.icon}
          <span>{modeInfo.label}</span>
        </div>
        <div className="text-xs text-gray-400 font-medium">
          サイクル: {pomodoro.completedCycles} 完了
        </div>
      </div>

      {/* Big Circular Progress display */}
      <div className="relative w-40 h-40 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-white/10 stroke-[6] fill-none"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            className={`stroke-[6] fill-none transition-all duration-300 stroke-linecap-round ${
              pomodoro.mode === 'work'
                ? 'stroke-rose-500'
                : pomodoro.mode === 'shortBreak'
                ? 'stroke-emerald-400'
                : 'stroke-sky-400'
            }`}
            strokeDasharray={276.46}
            strokeDashoffset={276.46 * (1 - progress / 100)}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-mono font-bold text-white tracking-tight">
            {formatTime(pomodoro.remainingMs)}
          </span>
          <span className="text-[10px] text-gray-400 uppercase mt-0.5">
            {pomodoro.isRunning ? '進行中' : '一時停止'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 mt-4">
        {pomodoro.isRunning ? (
          <button
            data-focusable="true"
            onClick={handlePause}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 font-semibold text-sm transition-all"
          >
            <Pause className="w-4 h-4" />
            <span>停止</span>
          </button>
        ) : (
          <button
            data-focusable="true"
            onClick={handleStart}
            className={`flex items-center space-x-1.5 px-6 py-2.5 rounded-xl font-semibold text-sm text-white shadow-lg transition-all ${
              pomodoro.mode === 'work'
                ? 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/25'
                : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/25'
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>開始</span>
          </button>
        )}

        <button
          data-focusable="true"
          onClick={handleSkip}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
          title="次のフェーズへスキップ"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          data-focusable="true"
          onClick={handleReset}
          className="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          title="リセット"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
