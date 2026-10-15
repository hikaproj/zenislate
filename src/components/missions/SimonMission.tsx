/**
 * Zenislate - Simon Memory Game Mission for Alarm Dismissal
 * Requires repeating 4-color audio light sequences to dismiss alarm
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

interface SimonMissionProps {
  roundsToWin?: number;
  onComplete: () => void;
}

type ColorKey = 'green' | 'red' | 'yellow' | 'blue';

export const SimonMission: React.FC<SimonMissionProps> = ({
  roundsToWin = 4,
  onComplete,
}) => {
  const [sequence, setSequence] = useState<ColorKey[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [activeFlash, setActiveFlash] = useState<ColorKey | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);

  const colors: ColorKey[] = ['green', 'red', 'yellow', 'blue'];

  const playColorSound = (color: ColorKey) => {
    const ctx = SynthEngine.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freqs = {
      green: 261.63, // C4
      red: 329.63, // E4
      yellow: 392.0, // G4
      blue: 523.25, // C5
    };

    osc.frequency.setValueAtTime(freqs[color], ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  };

  const flashColor = (color: ColorKey, delay = 0) => {
    setTimeout(() => {
      setActiveFlash(color);
      playColorSound(color);
      setTimeout(() => setActiveFlash(null), 300);
    }, delay);
  };

  const startNextRound = (prevSeq: ColorKey[]) => {
    setIsShowingSequence(true);
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    const newSeq = [...prevSeq, nextColor];
    setSequence(newSeq);
    setUserStep(0);

    newSeq.forEach((col, idx) => {
      flashColor(col, (idx + 1) * 550);
    });

    setTimeout(() => {
      setIsShowingSequence(false);
    }, (newSeq.length + 1) * 550);
  };

  useEffect(() => {
    startNextRound([]);
  }, []);

  const handleColorClick = (color: ColorKey) => {
    if (isShowingSequence) return;

    flashColor(color, 0);

    if (sequence[userStep] === color) {
      const nextStep = userStep + 1;
      if (nextStep >= sequence.length) {
        if (currentRound >= roundsToWin) {
          SynthEngine.playChime(0.5);
          onComplete();
        } else {
          setCurrentRound(currentRound + 1);
          setTimeout(() => startNextRound(sequence), 800);
        }
      } else {
        setUserStep(nextStep);
      }
    } else {
      // Mistake! Restart round
      alert('間違い！最初からやり直してください。');
      setCurrentRound(1);
      setTimeout(() => startNextRound([]), 500);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm w-full p-4">
      <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-4">
        <Brain className="w-5 h-5" />
        <span>記憶ゲームミッション ({currentRound} / {roundsToWin} ラウンド)</span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-64 h-64 my-2">
        <button
          data-focusable="true"
          onClick={() => handleColorClick('green')}
          disabled={isShowingSequence}
          className={`rounded-2xl border-4 border-white/20 transition-all ${
            activeFlash === 'green'
              ? 'bg-emerald-300 scale-105 shadow-xl shadow-emerald-500/50'
              : 'bg-emerald-600 hover:bg-emerald-500 opacity-80'
          }`}
        />
        <button
          data-focusable="true"
          onClick={() => handleColorClick('red')}
          disabled={isShowingSequence}
          className={`rounded-2xl border-4 border-white/20 transition-all ${
            activeFlash === 'red'
              ? 'bg-rose-300 scale-105 shadow-xl shadow-rose-500/50'
              : 'bg-rose-600 hover:bg-rose-500 opacity-80'
          }`}
        />
        <button
          data-focusable="true"
          onClick={() => handleColorClick('yellow')}
          disabled={isShowingSequence}
          className={`rounded-2xl border-4 border-white/20 transition-all ${
            activeFlash === 'yellow'
              ? 'bg-amber-200 scale-105 shadow-xl shadow-amber-500/50'
              : 'bg-amber-500 hover:bg-amber-400 opacity-80'
          }`}
        />
        <button
          data-focusable="true"
          onClick={() => handleColorClick('blue')}
          disabled={isShowingSequence}
          className={`rounded-2xl border-4 border-white/20 transition-all ${
            activeFlash === 'blue'
              ? 'bg-sky-300 scale-105 shadow-xl shadow-sky-500/50'
              : 'bg-sky-600 hover:bg-sky-500 opacity-80'
          }`}
        />
      </div>

      <p className="text-xs text-gray-300 mt-4 text-center">
        {isShowingSequence ? '光る順番を覚えてください...' : '光った順番にタップしてください'}
      </p>
    </div>
  );
};
