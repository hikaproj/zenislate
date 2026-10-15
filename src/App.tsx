/**
 * Zenislate - The Ultimate Ambient Smart Display
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSettingsStore } from './stores/useSettingsStore';
import { useTimerStore } from './stores/useTimerStore';
import { useAlarmStore } from './stores/useAlarmStore';
import { useMediaStore } from './stores/useMediaStore';
import { precisionTimerBridge } from './engines/timer/WorkerBridge';
import { spatialNav } from './engines/navigation/SpatialNavigation';
import { getPlatformBridge } from './platform/PlatformBridge';

import {
  LayoutDashboard,
  Clock,
  Moon,
  Sun,
  BrainCircuit,
  Smartphone,
  Image as ImageIcon,
  FileText,
  Volume2,
  Settings,
  ShoppingBag,
  Tv,
} from 'lucide-react';
import { DisplayMode, SCENIC_WALLPAPERS } from './types';

// 8 Adaptive Modes
import { SmartHubView } from './components/modes/SmartHubView';
import { SmartDisplayView } from './components/modes/SmartDisplayView';
import { AmbientClockView } from './components/modes/AmbientClockView';
import { BedsideNightView } from './components/modes/BedsideNightView';
import { WorkFocusView } from './components/modes/WorkFocusView';
import { MobilePortraitView } from './components/modes/MobilePortraitView';
import { PhotoFrameView } from './components/modes/PhotoFrameView';
import { UltraLightView } from './components/modes/UltraLightView';

// Common Modals & Overlays
import { SettingsModal } from './components/common/SettingsModal';
import { PluginMarketModal } from './components/common/PluginMarketModal';
import { AlarmModal } from './components/common/AlarmModal';
import { SunriseOverlay } from './components/missions/SunriseOverlay';

export const App: React.FC = () => {
  const { settings, setMode, updateSettings, toggleColorScheme } = useSettingsStore();
  const { tickAll } = useTimerStore();
  const { checkAlarms, sunriseAlarm } = useAlarmStore();
  const { setAudioRef } = useMediaStore();

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const audioTagRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Enable TV remote spatial navigation
    spatialNav.enable();

    // Acquire screen wake lock via PlatformBridge
    getPlatformBridge().then((bridge) => {
      bridge.requestWakeLock();
    });

    // Wire up precision worker bridge for timers & alarm checks
    const unsubscribe = precisionTimerBridge.subscribe((timestamp) => {
      tickAll(timestamp);
      checkAlarms(new Date(timestamp));
    });

    // Wire radio audio tag ref
    if (audioTagRef.current) {
      setAudioRef(audioTagRef.current);
    }

    return () => {
      unsubscribe();
      spatialNav.disable();
    };
  }, [tickAll, checkAlarms, setAudioRef]);

  // Ambient Scenic Wallpaper Slideshow Flow
  useEffect(() => {
    if (settings.wallpaperMode !== 'scenic' || !settings.wallpaperSlideshow) return;

    const allUrls = [
      ...SCENIC_WALLPAPERS.map((w) => w.url),
      ...(settings.customPhotos || []).map((p) => p.url),
    ];
    if (allUrls.length === 0) return;

    const intervalMs = (settings.wallpaperIntervalSeconds || 45) * 1000;
    const timer = setInterval(() => {
      const currentIndex = allUrls.indexOf(settings.scenicWallpaperUrl);
      const nextIndex = (currentIndex + 1) % allUrls.length;
      updateSettings({ scenicWallpaperUrl: allUrls[nextIndex] });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [
    settings.wallpaperMode,
    settings.wallpaperSlideshow,
    settings.wallpaperIntervalSeconds,
    settings.scenicWallpaperUrl,
    settings.customPhotos,
    updateSettings,
  ]);

  const handleUnlockAudio = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      ctx.resume().then(() => {
        setAudioUnlocked(true);
      });
    } catch {
      setAudioUnlocked(true);
    }
  };

  const modeButtons: { mode: DisplayMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'smart-hub', label: 'スマートハブ', icon: <LayoutDashboard className="w-4 h-4" /> },
    { mode: 'smart-display', label: 'スマート画面', icon: <Tv className="w-4 h-4" /> },
    { mode: 'ambient-clock', label: 'アンビエント時計', icon: <Clock className="w-4 h-4" /> },
    { mode: 'bedside-night', label: 'ベッドサイド夜間', icon: <Moon className="w-4 h-4" /> },
    { mode: 'work-focus', label: 'ワーク集中', icon: <BrainCircuit className="w-4 h-4" /> },
    { mode: 'mobile-portrait', label: 'モバイル縦型', icon: <Smartphone className="w-4 h-4" /> },
    { mode: 'photo-frame', label: 'フォトフレーム', icon: <ImageIcon className="w-4 h-4" /> },
    { mode: 'ultra-light', label: '白黒省電力', icon: <FileText className="w-4 h-4" /> },
  ];

  // Synchronize <html> root class with color scheme (Tailwind darkMode: 'class')
  useEffect(() => {
    const root = document.documentElement;
    if (settings.colorScheme === 'dark' || settings.mode === 'bedside-night') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [settings.colorScheme, settings.mode]);

  const getModeClass = () => {
    const fontClass = `font-${settings.fontFamily || 'sans'}-pref`;
    const scaleClass = `ui-scale-${settings.uiScale || 'standard'}`;
    const isDark = settings.colorScheme === 'dark' || settings.mode === 'bedside-night';
    const colorSchemeClass = isDark ? 'dark color-scheme-dark' : 'light color-scheme-light';
    if (settings.mode === 'ultra-light') return `mode-ultra-light bg-[#fdfdfc] text-black ${fontClass} ${scaleClass}`;
    if (settings.mode === 'bedside-night') return `mode-bedside-night bg-black text-[#ff9900] ${fontClass} ${scaleClass} dark`;
    return `theme-${settings.backgroundTheme || 'aurora'} ${fontClass} ${scaleClass} ${colorSchemeClass}`;
  };

  const renderActiveMode = () => {
    switch (settings.mode) {
      case 'smart-hub':
        return <SmartHubView />;
      case 'smart-display':
        return <SmartDisplayView />;
      case 'ambient-clock':
        return <AmbientClockView />;
      case 'bedside-night':
        return <BedsideNightView />;
      case 'work-focus':
        return <WorkFocusView />;
      case 'mobile-portrait':
        return <MobilePortraitView />;
      case 'photo-frame':
        return <PhotoFrameView />;
      case 'ultra-light':
        return <UltraLightView />;
      default:
        return <SmartHubView />;
    }
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col relative select-none transition-colors duration-500 overflow-hidden ${
        settings.tvSafeMargin ? 'p-4 md:p-8' : ''
      } ${getModeClass()}`}
    >
      {/* Hidden Audio Tag for Streaming Internet Radio */}
      <audio ref={audioTagRef} preload="none" />

      {/* Autoplay unlock prompt modal if not interacted */}
      {!audioUnlocked && (
        <div
          onClick={handleUnlockAudio}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div className="glass-panel-elevated p-8 rounded-3xl max-w-md mx-4 text-center border border-white/20 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg animate-bounce">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white mb-2">Zenislate へようこそ</h2>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              常時稼働アラーム・環境音ミキサー・音声合成をフル機能で動作させるため、画面をタップして開始してください。
            </p>
            <button
              data-focusable="true"
              className="w-full py-3.5 px-6 rounded-2xl bg-white/20 hover:bg-white/30 font-semibold text-white shadow-lg border border-white/20 transition-all transform active:scale-95"
            >
              タップして起動する
            </button>
            <p className="mt-4 text-xs text-white/50">Created by Hikaproj • 100% Free & Open Source</p>
          </div>
        </div>
      )}

      {/* Scenic Photographic Landscape Wallpaper with Ambient Flow */}
      {settings.wallpaperMode === 'scenic' && settings.mode !== 'ultra-light' && settings.mode !== 'bedside-night' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={settings.scenicWallpaperUrl}
            alt="Scenic Background"
            className="w-full h-full object-cover transition-all duration-1000 ease-out"
            style={{
              filter: settings.wallpaperBlur ? `blur(${settings.wallpaperBlur}px)` : 'none',
              transform: settings.wallpaperBlur ? 'scale(1.08)' : 'scale(1)',
            }}
          />
          {/* Subtle Contrast Dimming Overlay tuned for Light or Dark mode */}
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              backgroundColor:
                settings.colorScheme === 'light'
                  ? `rgba(255, 255, 255, ${Math.max(20, Math.min(45, (settings.wallpaperDim ?? 35) * 0.7)) / 100})`
                  : `rgba(2, 6, 23, ${Math.max(40, settings.wallpaperDim ?? 50) / 100})`,
            }}
          />
        </div>
      )}

      {/* Floating Ambient Glow Orbs (Only in theme mode) */}
      {settings.wallpaperMode === 'theme' && settings.ambientParticles && settings.mode !== 'ultra-light' && settings.mode !== 'bedside-night' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="ambient-orb-1 absolute top-10 left-10 w-96 h-96 rounded-full bg-sky-500/10 blur-[100px]" />
          <div className="ambient-orb-2 absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
          <div className="ambient-orb-3 absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-emerald-500/8 blur-[90px]" />
        </div>
      )}

      {/* Top Ambient Bar (Hidden in BedsideNight and PhotoFrame) - True Frosted Glass & Crisp Dual-Mode Typography */}
      {settings.mode !== 'bedside-night' && settings.mode !== 'photo-frame' && (
        <header className="px-3 sm:px-5 py-2 flex items-center justify-between z-20 shrink-0 border-b border-black/5 dark:border-white/10 backdrop-blur-2xl bg-white/70 dark:bg-slate-950/70 shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-slate-900 text-white dark:bg-white/20 dark:text-white border border-slate-700 dark:border-white/30 backdrop-blur-xl flex items-center justify-center font-bold text-xs shadow-xs">
              Z
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Zenislate
                <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                  v1.0
                </span>
              </h1>
            </div>
          </div>

          {/* Mode Selector Tabs (Glassy, Crisp High-Contrast) */}
          <nav className="flex items-center space-x-1 p-1 rounded-2xl bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-black/5 dark:border-white/10 overflow-x-auto max-w-xl">
            {modeButtons.map((btn) => (
              <button
                key={btn.mode}
                data-focusable="true"
                onClick={() => setMode(btn.mode)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  settings.mode === btn.mode
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-white/25 dark:text-white dark:border dark:border-white/30'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                {btn.icon}
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Header Action Buttons */}
          <div className="flex items-center space-x-1">
            {/* Light / Dark Mode Toggle */}
            <button
              data-focusable="true"
              onClick={toggleColorScheme}
              aria-label={settings.colorScheme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替'}
              className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
              title={settings.colorScheme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替'}
            >
              {settings.colorScheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Hub Market / Community Plugins Button */}
            <button
              data-focusable="true"
              onClick={() => setIsMarketOpen(true)}
              aria-label="プラグインマーケット"
              className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
              title="有志プラグイン & ウィジェット追加"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>

            {/* Settings Button */}
            <button
              data-focusable="true"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="設定"
              className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Floating Mode Switcher for BedsideNight & PhotoFrame */}
      {(settings.mode === 'bedside-night' || settings.mode === 'photo-frame') && (
        <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
          <button
            data-focusable="true"
            onClick={() => setMode('smart-hub')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs transition-colors border border-white/10"
          >
            ハブへ戻る
          </button>
          <button
            data-focusable="true"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="設定"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors border border-white/10"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Mode View Container */}
      <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
        {renderActiveMode()}
      </main>

      {/* Active Alarm Modal */}
      <AlarmModal />

      {/* Sunrise Overlay (If active before alarm) */}
      {sunriseAlarm && (
        <SunriseOverlay onDismiss={() => useAlarmStore.setState({ sunriseAlarm: null })} />
      )}

      {/* Software Brightness Dimmer Overlay */}
      {settings.screenBrightness < 100 && (
        <div
          className="fixed inset-0 pointer-events-none z-40 bg-black transition-opacity duration-300"
          style={{ opacity: (100 - settings.screenBrightness) / 100 }}
        />
      )}

      {/* Plugin Market Modal */}
      <PluginMarketModal
        isOpen={isMarketOpen}
        onClose={() => setIsMarketOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
