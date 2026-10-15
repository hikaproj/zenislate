/**
 * Zenislate - Shake / Tap Mission for Alarm Dismissal
 * Requires clicking or shaking device 30 times to dismiss alarm
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, Zap } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

interface ShakeMissionProps {
  targetCount?: number;
  onComplete: () => void;
}

export const ShakeMission: React.FC<ShakeMissionProps> = ({
  targetCount = 30,
  onComplete,
}) => {
  const [count, setCount] = useState(0);

  const handleTap = () => {
    SynthEngine.playClick(0.3);
    const next = count + 1;
    setCount(next);
    if (next >= targetCount) {
      SynthEngine.playChime(0.5);
      onComplete();
    }
  };

  useEffect(() => {
    // DeviceMotion event for physical shake detection
    let lastX = 0, lastY = 0, lastZ = 0;
    const threshold = 15;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const dx = Math.abs((acc.x || 0) - lastX);
      const dy = Math.abs((acc.y || 0) - lastY);
      const dz = Math.abs((acc.z || 0) - lastZ);

      if (dx + dy + dz > threshold) {
        handleTap();
      }

      lastX = acc.x || 0;
      lastY = acc.y || 0;
      lastZ = acc.z || 0;
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
    }
    return () => {
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [count, targetCount]);

  const progress = Math.min(100, (count / targetCount) * 100);

  return (
    <div className="flex flex-col items-center max-w-sm w-full p-4">
      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-4">
        <Smartphone className="w-5 h-5 animate-bounce" />
        <span>シェイク / 連打ミッション ({count} / {targetCount})</span>
      </div>

      <div className="w-full bg-white/10 h-3 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-amber-400 h-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        data-focusable="true"
        onClick={handleTap}
        className="w-40 h-40 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 active:scale-90 flex flex-col items-center justify-center text-white shadow-2xl shadow-amber-500/40 border-4 border-white/20 transition-transform"
      >
        <Zap className="w-10 h-10 mb-1" />
        <span className="text-xl font-bold font-mono">{targetCount - count}</span>
        <span className="text-xs opacity-80">連打！</span>
      </button>

      <p className="text-xs text-gray-300 mt-6 text-center">
        端末を激しく振るか、円形ボタンを連続タップしてください
      </p>
    </div>
  );
};
