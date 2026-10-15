/**
 * Zenislate - Dedicated Smart Display Mode (Google Nest Hub & Amazon Echo Show Style)
 * Fullscreen Horizontal Paged Experience, Zero Vertical Scroll, Touch Swipe & D-Pad Navigation,
 * Page Reordering, and Dedicated Fit-to-Screen Smart Cards (No Vertical Overflow).
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

// Hero Clock
import { HeroClockBanner } from '../layout/HeroClockBanner';

// Native Widgets
import { WeatherWidget } from '../widgets/WeatherWidget';
import { AlarmManagerWidget } from '../widgets/AlarmManagerWidget';
import { CalendarWidget } from '../widgets/CalendarWidget';
import { PomodoroWidget } from '../widgets/PomodoroWidget';
import { TimerWidget } from '../widgets/TimerWidget';
import { StopwatchWidget } from '../widgets/StopwatchWidget';
import { CountdownWidget } from '../widgets/CountdownWidget';
import { AudioMixerWidget } from '../widgets/AudioMixerWidget';
import { RadioWidget } from '../widgets/RadioWidget';
import { BreathingWidget } from '../widgets/BreathingWidget';
import { NewsWidget } from '../widgets/NewsWidget';
import { MemoWidget } from '../widgets/MemoWidget';
import { CalculatorWidget } from '../widgets/CalculatorWidget';
import { SystemStatusWidget } from '../widgets/SystemStatusWidget';
import { PhotoFrameWidget } from '../widgets/PhotoFrameWidget';

// Community Plugins
import { ZenProverbsWidget } from '../widgets/ZenProverbsWidget';
import { CryptoRatesWidget } from '../widgets/CryptoRatesWidget';
import { TeaMasterWidget } from '../widgets/TeaMasterWidget';

import {
  Clock,
  CloudSun,
  Zap,
  Radio,
  CloudRain,
  Wind,
  Timer,
  Hourglass,
  Target,
  Newspaper,
  Coins,
  Coffee,
  ImageIcon,
  Calendar,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Layers,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  AppWindow,
  ExternalLink,
  Bell,
} from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

export interface DisplayPageDef {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  render: () => React.ReactNode;
}

const DEFAULT_SMART_DISPLAY_PAGES: string[] = [
  'page-clock',
  'page-weather',
  'page-alarm',
  'page-system',
  'page-radio',
  'page-mixer',
  'page-breathing',
  'page-pomodoro',
  'page-timers',
  'page-stopwatch',
  'page-countdown',
  'page-news',
  'page-crypto',
  'page-zen',
  'page-tea',
  'page-photos',
  'page-calendar',
  'page-memo',
  'page-calculator',
];

export const SmartDisplayView: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const customOrder = settings.hubPageOrder || DEFAULT_SMART_DISPLAY_PAGES;

  // Custom Iframe Embed Plugins Renderer for Smart Display
  const renderEmbedPlugin = (id: string, name: string, url: string) => (
    <div key={id} className="glass-panel p-4 sm:p-6 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none h-full max-h-[75vh] flex flex-col">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center space-x-2">
          <AppWindow className="w-4 h-4 text-slate-300" />
          <span className="text-xs font-semibold tracking-tight text-white/90">{name}</span>
        </div>
        <a href={url} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="flex-1 w-full min-h-0 rounded-2xl overflow-hidden bg-black/20 border border-white/5">
        <iframe
          src={url}
          className="w-full h-full border-none"
          title={name}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );

  // Dedicated Fit-to-Screen Pages (Zero Vertical Scroll, Distributed cleanly)
  const masterPages: DisplayPageDef[] = [
    {
      id: 'page-clock',
      title: 'ホーム時計',
      category: '時計',
      icon: <Clock className="w-4 h-4 text-slate-300" />,
      render: () => (
        <div className="w-full h-full flex flex-col justify-center items-center max-w-2xl mx-auto overflow-hidden">
          <HeroClockBanner compact={false} />
        </div>
      ),
    },
    {
      id: 'page-weather',
      title: '気象観測 & 週間予報',
      category: '生活',
      icon: <CloudSun className="w-4 h-4 text-amber-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <WeatherWidget />
        </div>
      ),
    },
    {
      id: 'page-alarm',
      title: 'アラーム管理センター',
      category: '時間',
      icon: <Bell className="w-4 h-4 text-rose-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <AlarmManagerWidget />
        </div>
      ),
    },
    {
      id: 'page-system',
      title: '端末ステータス・通信監視',
      category: '生活',
      icon: <Zap className="w-4 h-4 text-amber-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <SystemStatusWidget />
        </div>
      ),
    },
    {
      id: 'page-radio',
      title: 'ネットラジオ & 音楽',
      category: '音楽',
      icon: <Radio className="w-4 h-4 text-violet-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <RadioWidget />
        </div>
      ),
    },
    {
      id: 'page-mixer',
      title: '自然環境音ミキサー',
      category: '音楽',
      icon: <CloudRain className="w-4 h-4 text-sky-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <AudioMixerWidget />
        </div>
      ),
    },
    {
      id: 'page-breathing',
      title: '4-7-8 呼吸ガイド',
      category: '健康',
      icon: <Wind className="w-4 h-4 text-teal-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <BreathingWidget />
        </div>
      ),
    },
    {
      id: 'page-pomodoro',
      title: 'ポモドーロ集中タイマー',
      category: '時間',
      icon: <Timer className="w-4 h-4 text-red-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <PomodoroWidget />
        </div>
      ),
    },
    {
      id: 'page-timers',
      title: 'マルチカウントダウン',
      category: '時間',
      icon: <Hourglass className="w-4 h-4 text-indigo-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <TimerWidget />
        </div>
      ),
    },
    {
      id: 'page-stopwatch',
      title: '高精度ストップウォッチ',
      category: '時間',
      icon: <Timer className="w-4 h-4 text-emerald-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <StopwatchWidget />
        </div>
      ),
    },
    {
      id: 'page-countdown',
      title: '目標日カウントダウン',
      category: '時間',
      icon: <Target className="w-4 h-4 text-cyan-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <CountdownWidget eventTitle="新年カウントダウン" />
        </div>
      ),
    },
    {
      id: 'page-news',
      title: '最新ニュース & RSS (複数フィード)',
      category: '情報',
      icon: <Newspaper className="w-4 h-4 text-slate-300" />,
      render: () => (
        <div className="w-full h-full max-w-4xl mx-auto flex flex-col justify-center overflow-hidden">
          <NewsWidget />
        </div>
      ),
    },
    {
      id: 'page-crypto',
      title: '暗号資産 & 為替レート',
      category: '情報',
      icon: <Coins className="w-4 h-4 text-yellow-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <CryptoRatesWidget />
        </div>
      ),
    },
    {
      id: 'page-zen',
      title: '日々の禅語・心の調律',
      category: '哲学',
      icon: <Clock className="w-4 h-4 text-emerald-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <ZenProverbsWidget />
        </div>
      ),
    },
    {
      id: 'page-tea',
      title: '至高の茶・珈琲タイマー',
      category: '生活',
      icon: <Coffee className="w-4 h-4 text-orange-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <TeaMasterWidget />
        </div>
      ),
    },
    {
      id: 'page-photos',
      title: 'フォトフレーム & 写真',
      category: '生活',
      icon: <ImageIcon className="w-4 h-4 text-sky-300" />,
      render: () => (
        <div className="w-full h-full max-w-4xl mx-auto flex flex-col justify-center overflow-hidden">
          <PhotoFrameWidget />
        </div>
      ),
    },
    {
      id: 'page-calendar',
      title: '暦・国民の祝日カレンダー',
      category: '生活',
      icon: <Calendar className="w-4 h-4 text-blue-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <CalendarWidget />
        </div>
      ),
    },
    {
      id: 'page-memo',
      title: '付箋メモパッド',
      category: '生活',
      icon: <Clock className="w-4 h-4 text-amber-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <MemoWidget />
        </div>
      ),
    },
    {
      id: 'page-calculator',
      title: 'スマート電卓',
      category: 'ツール',
      icon: <Calculator className="w-4 h-4 text-slate-300" />,
      render: () => (
        <div className="w-full h-full max-w-3xl mx-auto flex flex-col justify-center overflow-hidden">
          <CalculatorWidget />
        </div>
      ),
    },
  ];

  // Dynamically append any additional custom Webview apps as their own dedicated pages
  (settings.installedPlugins || []).forEach((p, idx) => {
    if (p.embedUrl && p.installed && p.enabled && idx > 0) {
      const pageId = `custom-page-${p.id}`;
      if (!masterPages.some((mp) => mp.id === pageId)) {
        masterPages.push({
          id: pageId,
          title: p.name,
          category: 'カスタムアプリ',
          icon: <AppWindow className="w-4 h-4 text-teal-300" />,
          render: () => (
            <div className="w-full h-full max-w-5xl mx-auto flex flex-col justify-center">
              {renderEmbedPlugin(p.id, p.name, p.embedUrl || '')}
            </div>
          ),
        });
      }
    }
  });

  // Reorder masterPages according to customOrder
  const sortedPages = [...masterPages].sort((a, b) => {
    const idxA = customOrder.indexOf(a.id);
    const idxB = customOrder.indexOf(b.id);
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  });

  const safeIndex = Math.max(0, Math.min(activePageIndex, sortedPages.length - 1));
  const currentPage = sortedPages[safeIndex] || sortedPages[0];

  const goToNextPage = () => {
    SynthEngine.playClick(0.15);
    setActivePageIndex((prev) => (prev + 1) % sortedPages.length);
  };

  const goToPrevPage = () => {
    SynthEngine.playClick(0.15);
    setActivePageIndex((prev) => (prev - 1 + sortedPages.length) % sortedPages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex, sortedPages.length]);

  // Touch Swipe Handlers for touchscreens
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        goToNextPage();
      } else {
        goToPrevPage();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const handleMovePage = (pageId: string, direction: 'up' | 'down') => {
    const current = customOrder.length > 0 ? [...customOrder] : sortedPages.map((p) => p.id);
    const idx = current.indexOf(pageId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[idx];
    current[idx] = current[targetIdx];
    current[targetIdx] = temp;
    updateSettings({ hubPageOrder: current });
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-x' }}
      className="w-full h-full flex flex-col justify-between overflow-hidden select-none p-3 sm:p-5 relative"
    >
      {/* Top Header Strip: Page indicator & Reorder Button - Compact & High Contrast */}
      <div className="shrink-0 flex items-center justify-between pb-1.5 pt-0.5 border-b border-black/10 dark:border-white/10 z-20">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-white/25 dark:bg-black/30 border border-white/30 text-xs shadow-xs">
            <span className="text-slate-700 dark:text-slate-300">{currentPage.icon}</span>
            <span className="font-bold text-slate-900 dark:text-white tracking-wide">{currentPage.title}</span>
            <span className="text-[10px] text-slate-800 dark:text-white font-bold px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/15 font-mono">
              {safeIndex + 1} / {sortedPages.length}
            </span>
          </div>

          <button
            data-focusable="true"
            onClick={() => setIsReorderOpen(!isReorderOpen)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all nowrap-pill shadow-xs ${
              isReorderOpen
                ? 'bg-white/40 border-white/50 text-slate-900 dark:text-white'
                : 'bg-white/20 hover:bg-white/30 border-black/10 dark:border-white/15 text-slate-800 dark:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span className="hidden sm:inline">画面順並替</span>
          </button>
        </div>

        <div className="text-xs font-medium text-slate-700 dark:text-white/80 hidden sm:flex items-center gap-2">
          <span>左右フリックまたは ← → キーでページ送り</span>
        </div>
      </div>

      {/* Page Reorder Drawer */}
      {isReorderOpen && (
        <div className="glass-panel-elevated p-4 sm:p-5 rounded-3xl border border-white/20 space-y-3 animate-fade-in shadow-2xl shrink-0 my-2 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-slate-300" />
              <h3 className="text-xs sm:text-sm font-semibold text-white">スライド画面の表示順序を並び替え</h3>
            </div>
            <button
              data-focusable="true"
              onClick={() => updateSettings({ hubPageOrder: DEFAULT_SMART_DISPLAY_PAGES })}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>初期順に戻す</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
            {sortedPages.map((p, idx) => (
              <div
                key={p.id}
                className="p-2.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between"
              >
                <div className="flex items-center space-x-1.5 truncate pr-1">
                  <span className="text-slate-300">{p.icon}</span>
                  <span className="text-[11px] font-medium text-white truncate">{p.title}</span>
                </div>

                <div className="flex items-center space-x-0.5 shrink-0">
                  <button
                    data-focusable="true"
                    disabled={idx === 0}
                    onClick={() => handleMovePage(p.id, 'up')}
                    className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-20 text-white"
                    title="前へ"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    data-focusable="true"
                    disabled={idx === sortedPages.length - 1}
                    onClick={() => handleMovePage(p.id, 'down')}
                    className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-20 text-white"
                    title="次へ"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Single Page Viewport - Strict ZERO VERTICAL SCROLL */}
      <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col justify-center items-center py-2 relative animate-fade-in">
        {currentPage.render()}
      </div>

      {/* Bottom Smart Display Dock Navigation */}
      <div className="shrink-0 pt-2 flex items-center justify-between text-xs z-20">
        <button
          data-focusable="true"
          onClick={goToPrevPage}
          className="p-2 rounded-2xl glass-panel hover:bg-white/20 text-white/80 hover:text-white transition-all shadow-sm"
          title="前の画面 (←)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Interactive Page Dot Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[70vw] px-2 py-1">
          {sortedPages.map((page, idx) => {
            const isActive = idx === safeIndex;
            return (
              <button
                key={page.id}
                data-focusable="true"
                onClick={() => {
                  SynthEngine.playClick(0.15);
                  setActivePageIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-7 sm:w-8 bg-slate-200 dark:bg-white shadow'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                title={page.title}
              />
            );
          })}
        </div>

        <button
          data-focusable="true"
          onClick={goToNextPage}
          className="p-2 rounded-2xl glass-panel hover:bg-white/20 text-white/80 hover:text-white transition-all shadow-sm"
          title="次の画面 (→)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
