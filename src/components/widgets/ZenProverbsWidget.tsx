/**
 * Zenislate - Zen Proverbs & Mindfulness Reflection Widget
 * Daily Japanese Zen wisdom and modern contemplation advice
 * Created by Hikaproj (Community Plugin)
 * License: MIT
 */

import React, { useState } from 'react';
import { Sparkles, RefreshCw, Bookmark } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

interface ProverbItem {
  phrase: string;
  reading: string;
  meaning: string;
  advice: string;
}

const PROVERBS: ProverbItem[] = [
  {
    phrase: '日日是好日',
    reading: 'にちにちこれこうじつ',
    meaning: '晴れの日も雨の日も、喜びも困難も、かけがえのない良き一日であるということ。',
    advice: '起こる出来事の良し悪しにとらわれず、今この瞬間を心静かに受け止めましょう。',
  },
  {
    phrase: '平常心是道',
    reading: 'びょうじょうしんぜどう',
    meaning: '何気ない日常の心のあり方、ありのままの素直な心こそが真実の道である。',
    advice: '特別なことや評価を追わず、目の前の茶を飲み、息を吸うことを大切に。',
  },
  {
    phrase: '行雲流水',
    reading: 'こううんりゅうすい',
    meaning: '空をゆく雲や川を流れる水のように、執着せず自然の理に身を任せて生きること。',
    advice: '思い通りにならない事があっても、抗わずに柔らかく受け流しましょう。',
  },
  {
    phrase: '照顧脚下',
    reading: 'しょうこきゃっか',
    meaning: '自分の足元をよく見よ。他者を裁く前に、まず己自身の今の言動を省みること。',
    advice: '遠くの不安を見つめる前に、今立っている足元と呼吸に意識を戻しましょう。',
  },
  {
    phrase: '本来無一物',
    reading: 'ほんらいむいちもつ',
    meaning: '本来、人間は何も持たずに生まれ、固定された執着の対象など何もない。',
    advice: '肩書きや所有へのこだわりを一度下ろすと、心がふっと軽くなります。',
  },
  {
    phrase: '知足安分',
    reading: 'ちそくあんぶん',
    meaning: '足ることを知り、分に安んじる。今あるものに感謝する心が最高の富である。',
    advice: '足りないものを数える代わりに、すでに手の中にある温もりに目を向けましょう。',
  },
];

export const ZenProverbsWidget: React.FC = () => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * PROVERBS.length));
  const [saved, setSaved] = useState(false);

  const current = PROVERBS[index];

  const handleNext = () => {
    SynthEngine.playClick(0.15);
    setIndex((prev) => (prev + 1) % PROVERBS.length);
    setSaved(false);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none relative overflow-hidden group">
      {/* Header */}
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            日々の禅語・心の調律
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            data-focusable="true"
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="別の禅語を表示"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Proverb Display */}
      <div className="my-2 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
        <div className="text-2xl font-serif font-bold text-white tracking-widest my-1 drop-shadow-sm">
          {current.phrase}
        </div>
        <div className="text-[11px] text-white/50 font-serif tracking-wider mb-2">
          （{current.reading}）
        </div>
        <p className="text-xs text-white/80 leading-relaxed font-sans font-normal mb-2">
          {current.meaning}
        </p>
      </div>

      {/* Mindful Advice Pill */}
      <div className="mt-1 p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-white/70 leading-relaxed">
        <span className="font-semibold text-white/90 block mb-0.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>今日の実践</span>
        </span>
        {current.advice}
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
        <span>有志プラグイン: 禅語アーカイブ</span>
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center space-x-1 ${saved ? 'text-amber-300' : 'hover:text-white'}`}
        >
          <Bookmark className="w-3 h-3" />
          <span>{saved ? '保存済み' : 'しおり'}</span>
        </button>
      </div>
    </div>
  );
};
