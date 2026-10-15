/**
 * Zenislate - Modern Control Center Settings
 * Frosted glass architecture, Scenic Landscape Wallpapers, Widget Manager, and Android Launcher Config
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState } from 'react';
import { useSettingsStore, defaultVisibleWidgets } from '../../stores/useSettingsStore';
import {
  X,
  Clock,
  Palette,
  MapPin,
  Volume2,
  Server,
  Database,
  Download,
  Upload,
  RotateCcw,
  LayoutGrid,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Check,
  Smartphone,
  Settings,
  Boxes,
  Plus,
  Trash2,
  Radio,
  Newspaper,
  Image as ImageIcon,
  Store,
} from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';
import {
  BackgroundTheme,
  FontFamily,
  UiScale,
  WidgetId,
  SCENIC_WALLPAPERS,
  ColorScheme,
  RadioStation,
  CustomPhoto,
  CustomRssFeed,
  CommunityPlugin,
} from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = 'display' | 'themes' | 'widgets' | 'addons' | 'weather' | 'audio' | 'proxy' | 'data';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    settings,
    updateSettings,
    resetSettings,
    toggleWidgetVisibility,
    togglePlugin,
    installPlugin,
    uninstallPlugin,
    addCustomPhoto,
    removeCustomPhoto,
    addCustomStation,
    removeCustomStation,
    addCustomRssFeed,
    removeCustomRssFeed,
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<TabKey>('display');

  // Sub-forms for Addons
  const [newPluginName, setNewPluginName] = useState('');
  const [newPluginUrl, setNewPluginUrl] = useState('');
  const [newStationName, setNewStationName] = useState('');
  const [newStationUrl, setNewStationUrl] = useState('');
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  if (!isOpen) return null;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'display', label: '時計・表示', icon: <Clock className="w-4 h-4" /> },
    { key: 'themes', label: '背景・壁紙', icon: <Palette className="w-4 h-4" /> },
    { key: 'widgets', label: 'ウィジェット配置', icon: <LayoutGrid className="w-4 h-4" /> },
    { key: 'addons', label: 'アプリ & メディア', icon: <Boxes className="w-4 h-4" /> },
    { key: 'weather', label: '気象・都市', icon: <MapPin className="w-4 h-4" /> },
    { key: 'audio', label: '音響・調律', icon: <Volume2 className="w-4 h-4" /> },
    { key: 'proxy', label: 'CGI・通信', icon: <Server className="w-4 h-4" /> },
    { key: 'data', label: '端末・データ', icon: <Database className="w-4 h-4" /> },
  ];

  const themePresets: {
    key: BackgroundTheme;
    title: string;
    desc: string;
    gradient: string;
  }[] = [
    {
      key: 'graphite-slate',
      title: 'グラファイト・スレート',
      desc: '高級感と統一感のある洗練されたダークチタングレー',
      gradient: 'from-slate-700 via-zinc-800 to-slate-950',
    },
    {
      key: 'titanium-gray',
      title: 'チタニウム・グレー',
      desc: 'つや消し金属のようなミニマルで無彩色なスレート',
      gradient: 'from-zinc-600 via-slate-700 to-zinc-900',
    },
    {
      key: 'aurora',
      title: 'オーロラ (Aurora)',
      desc: '北極光を想起させるシアンとバイオレットの光彩',
      gradient: 'from-sky-500 via-indigo-500 to-emerald-500',
    },
    {
      key: 'tokyo-night',
      title: 'トーキョー・ナイト',
      desc: '夜のサイバーシティをイメージしたディープブルー',
      gradient: 'from-blue-600 via-indigo-600 to-purple-800',
    },
    {
      key: 'warm-amber',
      title: 'ウォーム・アンバー',
      desc: '暖炉や夜桜のような心地よい琥珀とワインレッド',
      gradient: 'from-amber-600 via-orange-600 to-rose-700',
    },
    {
      key: 'zen-emerald',
      title: 'ゼン・エメラルド',
      desc: '朝露の竹林と苔庭のような深いエメラルドグリーン',
      gradient: 'from-emerald-600 via-teal-700 to-slate-900',
    },
    {
      key: 'deep-space',
      title: 'ディープ・スペース',
      desc: '静寂な星空と星雲を思わせるミニマルダーク',
      gradient: 'from-indigo-950 via-slate-900 to-black',
    },
    {
      key: 'oled-black',
      title: 'OLED 完全漆黒',
      desc: '発光素子を完全消灯する省電力・漆黒モード',
      gradient: 'from-black to-zinc-950',
    },
  ];

  const allWidgetList: { id: WidgetId; name: string; desc: string; category: string }[] = [
    { id: 'system', name: '端末ステータス・通信監視', desc: '通信レイテンシ、稼働時間、バッテリー、調光', category: '生活' },
    { id: 'photo-frame', name: 'フォトフレーム & 写真', desc: 'ユーザー写真アップロードとデジタル写真立て', category: '生活' },
    { id: 'weather', name: '気象観測 & 週間予報', desc: '現在気温、湿度、風速、5日間予報', category: '生活' },
    { id: 'alarm', name: 'アラーム管理センター', desc: '朝の目覚ましアラームと解除ミッション', category: '時間' },
    { id: 'pomodoro', name: 'ポモドーロ集中タイマー', desc: '25分作業 / 5分小休憩の反復サイクル', category: '時間' },
    { id: 'timer', name: 'マルチカウントダウン', desc: '料理や作業用の複数同時タイマー', category: '時間' },
    { id: 'stopwatch', name: '高精度ストップウォッチ', desc: '1/100秒カウンターとラップタイム記録', category: '時間' },
    { id: 'countdown', name: '目標日カウントダウン', desc: '記念日や新年への日数・時・分・秒', category: '時間' },
    { id: 'breathing', name: '4-7-8 呼吸ガイド', desc: '深呼吸アニメーションとリラクゼーション', category: '音響' },
    { id: 'mixer', name: '環境音ミキサー', desc: '雨、波、焚き火、白雑音のプロシージャル合成', category: '音響' },
    { id: 'radio', name: 'ネットラジオ', desc: 'Radio-Browser & カスタム音声ストリーム', category: '音響' },
    { id: 'calendar', name: '暦・祝日カレンダー', desc: '日本の国民の祝日と月間カレンダー', category: '生活' },
    { id: 'news', name: '最新ニュース & RSS', desc: 'カスタムRSS・マルチプロキシ経由のヘッドライン', category: '生活' },
    { id: 'memo', name: '付箋メモパッド', desc: 'Markdown対応のカラー付箋メモ', category: '生活' },
    { id: 'calculator', name: 'スマート電卓', desc: 'リモコンD-Pad対応のシンプル電卓', category: '生活' },
  ];

  const cityPresets = [
    { name: '東京都', lat: 35.6895, lon: 139.6917 },
    { name: '大阪市', lat: 34.6937, lon: 135.5023 },
    { name: '名古屋市', lat: 35.1815, lon: 136.9066 },
    { name: '札幌市', lat: 43.0618, lon: 141.3545 },
    { name: '福岡市', lat: 33.5904, lon: 130.4017 },
    { name: '仙台市', lat: 38.2682, lon: 140.8694 },
    { name: '広島市', lat: 34.3853, lon: 132.4553 },
    { name: '那覇市', lat: 26.2124, lon: 127.6809 },
    { name: 'ニューヨーク', lat: 40.7128, lon: -74.006 },
    { name: 'ロンドン', lat: 51.5074, lon: -0.1278 },
    { name: 'パリ', lat: 48.8566, lon: 2.3522 },
  ];

  const visibleMap = settings.visibleWidgets || defaultVisibleWidgets;

  const handleExport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(settings, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `zenislate-settings-${Date.now()}.json`);
    dlAnchor.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        updateSettings(json);
        alert('設定を正常にインポートしました。');
      } catch {
        alert('無効な設定JSONファイルです。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-2xl p-2 sm:p-6 overflow-y-auto animate-fade-in select-none">
      <div className="glass-panel-elevated w-full max-w-4xl h-[92vh] max-h-[820px] my-auto rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-500/10 border border-slate-500/20 backdrop-blur-md flex items-center justify-center font-bold text-slate-300 shadow-sm">
              <Settings className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-white">
                環境設定コントロールセンター
              </h2>
              <p className="text-[11px] text-white/50">Zenislate System Preferences • Created by Hikaproj</p>
            </div>
          </div>

          <button
            data-focusable="true"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Layout: Left Sidebar + Right Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Navigation Sidebar */}
          <nav className="w-full md:w-56 p-3 md:p-4 border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0 bg-black/20">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                data-focusable="true"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all whitespace-nowrap text-left ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white shadow-sm border border-white/20 backdrop-blur-md font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Content Area */}
          <main className="flex-1 p-5 md:p-6 overflow-y-auto space-y-6">
            {/* Tab: Clock & Display */}
            {activeTab === 'display' && (
              <div className="space-y-6 animate-fade-in">
                {/* Color Scheme Selector */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">外観カラースキーム (Color Scheme)</h3>
                  <p className="text-xs text-white/60 mb-3">昼光フロストガラス（既定：ライト）または漆黒のダークモードを選択します。</p>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'light', label: 'ライト (既定)', icon: <Sun className="w-4 h-4 text-amber-300" /> },
                      { key: 'dark', label: 'ダーク', icon: <Moon className="w-4 h-4 text-sky-300" /> },
                      { key: 'auto', label: '自動 (時間連動)', icon: <Clock className="w-4 h-4 text-emerald-300" /> },
                    ].map((cs) => (
                      <button
                        key={cs.key}
                        data-focusable="true"
                        onClick={() => updateSettings({ colorScheme: cs.key as ColorScheme })}
                        className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl border text-xs font-medium transition-all ${
                          (settings.colorScheme || 'light') === cs.key
                            ? 'bg-white/20 text-white border-white/40 shadow-sm font-semibold'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        {cs.icon}
                        <span>{cs.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clock Formatting Options */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-1">時計の表示形式</h3>
                  <p className="text-xs text-white/60 mb-3">時刻の表記方法と秒針のアニメーションを設定します。</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      data-focusable="true"
                      onClick={() => updateSettings({ use24Hour: !settings.use24Hour })}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 flex items-center justify-between text-left transition-all"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">24時間表記</div>
                        <div className="text-[11px] text-white/50">例: 14:30 または 2:30 PM</div>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${settings.use24Hour ? 'bg-white/90' : 'bg-white/20'}`}>
                        <div className={`w-5 h-5 rounded-full ${settings.use24Hour ? 'bg-slate-900 translate-x-4' : 'bg-white'} transition-transform`} />
                      </div>
                    </button>

                    <button
                      data-focusable="true"
                      onClick={() => updateSettings({ showSeconds: !settings.showSeconds })}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 flex items-center justify-between text-left transition-all"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">秒表示のトグル</div>
                        <div className="text-[11px] text-white/50">デジタル時計に秒数を表示</div>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${settings.showSeconds ? 'bg-white/90' : 'bg-white/20'}`}>
                        <div className={`w-5 h-5 rounded-full ${settings.showSeconds ? 'bg-slate-900 translate-x-4' : 'bg-white'} transition-transform`} />
                      </div>
                    </button>

                    <button
                      data-focusable="true"
                      onClick={() => updateSettings({ showMilliseconds: !settings.showMilliseconds })}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 flex items-center justify-between text-left transition-all"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">ミリ秒表示</div>
                        <div className="text-[11px] text-white/50">高精度な1/100秒カウンター</div>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${settings.showMilliseconds ? 'bg-white/90' : 'bg-white/20'}`}>
                        <div className={`w-5 h-5 rounded-full ${settings.showMilliseconds ? 'bg-slate-900 translate-x-4' : 'bg-white'} transition-transform`} />
                      </div>
                    </button>

                    <button
                      data-focusable="true"
                      onClick={() => updateSettings({ clockType: settings.clockType === 'digital' ? 'analog' : 'digital' })}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 flex items-center justify-between text-left transition-all"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">アナログ時計モード</div>
                        <div className="text-[11px] text-white/50">スムーススイープ秒針の文字盤</div>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${settings.clockType === 'analog' ? 'bg-white/90' : 'bg-white/20'}`}>
                        <div className={`w-5 h-5 rounded-full ${settings.clockType === 'analog' ? 'bg-slate-900 translate-x-4' : 'bg-white'} transition-transform`} />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Typography & Font Choice */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-1">フォント・タイポグラフィ</h3>
                  <p className="text-xs text-white/60 mb-3">UI全体の書体を選択します。</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'sans', name: 'Zen Modern Sans', desc: '美しく視認性の高い幾何学サンセリフ' },
                      { key: 'mono', name: 'Minimal Tech Mono', desc: 'サイバー感のある等幅テックフォント' },
                      { key: 'serif', name: 'Elegance 明朝 Serif', desc: '伝統的で優美な明朝体・セリフ' },
                    ].map((f) => (
                      <button
                        key={f.key}
                        data-focusable="true"
                        onClick={() => updateSettings({ fontFamily: f.key as FontFamily })}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          (settings.fontFamily || 'sans') === f.key
                            ? 'bg-white/15 border-white text-white font-semibold shadow-sm'
                            : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">{f.name}</span>
                          {(settings.fontFamily || 'sans') === f.key && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className="text-[11px] text-white/50">{f.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* UI Scale & Software Dimmer */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-1">表示スケール & 画面の明るさ</h3>
                  <p className="text-xs text-white/60 mb-3">テレビやタブレットの視聴距離に合わせてサイズと輝度を微調整します。</p>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { key: 'compact', label: 'コンパクト (92%)' },
                      { key: 'standard', label: '標準 (100%)' },
                      { key: 'large', label: '大型・TV向け (110%)' },
                    ].map((s) => (
                      <button
                        key={s.key}
                        data-focusable="true"
                        onClick={() => updateSettings({ uiScale: s.key as UiScale })}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                          (settings.uiScale || 'standard') === s.key
                            ? 'bg-white/20 text-white border-white/30 shadow-sm'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Brightness Dimmer */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/80 font-medium flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-amber-300" />
                        ソフトウェア輝度調光 (Dimmer)
                      </span>
                      <span className="font-mono text-white/80">{settings.screenBrightness || 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={settings.screenBrightness || 100}
                      onChange={(e) => updateSettings({ screenBrightness: parseInt(e.target.value, 10) })}
                      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="text-[10px] text-white/50">
                      夜間ベッドサイドや暗い部屋での眩しさを抑える黒マスク調光です。
                    </div>
                  </div>
                </div>

                {/* TV Safe Margin */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    data-focusable="true"
                    onClick={() => updateSettings({ tvSafeMargin: !settings.tvSafeMargin })}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between w-full text-left"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">TV Safe Margin (オーバースキャン保護)</div>
                      <div className="text-[11px] text-white/50">画面外周にセーフエリアパディングを確保</div>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${settings.tvSafeMargin ? 'bg-white/90' : 'bg-white/20'}`}>
                      <div className={`w-5 h-5 rounded-full ${settings.tvSafeMargin ? 'bg-slate-900 translate-x-4' : 'bg-white'} transition-transform`} />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Themes & Scenic Wallpapers */}
            {activeTab === 'themes' && (
              <div className="space-y-6 animate-fade-in">
                {/* Wallpaper Mode Toggle */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div>
                    <h3 className="text-sm font-semibold text-white">背景表示モード</h3>
                    <p className="text-xs text-white/60">風景写真壁紙またはグラデーションから選択できます。</p>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/10 border border-white/15">
                    <button
                      data-focusable="true"
                      onClick={() => updateSettings({ wallpaperMode: 'scenic' })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        settings.wallpaperMode === 'scenic'
                          ? 'bg-white/25 text-white font-semibold shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      風景画壁紙
                    </button>
                    <button
                      data-focusable="true"
                      onClick={() => updateSettings({ wallpaperMode: 'theme' })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        settings.wallpaperMode === 'theme'
                          ? 'bg-white/25 text-white font-semibold shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      グラデーション
                    </button>
                  </div>
                </div>

                {/* Scenic Wallpapers Gallery */}
                {settings.wallpaperMode === 'scenic' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {SCENIC_WALLPAPERS.map((wp) => {
                        const isSelected = settings.scenicWallpaperUrl === wp.url;
                        return (
                          <button
                            key={wp.id}
                            data-focusable="true"
                            onClick={() => updateSettings({ scenicWallpaperUrl: wp.url })}
                            className={`group relative rounded-2xl overflow-hidden aspect-[16/10] border text-left transition-all ${
                              isSelected
                                ? 'ring-2 ring-white border-white shadow-lg'
                                : 'border-white/15 hover:border-white/30 opacity-75 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={wp.thumbnail}
                              alt={wp.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                              <span className="text-xs font-semibold text-white leading-tight">
                                {wp.title}
                              </span>
                              <span className="text-[10px] text-white/60 truncate">
                                {wp.subtitle}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Scenic Customization Sliders */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/80 font-medium">すりガラスぼかし強度 (Frosted Blur):</span>
                        <div className="flex gap-1.5">
                          {[0, 4, 8, 16].map((b) => (
                            <button
                              key={b}
                              data-focusable="true"
                              onClick={() => updateSettings({ wallpaperBlur: b })}
                              className={`px-3 py-1 rounded-xl border text-xs font-mono transition-all ${
                                (settings.wallpaperBlur ?? 0) === b
                                  ? 'bg-white/25 border-white text-white font-bold'
                                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                              }`}
                            >
                              {b === 0 ? 'くっきり' : `${b}px`}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-white/80 font-medium">
                          <span>暗度コントラストマスク (Dim Overlay)</span>
                          <span className="font-mono">{settings.wallpaperDim ?? 45}%</span>
                        </div>
                        <input
                          type="range"
                          min="25"
                          max="75"
                          step="5"
                          value={settings.wallpaperDim ?? 45}
                          onChange={(e) => updateSettings({ wallpaperDim: parseInt(e.target.value, 10) })}
                          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>

                      {/* Scenic Slideshow Controls */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div>
                          <div className="text-xs font-semibold text-white">風景画スライドショー自動巡回</div>
                          <div className="text-[11px] text-white/50">時間経過で厳選の風景写真を自動的に切り替えます</div>
                        </div>
                        <button
                          data-focusable="true"
                          onClick={() => updateSettings({ wallpaperSlideshow: !settings.wallpaperSlideshow })}
                          className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                            settings.wallpaperSlideshow
                              ? 'bg-white/25 border-white text-white font-semibold'
                              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          {settings.wallpaperSlideshow ? '巡回中 (ON)' : '固定 (OFF)'}
                        </button>
                      </div>

                      {settings.wallpaperSlideshow && (
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-white/80 font-medium">切り替え間隔:</span>
                          <div className="flex gap-1.5">
                            {[15, 30, 45, 60, 120].map((sec) => (
                              <button
                                key={sec}
                                data-focusable="true"
                                onClick={() => updateSettings({ wallpaperIntervalSeconds: sec })}
                                className={`px-2.5 py-1 rounded-xl border text-xs font-mono transition-all ${
                                  (settings.wallpaperIntervalSeconds ?? 45) === sec
                                    ? 'bg-white/25 border-white text-white font-bold'
                                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                                }`}
                              >
                                {sec}秒
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Dynamic Gradient Themes */
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {themePresets.map((t) => (
                        <button
                          key={t.key}
                          data-focusable="true"
                          onClick={() => updateSettings({ backgroundTheme: t.key })}
                          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                            settings.backgroundTheme === t.key
                              ? 'bg-white/15 border-white shadow-lg'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                              {settings.backgroundTheme === t.key && <Check className="w-3.5 h-3.5 text-white" />}
                              {t.title}
                            </span>
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${t.gradient}`} />
                          </div>
                          <div className="text-[11px] text-white/50 leading-relaxed">{t.desc}</div>
                        </button>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <button
                        data-focusable="true"
                        onClick={() => updateSettings({ ambientParticles: !settings.ambientParticles })}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between w-full text-left"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">アンビエント浮遊オーブ (Ambient Glow Orbs)</div>
                          <div className="text-[11px] text-white/50">背景に滑らかに揺らめく3色の光彩エフェクト</div>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${settings.ambientParticles ? 'bg-white/90' : 'bg-white/20'}`}>
                          <div className={`w-5 h-5 rounded-full ${settings.ambientParticles ? 'bg-slate-900 translate-x-4' : 'bg-white'} transition-transform`} />
                        </div>
                      </button>

                      <button
                        data-focusable="true"
                        onClick={() => updateSettings({ burnInProtection: !settings.burnInProtection })}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between w-full text-left"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">有機EL ピクセルシフト (Pixel Shifter)</div>
                          <div className="text-[11px] text-white/50">3分ごとに表示位置を微小移動させ焼き付きを防止</div>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${settings.burnInProtection ? 'bg-white/90' : 'bg-white/20'}`}>
                          <div className={`w-5 h-5 rounded-full ${settings.burnInProtection ? 'bg-slate-900 translate-x-4' : 'bg-white'} transition-transform`} />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Widgets Layout Manager */}
            {activeTab === 'widgets' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">ホームウィジェットの個別設定</h3>
                    <p className="text-xs text-white/60">
                      ホーム（スマートハブ）画面に配置するウィジェットを自由に取捨選択できます。
                    </p>
                  </div>

                  <button
                    data-focusable="true"
                    onClick={() => updateSettings({ visibleWidgets: defaultVisibleWidgets })}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white/80 transition-all border border-white/10"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>すべて初期状態</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allWidgetList.map((item) => {
                    const isVisible = visibleMap[item.id] !== false;
                    return (
                      <button
                        key={item.id}
                        data-focusable="true"
                        onClick={() => toggleWidgetVisibility(item.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isVisible
                            ? 'bg-white/15 border-white/30 text-white shadow-sm'
                            : 'bg-white/5 border-white/5 opacity-50'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white truncate">{item.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/10 text-white/60">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-white/50 mt-1 line-clamp-1">{item.desc}</div>
                        </div>

                        <div className="shrink-0">
                          {isVisible ? (
                            <Eye className="w-4 h-4 text-white" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-white/40" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Apps & Media Management (Addons) */}
            {activeTab === 'addons' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    アプリ & メディア一括管理
                  </h3>
                  <p className="text-xs text-white/60">
                    端末内で完結する追加アプリ・ネットラジオ・RSSフィード・マイ写真を集中設定します。
                  </p>
                </div>

                {/* Section 1: Community Plugins & Custom Webview Apps */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Store className="w-4 h-4 text-slate-300" />
                      <h4 className="text-xs font-semibold text-white">インストール済みアプリ・プラグイン</h4>
                    </div>
                    <span className="text-[11px] text-white/50">
                      {(settings.installedPlugins || []).filter((p) => p.installed).length} 件
                    </span>
                  </div>

                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {(settings.installedPlugins || []).map((plugin) => (
                      <div
                        key={plugin.id}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-medium text-white truncate">{plugin.name}</div>
                          <div className="text-[10px] text-white/40 truncate">{plugin.description}</div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            data-focusable="true"
                            onClick={() => togglePlugin(plugin.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                              plugin.enabled
                                ? 'bg-slate-500/20 text-slate-200 border-slate-500/30 font-semibold'
                                : 'bg-white/5 text-white/40 border-white/5'
                            }`}
                          >
                            {plugin.enabled ? '有効' : '無効'}
                          </button>

                          {plugin.category === 'custom' && (
                            <button
                              data-focusable="true"
                              onClick={() => uninstallPlugin(plugin.id)}
                              className="p-1 rounded-lg text-white/40 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
                              title="削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Webview Quick Form */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <span className="text-[11px] text-white/70 font-medium block">
                      新規 Web アプリ / ダッシュボードを登録
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="アプリ名 (例: Notion, Grafana)"
                        value={newPluginName}
                        onChange={(e) => setNewPluginName(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                      <input
                        type="url"
                        placeholder="https://example.com/embed"
                        value={newPluginUrl}
                        onChange={(e) => setNewPluginUrl(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                      />
                    </div>
                    <button
                      data-focusable="true"
                      onClick={() => {
                        if (!newPluginName.trim() || !newPluginUrl.trim()) return;
                        const newPlugin: CommunityPlugin = {
                          id: `custom-app-${Date.now()}`,
                          name: newPluginName.trim(),
                          author: 'ユーザー登録',
                          description: 'カスタム Webview アプリ',
                          version: '1.0.0',
                          icon: 'app-window',
                          category: 'custom',
                          enabled: true,
                          installed: true,
                          embedUrl: newPluginUrl.trim(),
                        };
                        installPlugin(newPlugin);
                        setNewPluginName('');
                        setNewPluginUrl('');
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs border border-white/15"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>アプリを追加登録</span>
                    </button>
                  </div>
                </div>

                {/* Section 2: Custom Radio Stations */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Radio className="w-4 h-4 text-slate-300" />
                      <h4 className="text-xs font-semibold text-white">カスタムネットラジオ局</h4>
                    </div>
                    <span className="text-[11px] text-white/50">
                      {(settings.customStations || []).length} 件
                    </span>
                  </div>

                  {(settings.customStations || []).length > 0 && (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {(settings.customStations || []).map((station) => (
                        <div
                          key={station.stationuuid}
                          className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                        >
                          <div className="truncate pr-2">
                            <span className="font-medium text-white">{station.name}</span>
                            <span className="text-[10px] text-white/40 block font-mono truncate">{station.url_resolved}</span>
                          </div>
                          <button
                            data-focusable="true"
                            onClick={() => removeCustomStation(station.stationuuid)}
                            className="p-1 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-300 shrink-0"
                            title="削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="局名 (例: マイ作業用BGM)"
                      value={newStationName}
                      onChange={(e) => setNewStationName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                    <input
                      type="url"
                      placeholder="https://... stream.mp3"
                      value={newStationUrl}
                      onChange={(e) => setNewStationUrl(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                    />
                  </div>
                  <button
                    data-focusable="true"
                    onClick={() => {
                      if (!newStationName.trim() || !newStationUrl.trim()) return;
                      const newStation: RadioStation = {
                        changeuuid: `custom-${Date.now()}`,
                        stationuuid: `custom-${Date.now()}`,
                        name: newStationName.trim(),
                        url_resolved: newStationUrl.trim(),
                        homepage: '',
                        favicon: '',
                        tags: 'カスタム配信',
                        country: 'カスタム',
                        bitrate: 128,
                      };
                      addCustomStation(newStation);
                      setNewStationName('');
                      setNewStationUrl('');
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs border border-white/15"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ラジオ局を追加</span>
                  </button>
                </div>

                {/* Section 3: Custom RSS Feeds */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Newspaper className="w-4 h-4 text-slate-300" />
                      <h4 className="text-xs font-semibold text-white">登録 RSS / ニュースフィード</h4>
                    </div>
                    <span className="text-[11px] text-white/50">
                      {(settings.customRssFeeds || []).length} 件
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {(settings.customRssFeeds || []).map((feed) => (
                      <div
                        key={feed.id}
                        className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="truncate pr-2">
                          <span className="font-medium text-white">{feed.name}</span>
                          <span className="text-[10px] text-white/40 block font-mono truncate">{feed.url}</span>
                        </div>
                        <button
                          data-focusable="true"
                          onClick={() => removeCustomRssFeed(feed.id)}
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-300 shrink-0"
                          title="削除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="サイト・フィード名"
                      value={newFeedName}
                      onChange={(e) => setNewFeedName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                    <input
                      type="url"
                      placeholder="https://example.com/rss.xml"
                      value={newFeedUrl}
                      onChange={(e) => setNewFeedUrl(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                    />
                  </div>
                  <button
                    data-focusable="true"
                    onClick={() => {
                      if (!newFeedName.trim() || !newFeedUrl.trim()) return;
                      const newFeed: CustomRssFeed = {
                        id: `feed-${Date.now()}`,
                        name: newFeedName.trim(),
                        url: newFeedUrl.trim(),
                        category: 'カスタム',
                      };
                      addCustomRssFeed(newFeed);
                      setNewFeedName('');
                      setNewFeedUrl('');
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs border border-white/15"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>RSSフィードを追加</span>
                  </button>
                </div>

                {/* Section 4: Custom Photos Gallery */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-slate-300" />
                      <h4 className="text-xs font-semibold text-white">マイ写真コレクション (フォトフレーム)</h4>
                    </div>
                    <span className="text-[11px] text-white/50">
                      {(settings.customPhotos || []).length} 枚
                    </span>
                  </div>

                  {(settings.customPhotos || []).length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                      {(settings.customPhotos || []).map((photo) => {
                        const isWp = settings.scenicWallpaperUrl === photo.url;
                        return (
                          <div
                            key={photo.id}
                            className="group relative rounded-xl overflow-hidden aspect-[4/3] border border-white/10 bg-black/40"
                          >
                            <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 flex flex-col justify-between">
                              <span className="text-[10px] text-white font-medium truncate">{photo.title}</span>
                              <div className="flex items-center justify-between">
                                <button
                                  data-focusable="true"
                                  onClick={() => updateSettings({ wallpaperMode: 'scenic', scenicWallpaperUrl: photo.url })}
                                  className="p-1 rounded bg-white/20 hover:bg-white/40 text-[9px] text-white"
                                  title="壁紙に設定"
                                >
                                  {isWp ? '適用中' : '壁紙'}
                                </button>
                                <button
                                  data-focusable="true"
                                  onClick={() => removeCustomPhoto(photo.id)}
                                  className="p-1 rounded bg-rose-500/40 hover:bg-rose-500/70 text-white"
                                  title="削除"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="url"
                      placeholder="画像 URL (https://...jpg)"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                    />
                    <button
                      data-focusable="true"
                      onClick={() => {
                        if (!newPhotoUrl.trim()) return;
                        const newPhoto: CustomPhoto = {
                          id: `photo-${Date.now()}`,
                          title: 'カスタム写真',
                          url: newPhotoUrl.trim(),
                          source: 'url',
                          addedAt: new Date().toLocaleDateString('ja-JP'),
                        };
                        addCustomPhoto(newPhoto);
                        setNewPhotoUrl('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs border border-white/15 whitespace-nowrap"
                    >
                      URL追加
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Weather & City */}
            {activeTab === 'weather' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">気象観測都市</h3>
                  <p className="text-xs text-white/60 mb-3">主要都市をワンクリックで選択、またはカスタム緯度経度を指定できます。</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {cityPresets.map((city) => (
                      <button
                        key={city.name}
                        data-focusable="true"
                        onClick={() =>
                          updateSettings({
                            cityName: city.name,
                            latitude: city.lat,
                            longitude: city.lon,
                          })
                        }
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          settings.cityName === city.name
                            ? 'bg-white/20 text-white border border-white/25 shadow-sm font-semibold'
                            : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div>
                      <label className="text-white/60 block mb-1 font-mono">緯度 (Latitude)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={settings.latitude}
                        onChange={(e) => updateSettings({ latitude: parseFloat(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 block mb-1 font-mono">経度 (Longitude)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={settings.longitude}
                        onChange={(e) => updateSettings({ longitude: parseFloat(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-white/60 flex items-center justify-between">
                  <span>気象データソース: Open-Meteo.com</span>
                  <span className="text-emerald-300 font-medium">APIキー不要・商用無料 (CC BY 4.0)</span>
                </div>
              </div>
            )}

            {/* Tab: Audio Tuning */}
            {activeTab === 'audio' && (
              <div className="space-y-5 animate-fade-in">
                {/* Master Volume */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-white/80" />
                      システムマスター音量 (Master Volume)
                    </span>
                    <span className="font-mono text-white/90">{settings.masterVolume || 80}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={settings.masterVolume || 80}
                    onChange={(e) => updateSettings({ masterVolume: parseInt(e.target.value, 10) })}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">オーディオ出力テスト</h3>
                  <p className="text-xs text-white/60 mb-3">ブラウザのWeb Audio APIシンセサイザー音源を直接テスト再生します。</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      data-focusable="true"
                      onClick={() => SynthEngine.playChime(0.6)}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-left transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">和音チャイム試聴</div>
                        <div className="text-[11px] text-white/50">ペンタトニック音階の目覚まし音</div>
                      </div>
                      <Volume2 className="w-5 h-5 text-white/80" />
                    </button>

                    <button
                      data-focusable="true"
                      onClick={() => SynthEngine.playClick(0.3)}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-left transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">クリック音試聴</div>
                        <div className="text-[11px] text-white/50">TVリモコン・ボタン操作の触覚音</div>
                      </div>
                      <Volume2 className="w-5 h-5 text-white/80" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-semibold text-white mb-1">完全クライアントサイド音響エンジン</div>
                  <div className="text-[11px] text-white/60 leading-relaxed">
                    Zenislateの環境音（雨、波、焚き火、白雑音）およびアラームチャイムは、外部音声ファイルを一切ダウンロードせず、すべてブラウザの計算処理のみでリアルタイム合成されます。通信量は完全に0KBです。
                  </div>
                </div>
              </div>
            )}

            {/* Tab: CGI & News Proxy */}
            {activeTab === 'proxy' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">マルチCGIプロキシ設定</h3>
                  <p className="text-xs text-white/60 mb-3">
                    ブラウザのCORS制限を回避してRSSニュースを取得するためのバックエンドを指定します。
                  </p>

                  <div className="space-y-2 mb-4">
                    {[
                      { label: 'Direct (AllOrigins 公開プロキシ経由)', val: 'direct' },
                      { label: 'PHP スクリプト (`backend/news.php`)', val: 'backend/news.php' },
                      { label: 'Python 3 CGI (`backend/news.py`)', val: 'backend/news.py' },
                      { label: 'Perl CGI (`backend/news.cgi`)', val: 'backend/news.cgi' },
                      { label: 'Ruby CGI (`backend/news.rb`)', val: 'backend/news.rb' },
                    ].map((item) => (
                      <button
                        key={item.val}
                        data-focusable="true"
                        onClick={() => updateSettings({ proxyEndpoint: item.val })}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          settings.proxyEndpoint === item.val
                            ? 'bg-white/15 border-white text-white font-semibold shadow-sm'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <span>{item.label}</span>
                        {settings.proxyEndpoint === item.val && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 text-xs font-mono">カスタムRSSフィードURL</label>
                    <input
                      type="text"
                      value={settings.customRssUrl}
                      onChange={(e) => updateSettings({ customRssUrl: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Data, Diagnostics & Android Launcher */}
            {activeTab === 'data' && (
              <div className="space-y-5 animate-fade-in">
                {/* Android Home / Launcher Guide */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-emerald-300" />
                    <h3 className="text-xs font-semibold text-white">Android ホームアプリ（ランチャー）設定</h3>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Zenislate は Android の <code className="px-1.5 py-0.5 rounded bg-black/40 text-emerald-300 font-mono text-[11px]">category.HOME</code> に完全対応しています。
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Android 端末の <strong>[設定] &gt; [アプリ] &gt; [デフォルトアプリ] &gt; [ホームアプリ]</strong> で「Zenislate」を選択すると、ホームボタン押下時や端末起動時に常に本スマートディスプレイが起動し、専用のアンビエント据え置き機として運用できます。
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">設定バックアップ & 復元</h3>
                  <p className="text-xs text-white/60 mb-3">端末移行や初期化に備えて、設定内容をJSON形式で保存できます。</p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      data-focusable="true"
                      onClick={handleExport}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all border border-white/15"
                    >
                      <Download className="w-4 h-4 text-white/80" />
                      <span>設定をエクスポート (JSON)</span>
                    </button>

                    <label className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all border border-white/15 cursor-pointer">
                      <Upload className="w-4 h-4 text-white/80" />
                      <span>設定をインポート</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-2">ハードウェア診断 & 稼働情報</h3>
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 font-mono text-xs space-y-2 text-white/70">
                    <div className="flex justify-between">
                      <span className="text-white/40">画面解像度:</span>
                      <span>{window.innerWidth} × {window.innerHeight} px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Screen Wake Lock API:</span>
                      <span className="text-emerald-300">稼働可能 (スリープ防止)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Web Audio API:</span>
                      <span className="text-emerald-300">オンライン (Synth/Noise)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Android Home Launcher Intent:</span>
                      <span className="text-emerald-300">Enabled (category.HOME)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">ブランド & 著作権:</span>
                      <span>Created by Hikaproj (MIT License)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    data-focusable="true"
                    onClick={() => {
                      if (confirm('すべての設定を初期状態にリセットしますか？')) {
                        resetSettings();
                      }
                    }}
                    className="flex items-center space-x-1.5 text-xs text-rose-300 hover:text-rose-200 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>工場出荷時の設定にリセット</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
