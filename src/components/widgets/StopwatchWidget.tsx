/**
 * Zenislate - Stopwatch Widget (1/100s precision & Lap Times)
 * Created by Hikaproj
 * License: MIT
 */

import React from 'react';
import { useTimerStore } from '../../stores/useTimerStore';
import { Play, Pause, RotateCcw, Flag, Clock } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

export const StopwatchWidget: React.FC = () => {
  const {
    stopwatch,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    recordLap,
  } = useTimerStore();

  const handleStart = () => {
    SynthEngine.playClick(0.2);
    startStopwatch();
  };

  const handlePause = () => {
    SynthEngine.playClick(0.2);
    pauseStopwatch();
  };

  const handleReset = () => {
    SynthEngine.playClick(0.2);
    resetStopwatch();
  };

  const handleLap = () => {
    SynthEngine.playClick(0.2);
    recordLap();
  };

  const formatMs = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <Clock className="w-4 h-4 text-slate-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            ストップウォッチ
          </span>
        </div>
      </div>

      <div className="text-center py-2">
        <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tight">
          {formatMs(stopwatch.timeMs)}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-3 my-4">
        {stopwatch.isRunning ? (
          <button
            data-focusable="true"
            onClick={handlePause}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 font-semibold text-sm transition-all shadow-md"
          >
            <Pause className="w-4 h-4" />
            <span>停止</span>
          </button>
        ) : (
          <button
            data-focusable="true"
            onClick={handleStart}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>開始</span>
          </button>
        )}

        <button
          data-focusable="true"
          onClick={handleLap}
          disabled={!stopwatch.isRunning}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 font-semibold text-sm transition-all"
        >
          <Flag className="w-4 h-4" />
          <span>ラップ</span>
        </button>

        <button
          data-focusable="true"
          onClick={handleReset}
          className="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          aria-label="リセット"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Lap Times List */}
      {stopwatch.laps.length > 0 && (
        <div className="mt-2 max-h-36 overflow-y-auto space-y-1.5 pr-1 border-t border-white/5 pt-2">
          {stopwatch.laps
            .slice()
            .reverse()
            .map((lap) => (
              <div
                key={lap.lapNumber}
                className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white/5 font-mono"
              >
                <span className="text-gray-400">ラップ {lap.lapNumber}</span>
                <span className="text-emerald-400">+{formatMs(lap.splitMs)}</span>
                <span className="text-white font-semibold">{formatMs(lap.timeMs)}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
