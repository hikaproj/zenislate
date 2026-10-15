/**
 * Zenislate - The Ultimate Ambient Smart Hub Dashboard (Classic Bento Grid Mode)
 * Full vertically scrollable bento dashboard with category filtering, widget reordering,
 * scenic wallpaper drawer, and 100% Lucide SVG icons (zero emojis).
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState } from 'react';
import { useSettingsStore, defaultVisibleWidgets } from '../../stores/useSettingsStore';
import { SCENIC_WALLPAPERS, DEFAULT_WIDGET_ORDER } from '../../types';

// Layout & Hero Timepiece
import { HeroClockBanner } from '../layout/HeroClockBanner';

// 13 Native Widgets
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

// Community Market Modal
import { PluginMarketModal } from '../common/PluginMarketModal';

import {
  SlidersHorizontal,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Radio,
  Timer,
  Bell,
  LayoutGrid,
  Image as ImageIcon,
  Check,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Zap,
  CloudSun,
  Hourglass,
  Target,
  CloudRain,
  Wind,
  Calendar,
  Newspaper,
  FileText,
  Calculator,
  Coins,
  Coffee,
  Sparkles,
  AppWindow,
} from 'lucide-react';

type CategoryFilter = 'all' | 'time' | 'audio' | 'life' | 'plugins';

interface WidgetDef {
  id: string;
  name: string;
  category: 'time' | 'audio' | 'life' | 'plugins';
  icon: React.ReactNode;
  component: React.ReactNode;
}

export const SmartHubView: React.FC = () => {
  const {
    settings,
    toggleWidgetVisibility,
    updateSettings,
    reorderWidgets,
  } = useSettingsStore();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isWallpaperDrawerOpen, setIsWallpaperDrawerOpen] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);

  const visibleMap = settings.visibleWidgets || defaultVisibleWidgets;
  const widgetOrder = settings.widgetOrder || DEFAULT_WIDGET_ORDER;

  // Custom Iframe Embed Plugins Renderer
  const renderEmbedPlugin = (id: string, name: string, url: string) => (
    <div key={id} className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
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

  // All Available Widgets Registry (100% SVG Icons, Zero Emojis)
  const baseWidgets: WidgetDef[] = [
    { id: 'system', name: '端末ステータス・通信監視', category: 'life', icon: <Zap className="w-4 h-4 text-amber-300" />, component: <SystemStatusWidget /> },
    { id: 'photo-frame', name: 'フォトフレーム & 写真', category: 'life', icon: <ImageIcon className="w-4 h-4 text-sky-300" />, component: <PhotoFrameWidget /> },
    { id: 'weather', name: '気象観測 & 週間予報', category: 'life', icon: <CloudSun className="w-4 h-4 text-amber-300" />, component: <WeatherWidget /> },
    { id: 'alarm', name: 'アラーム管理センター', category: 'time', icon: <Bell className="w-4 h-4 text-rose-300" />, component: <AlarmManagerWidget /> },
    { id: 'pomodoro', name: 'ポモドーロ集中タイマー', category: 'time', icon: <Timer className="w-4 h-4 text-red-300" />, component: <PomodoroWidget /> },
    { id: 'timer', name: 'マルチカウントダウン', category: 'time', icon: <Hourglass className="w-4 h-4 text-indigo-300" />, component: <TimerWidget /> },
    { id: 'stopwatch', name: '高精度ストップウォッチ', category: 'time', icon: <Timer className="w-4 h-4 text-emerald-300" />, component: <StopwatchWidget /> },
    { id: 'countdown', name: '目標日カウントダウン', category: 'time', icon: <Target className="w-4 h-4 text-cyan-300" />, component: <CountdownWidget eventTitle="新年カウントダウン" /> },
    { id: 'mixer', name: '環境音ミキサー', category: 'audio', icon: <CloudRain className="w-4 h-4 text-sky-300" />, component: <AudioMixerWidget /> },
    { id: 'radio', name: 'ネットラジオ', category: 'audio', icon: <Radio className="w-4 h-4 text-violet-300" />, component: <RadioWidget /> },
    { id: 'breathing', name: 'マインドフルネス呼吸', category: 'audio', icon: <Wind className="w-4 h-4 text-teal-300" />, component: <BreathingWidget /> },
    { id: 'calendar', name: '暦・祝日カレンダー', category: 'life', icon: <Calendar className="w-4 h-4 text-blue-300" />, component: <CalendarWidget /> },
    { id: 'news', name: '最新ニュース & RSS', category: 'life', icon: <Newspaper className="w-4 h-4 text-slate-300" />, component: <NewsWidget /> },
    { id: 'memo', name: '付箋メモパッド', category: 'life', icon: <FileText className="w-4 h-4 text-amber-300" />, component: <MemoWidget /> },
    { id: 'calculator', name: 'スマート電卓', category: 'life', icon: <Calculator className="w-4 h-4 text-slate-300" />, component: <CalculatorWidget /> },
    { id: 'zen-proverbs', name: '日々の禅語・心の調律', category: 'plugins', icon: <Sparkles className="w-4 h-4 text-emerald-300" />, component: <ZenProverbsWidget /> },
    { id: 'crypto-rates', name: '暗号資産 & 為替レート', category: 'plugins', icon: <Coins className="w-4 h-4 text-yellow-300" />, component: <CryptoRatesWidget /> },
    { id: 'tea-master', name: '至高の茶・珈琲タイマー', category: 'plugins', icon: <Coffee className="w-4 h-4 text-orange-300" />, component: <TeaMasterWidget /> },
  ];

  // Dynamically include any custom webview plugins added by user
  (settings.installedPlugins || []).forEach((p) => {
    if (p.embedUrl && p.installed && !baseWidgets.some((bw) => bw.id === p.id)) {
      baseWidgets.push({
        id: p.id,
        name: p.name,
        category: 'plugins',
        icon: <AppWindow className="w-4 h-4 text-slate-300" />,
        component: renderEmbedPlugin(p.id, p.name, p.embedUrl),
      });
    }
  });

  // Reorder baseWidgets according to widgetOrder
  const sortedWidgets = [...baseWidgets].sort((a, b) => {
    const idxA = widgetOrder.indexOf(a.id);
    const idxB = widgetOrder.indexOf(b.id);
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  });

  const displayedWidgets = sortedWidgets.filter((w) => {
    const isVisible = visibleMap[w.id] !== false;
    if (!isVisible) return false;
    if (activeCategory === 'all') return true;
    return w.category === activeCategory;
  });

  const handleMoveWidget = (id: string, direction: 'up' | 'down') => {
    const current = [...widgetOrder];
    const idx = current.indexOf(id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[idx];
    current[idx] = current[targetIdx];
    current[targetIdx] = temp;
    reorderWidgets(current);
  };

  const handleToggleAllWidgets = (show: boolean) => {
    const updated: Record<string, boolean> = {};
    baseWidgets.forEach((w) => {
      updated[w.id] = show;
    });
    updateSettings({ visibleWidgets: updated });
  };

  const categories: { key: CategoryFilter; label: string; count: number }[] = [
    { key: 'all', label: 'すべて', count: sortedWidgets.filter((w) => visibleMap[w.id] !== false).length },
    { key: 'time', label: '時間・タイマー', count: sortedWidgets.filter((w) => w.category === 'time' && visibleMap[w.id] !== false).length },
    { key: 'audio', label: '音楽・環境音', count: sortedWidgets.filter((w) => w.category === 'audio' && visibleMap[w.id] !== false).length },
    { key: 'life', label: '生活・情報', count: sortedWidgets.filter((w) => w.category === 'life' && visibleMap[w.id] !== false).length },
    { key: 'plugins', label: '有志アプリ', count: sortedWidgets.filter((w) => w.category === 'plugins' && visibleMap[w.id] !== false).length },
  ];

  return (
    <div className="w-full h-full overflow-y-auto select-none p-3 sm:p-4 space-y-2.5">
      {/* 1. Sleek Compact Hero Clock Banner (Low-profile, zero vertical bloat) */}
      <HeroClockBanner compact={true} />

      {/* 2. Top Action Strip: Categories, Wallpaper, Market, Customizer */}
      <div className="flex items-center justify-between pb-0.5">
        <div className="flex items-center space-x-2">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.key}
                data-focusable="true"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all nowrap-pill font-bold backdrop-blur-md ${
                  activeCategory === cat.key
                    ? 'bg-slate-900 text-white dark:bg-white/25 dark:text-white border-transparent dark:border-white/30 shadow-xs'
                    : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border-black/5 dark:border-white/15 text-slate-800 dark:text-white/90'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] font-mono opacity-80">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Scenic Landscape Wallpaper Drawer Toggle */}
          <button
            data-focusable="true"
            onClick={() => {
              setIsWallpaperDrawerOpen(!isWallpaperDrawerOpen);
              setIsCustomizing(false);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-all nowrap-pill ${
              isWallpaperDrawerOpen
                ? 'bg-slate-900 text-white dark:bg-white/25 dark:text-white border-transparent dark:border-white/30 shadow-xs'
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 border-black/5 dark:border-white/15 text-slate-800 dark:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">風景背景</span>
          </button>

          {/* App Store Trigger */}
          <button
            data-focusable="true"
            onClick={() => setIsMarketOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border border-black/5 dark:border-white/15 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white backdrop-blur-md transition-all nowrap-pill"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">アプリストア</span>
          </button>

          {/* Customizer Drawer Toggle */}
          <button
            data-focusable="true"
            onClick={() => {
              setIsCustomizing(!isCustomizing);
              setIsWallpaperDrawerOpen(false);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-all nowrap-pill ${
              isCustomizing
                ? 'bg-slate-900 text-white dark:bg-white/25 dark:text-white border-transparent dark:border-white/30 shadow-xs'
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 border-black/5 dark:border-white/15 text-slate-800 dark:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isCustomizing ? '完了' : '配置・並替'}</span>
          </button>
        </div>
      </div>

      {/* 3. Scenic Wallpaper Drawer */}
      {isWallpaperDrawerOpen && (
        <div className="glass-panel-elevated p-4 sm:p-5 rounded-3xl border border-white/20 space-y-3 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 opacity-80" />
              <h3 className="text-xs sm:text-sm font-semibold text-white">風景写真スライドショー & 壁紙</h3>
            </div>
            <button
              data-focusable="true"
              onClick={() =>
                updateSettings({
                  wallpaperSlideshow: !settings.wallpaperSlideshow,
                })
              }
              className={`flex items-center space-x-1 px-3 py-1 rounded-full border transition-all text-xs ${
                settings.wallpaperSlideshow
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/10 opacity-70 border-white/15 text-white'
              }`}
            >
              {settings.wallpaperSlideshow ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>自動巡回: {settings.wallpaperSlideshow ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {SCENIC_WALLPAPERS.map((wp) => {
              const isSelected =
                settings.wallpaperMode === 'scenic' && settings.scenicWallpaperUrl === wp.url;
              return (
                <button
                  key={wp.id}
                  data-focusable="true"
                  onClick={() =>
                    updateSettings({
                      wallpaperMode: 'scenic',
                      scenicWallpaperUrl: wp.url,
                    })
                  }
                  className={`group relative rounded-xl overflow-hidden aspect-[16/10] border text-left transition-all ${
                    isSelected
                      ? 'ring-2 ring-white border-white shadow-lg'
                      : 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={wp.thumbnail}
                    alt={wp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 flex flex-col justify-end">
                    <span className="text-[10px] font-semibold text-white truncate leading-tight">
                      {wp.title}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-white text-black flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Widget Customizer & Reorder Drawer */}
      {isCustomizing && (
        <div className="glass-panel-elevated p-4 sm:p-5 rounded-3xl border border-white/20 space-y-3 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LayoutGrid className="w-4 h-4 text-slate-300" />
              <h3 className="text-xs sm:text-sm font-semibold text-white">ウィジェットの並び替え & 表示切替</h3>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <button
                data-focusable="true"
                onClick={() => handleToggleAllWidgets(true)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-colors text-white"
              >
                すべて表示
              </button>
              <button
                data-focusable="true"
                onClick={() =>
                  updateSettings({
                    visibleWidgets: defaultVisibleWidgets,
                    widgetOrder: DEFAULT_WIDGET_ORDER,
                  })
                }
                className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
              >
                <RotateCcw className="w-3 h-3" />
                <span>初期配置へ戻す</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-1 max-h-64 overflow-y-auto pr-1">
            {sortedWidgets.map((w, idx) => {
              const isChecked = visibleMap[w.id] !== false;
              return (
                <div
                  key={w.id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                    isChecked
                      ? 'bg-white/15 border-white/30 shadow-sm'
                      : 'bg-white/5 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0 pr-1">
                    <span className="text-slate-300">{w.icon}</span>
                    <span className="text-xs font-medium truncate text-white">{w.name}</span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      data-focusable="true"
                      disabled={idx === 0}
                      onClick={() => handleMoveWidget(w.id, 'up')}
                      className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-20 transition-colors text-white"
                      title="上へ"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      data-focusable="true"
                      disabled={idx === sortedWidgets.length - 1}
                      onClick={() => handleMoveWidget(w.id, 'down')}
                      className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-20 transition-colors text-white"
                      title="下へ"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      data-focusable="true"
                      onClick={() => toggleWidgetVisibility(w.id)}
                      className="p-1 rounded-lg hover:bg-white/20 transition-colors ml-1"
                      title={isChecked ? '非表示にする' : '表示する'}
                    >
                      {isChecked ? (
                        <Eye className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 opacity-40 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr items-stretch pb-8">
        {displayedWidgets.map((w) => (
          <div key={w.id} className="w-full h-full flex flex-col justify-between animate-fade-in">
            {w.component}
          </div>
        ))}
      </div>

      {/* Plugin Market Modal */}
      <PluginMarketModal
        isOpen={isMarketOpen}
        onClose={() => setIsMarketOpen(false)}
      />
    </div>
  );
};
