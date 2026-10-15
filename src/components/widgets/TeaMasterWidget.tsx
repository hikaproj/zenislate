/**
 * Zenislate - Japanese Tea & Coffee Brew Master Widget
 * Optimal water temperature and precision steeping countdown for green tea & coffee
 * Created by Kyoto Craftsman (@teafan)
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, Coffee } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

interface BrewRecipe {
  id: string;
  name: string;
  temp: string;
  seconds: number;
  tip: string;
}

const RECIPES: BrewRecipe[] = [
  { id: 'gyokuro', name: '玉露 (Gyokuro)', temp: '50-60℃', seconds: 120, tip: '低温でじっくり旨味・アミノ酸を抽出' },
  { id: 'sencha', name: '上煎茶 (Sencha)', temp: '70-80℃', seconds: 60, tip: '爽やかな渋みと甘みの黄金バランス' },
  { id: 'fukamushi', name: '深蒸し茶', temp: '80℃', seconds: 40, tip: '蒸し時間が長く成分が出やすい濃緑茶' },
  { id: 'hojicha', name: 'ほうじ茶・玄米茶', temp: '95-100℃', seconds: 30, tip: '熱湯で一気に香ばしい香りを立たせる' },
  { id: 'drip', name: 'ハンドドリップ珈琲', temp: '90-93℃', seconds: 180, tip: '30秒蒸らし後、3回に分けて注ぐ' },
];

export const TeaMasterWidget: React.FC = () => {
  const [selectedId, setSelectedId] = useState('sencha');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  const currentRecipe = RECIPES.find((r) => r.id === selectedId) || RECIPES[1];

  const handleSelectRecipe = (id: string) => {
    SynthEngine.playClick(0.15);
    const rec = RECIPES.find((r) => r.id === id);
    if (!rec) return;
    setSelectedId(id);
    setTimeLeft(rec.seconds);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          SynthEngine.playChime(0.5);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleTogglePlay = () => {
    SynthEngine.playClick(0.2);
    if (timeLeft === 0) setTimeLeft(currentRecipe.seconds);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    SynthEngine.playClick(0.2);
    setIsRunning(false);
    setTimeLeft(currentRecipe.seconds);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <Coffee className="w-4 h-4 text-orange-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            至高の茶・珈琲タイマー
          </span>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-amber-300 font-mono">
          <Flame className="w-3.5 h-3.5" />
          <span>{currentRecipe.temp}</span>
        </div>
      </div>

      {/* Recipe Selector Pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {RECIPES.map((r) => (
          <button
            key={r.id}
            data-focusable="true"
            onClick={() => handleSelectRecipe(r.id)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              selectedId === r.id
                ? 'bg-white/25 text-white border border-white/30 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Timer & Tip Capsule */}
      <div className="my-2 p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
        <div className="text-4xl font-mono font-light text-white tracking-tight my-1">
          {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
          {String(timeLeft % 60).padStart(2, '0')}
        </div>
        <div className="text-[11px] text-white/70 mt-1 max-w-[240px]">
          {currentRecipe.tip}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-3 mt-2">
        <button
          data-focusable="true"
          onClick={handleTogglePlay}
          className={`flex items-center space-x-1.5 px-5 py-2 rounded-full font-medium text-xs border backdrop-blur-md transition-all active:scale-95 ${
            isRunning
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-white/20 hover:bg-white/30 text-white border-white/25'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white text-white" />}
          <span>{isRunning ? '一時停止' : timeLeft === 0 ? '再抽出' : '抽出開始'}</span>
        </button>

        <button
          data-focusable="true"
          onClick={handleReset}
          className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          title="リセット"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
        <span>有志プラグイン: Brew Master</span>
        <span>蒸らし管理</span>
      </div>
    </div>
  );
};
