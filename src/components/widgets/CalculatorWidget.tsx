/**
 * Zenislate - Calculator Widget
 * Optimized for touch, mouse, and TV remote D-pad navigation
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState } from 'react';
import { Calculator as CalcIcon } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

export const CalculatorWidget: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleDigit = (digit: string) => {
    SynthEngine.playClick(0.15);
    if (isNewNumber) {
      setDisplay(digit === '.' ? '0.' : digit);
      setIsNewNumber(false);
    } else {
      if (digit === '.' && display.includes('.')) return;
      setDisplay(display + digit);
    }
  };

  const handleOperator = (op: string) => {
    SynthEngine.playClick(0.15);
    setEquation(`${display} ${op} `);
    setIsNewNumber(true);
  };

  const handleClear = () => {
    SynthEngine.playClick(0.15);
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const handleDelete = () => {
    SynthEngine.playClick(0.15);
    if (display.length <= 1) {
      setDisplay('0');
      setIsNewNumber(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleEqual = () => {
    SynthEngine.playClick(0.15);
    if (!equation) return;
    try {
      const fullExpression = equation + display;
      // Sanitize input to only allowed math characters
      const sanitized = fullExpression.replace(/[^0-9+\-*/.]/g, '');
      // Evaluate basic arithmetic
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      setDisplay(String(Number(result.toFixed(6))));
      setEquation('');
      setIsNewNumber(true);
    } catch {
      setDisplay('Error');
      setIsNewNumber(true);
    }
  };

  const buttons = [
    { label: 'C', action: handleClear, special: 'danger' },
    { label: '⌫', action: handleDelete, special: 'action' },
    { label: '/', action: () => handleOperator('/'), special: 'op' },
    { label: '*', action: () => handleOperator('*'), special: 'op' },

    { label: '7', action: () => handleDigit('7') },
    { label: '8', action: () => handleDigit('8') },
    { label: '9', action: () => handleDigit('9') },
    { label: '-', action: () => handleOperator('-'), special: 'op' },

    { label: '4', action: () => handleDigit('4') },
    { label: '5', action: () => handleDigit('5') },
    { label: '6', action: () => handleDigit('6') },
    { label: '+', action: () => handleOperator('+'), special: 'op' },

    { label: '1', action: () => handleDigit('1') },
    { label: '2', action: () => handleDigit('2') },
    { label: '3', action: () => handleDigit('3') },
    { label: '=', action: handleEqual, special: 'equal' },

    { label: '0', action: () => handleDigit('0'), span: 'col-span-2' },
    { label: '.', action: () => handleDigit('.') },
  ];

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified shadow-lg select-none">
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-slate-800 dark:text-slate-200">
            <CalcIcon className="w-4 h-4 text-slate-800 dark:text-slate-200" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white balanced-text">
            スマート電卓
          </span>
        </div>
      </div>

      {/* Screen display */}
      <div className="p-3 rounded-2xl bg-black/5 dark:bg-black/35 backdrop-blur-md border border-black/5 dark:border-white/10 mb-3 text-right shadow-inner">
        <div className="text-xs text-slate-600 dark:text-slate-400 font-mono h-4 truncate">
          {equation}
        </div>
        <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white tracking-tight truncate">
          {display}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {buttons.map((btn, idx) => {
          let btnClass = 'bg-black/5 hover:bg-black/10 text-slate-900 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 font-bold border border-black/5 dark:border-white/10 backdrop-blur-md shadow-xs';
          if (btn.special === 'op') {
            btnClass = 'bg-teal-500/20 text-teal-800 dark:text-teal-300 hover:bg-teal-500/30 font-bold border border-teal-500/30';
          } else if (btn.special === 'danger') {
            btnClass = 'bg-rose-500/20 text-rose-800 dark:text-rose-300 hover:bg-rose-500/30 font-bold border border-rose-500/30';
          } else if (btn.special === 'equal') {
            btnClass = 'bg-teal-500 hover:bg-teal-400 text-white font-bold shadow-md shadow-teal-500/30 row-span-2 border border-teal-400';
          }

          return (
            <button
              key={idx}
              data-focusable="true"
              onClick={btn.action}
              className={`p-2.5 rounded-xl font-mono text-sm transition-all active:scale-95 flex items-center justify-center ${btnClass} ${
                btn.span || ''
              }`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
