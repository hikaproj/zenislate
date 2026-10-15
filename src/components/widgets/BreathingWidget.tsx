/**
 * Zenislate - 4-7-8 Mindfulness Breathing Guide Widget
 * 4s Inhale, 7s Hold, 8s Exhale for deep relaxation and focus
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

export const BreathingWidget: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (phase === 'idle') return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          if (phase === 'inhale') {
            if (soundEnabled) SynthEngine.playClick(0.1);
            setPhase('hold');
            return 7;
          } else if (phase === 'hold') {
            if (soundEnabled) SynthEngine.playClick(0.1);
            setPhase('exhale');
            return 8;
          } else if (phase === 'exhale') {
            if (soundEnabled) SynthEngine.playChime(0.2);
            setCycleCount((c) => c + 1);
            setPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, soundEnabled]);

  const handleStart = () => {
    if (soundEnabled) SynthEngine.playChime(0.2);
    setPhase('inhale');
    setSecondsLeft(4);
  };

  const handlePause = () => {
    setPhase('idle');
  };

  const handleReset = () => {
    setPhase('idle');
    setSecondsLeft(4);
    setCycleCount(0);
  };

  const getPhaseDetails = () => {
    switch (phase) {
      case 'inhale':
        return {
          title: '息を吸う',
          desc: '鼻から静かに吸い込みます',
          scale: 'scale-125',
          color: 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_50px_rgba(34,211,238,0.4)]',
        };
      case 'hold':
        return {
          title: '息を止める',
          desc: '静かに息をキープします',
          scale: 'scale-125',
          color: 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_50px_rgba(251,191,36,0.4)]',
        };
      case 'exhale':
        return {
          title: '息を吐く',
          desc: '口からゆっくり吐き出します',
          scale: 'scale-90',
          color: 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-[0_0_50px_rgba(99,102,241,0.4)]',
        };
      case 'idle':
      default:
        return {
          title: '4-7-8 呼吸ガイド',
          desc: '開始を押して深呼吸を開始',
          scale: 'scale-100',
          color: 'bg-white/5 border-white/10 text-gray-300',
        };
    }
  };

  const currentDetails = getPhaseDetails();

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none items-center">
      <div className="h-8 shrink-0 flex items-center justify-between w-full mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <Wind className="w-4 h-4 text-slate-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            マインドフルネス呼吸
          </span>
        </div>
        <div className="text-xs text-white/50 font-mono">
          {cycleCount} サイクル完了
        </div>
      </div>

      {/* Animated Breathing Circle */}
      <div className="relative w-44 h-44 flex items-center justify-center my-4">
        <div
          className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ${currentDetails.scale} ${currentDetails.color}`}
        >
          <span className="text-xl font-bold font-display tracking-wide">
            {currentDetails.title}
          </span>
          {phase !== 'idle' && (
            <span className="text-3xl font-mono font-bold mt-1">
              {secondsLeft}
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mb-4 h-4">
        {currentDetails.desc}
      </p>

      {/* Controls */}
      <div className="flex items-center space-x-3">
        {phase === 'idle' ? (
          <button
            data-focusable="true"
            onClick={handleStart}
            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>開始 (4-7-8)</span>
          </button>
        ) : (
          <button
            data-focusable="true"
            onClick={handlePause}
            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 font-semibold transition-all"
          >
            <Pause className="w-4 h-4" />
            <span>一時停止</span>
          </button>
        )}

        <button
          data-focusable="true"
          onClick={handleReset}
          className="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="リセット"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          data-focusable="true"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`text-[10px] px-2.5 py-1.5 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
              : 'bg-white/5 border-white/10 text-gray-500'
          }`}
        >
          {soundEnabled ? '音: ON' : '音: OFF'}
        </button>
      </div>
    </div>
  );
};
