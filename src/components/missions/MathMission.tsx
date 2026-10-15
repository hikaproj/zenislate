/**
 * Zenislate - Math Mission for Alarm Dismissal
 * Requires answering math problems with on-screen keypad (TV remote & touch friendly)
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

interface MathMissionProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: () => void;
}

export const MathMission: React.FC<MathMissionProps> = ({
  difficulty,
  onComplete,
}) => {
  const [problemIndex, setProblemIndex] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<{ q: string; a: number }>({
    q: '',
    a: 0,
  });
  const [inputVal, setInputVal] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  const totalProblems = 3;

  const generateProblem = () => {
    let a = 0,
      b = 0,
      op = '+';
    if (difficulty === 'easy') {
      a = Math.floor(Math.random() * 20) + 5;
      b = Math.floor(Math.random() * 20) + 5;
      op = Math.random() > 0.5 ? '+' : '-';
      if (op === '-' && a < b) [a, b] = [b, a];
    } else if (difficulty === 'medium') {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      op = Math.random() > 0.3 ? (Math.random() > 0.5 ? '+' : '-') : '*';
      if (op === '*') {
        a = Math.floor(Math.random() * 12) + 2;
        b = Math.floor(Math.random() * 12) + 2;
      } else if (op === '-' && a < b) {
        [a, b] = [b, a];
      }
    } else {
      // Hard
      a = Math.floor(Math.random() * 80) + 20;
      b = Math.floor(Math.random() * 80) + 20;
      const c = Math.floor(Math.random() * 9) + 2;
      op = '*';
      return { q: `${a} + ${b} × ${c}`, a: a + b * c };
    }

    const ans = op === '+' ? a + b : op === '-' ? a - b : a * b;
    return { q: `${a} ${op} ${b}`, a: ans };
  };

  useEffect(() => {
    setCurrentProblem(generateProblem());
    setInputVal('');
  }, [problemIndex, difficulty]);

  const handleDigit = (digit: string) => {
    SynthEngine.playClick(0.2);
    if (inputVal.length < 5) {
      setInputVal(inputVal + digit);
    }
  };

  const handleBackspace = () => {
    SynthEngine.playClick(0.2);
    setInputVal(inputVal.slice(0, -1));
  };

  const handleSubmit = () => {
    const num = parseInt(inputVal, 10);
    if (num === currentProblem.a) {
      SynthEngine.playChime(0.4);
      if (problemIndex + 1 >= totalProblems) {
        onComplete();
      } else {
        setProblemIndex(problemIndex + 1);
      }
    } else {
      setErrorShake(true);
      setInputVal('');
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm w-full p-4">
      <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
        <Calculator className="w-5 h-5" />
        <span>計算ミッション ({problemIndex + 1} / {totalProblems} 問)</span>
      </div>

      <div
        className={`p-4 rounded-2xl bg-white/10 border border-white/20 w-full text-center my-3 transition-transform ${
          errorShake ? 'animate-shake bg-rose-500/20 border-rose-500' : ''
        }`}
      >
        <div className="text-3xl font-mono font-bold text-white mb-2">
          {currentProblem.q} = ?
        </div>
        <div className="text-2xl font-mono font-bold text-sky-400 min-h-8">
          {inputVal || <span className="opacity-40 font-normal">入力してください</span>}
        </div>
      </div>

      {/* On-Screen Keypad for touch and TV remote D-pad */}
      <div className="grid grid-cols-3 gap-2 w-full my-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
          <button
            key={k}
            data-focusable="true"
            onClick={() => {
              if (k === 'C') setInputVal('');
              else if (k === '⌫') handleBackspace();
              else handleDigit(k);
            }}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-lg font-mono font-bold text-white transition-all"
          >
            {k}
          </button>
        ))}
      </div>

      <button
        data-focusable="true"
        onClick={handleSubmit}
        disabled={!inputVal}
        className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-white shadow-lg transition-all"
      >
        回答する
      </button>
    </div>
  );
};
