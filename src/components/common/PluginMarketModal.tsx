/**
 * Zenislate - Official App & Plugin Store (アプリストア)
 * Discover, install, and manage community apps, IoT dashboards, and custom widgets
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import {
  X,
  Store,
  Plus,
  BookOpen,
  Download,
  Trash2,
  Code,
  Search,
  Star,
  ShoppingBag,
  Sparkles,
  Coins,
  Coffee,
  GitBranch,
  CloudRain,
  Home,
  Globe,
  AppWindow,
  Layers,
} from 'lucide-react';
import { CommunityPlugin, DEFAULT_COMMUNITY_PLUGINS } from '../../types';

interface PluginMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const renderPluginIcon = (iconKey: string) => {
  switch (iconKey) {
    case 'sparkles':
      return <Sparkles className="w-5 h-5 text-amber-300" />;
    case 'coins':
      return <Coins className="w-5 h-5 text-emerald-300" />;
    case 'coffee':
      return <Coffee className="w-5 h-5 text-orange-300" />;
    case 'git-branch':
      return <GitBranch className="w-5 h-5 text-purple-300" />;
    case 'cloud-rain':
      return <CloudRain className="w-5 h-5 text-sky-300" />;
    case 'home':
      return <Home className="w-5 h-5 text-blue-300" />;
    case 'globe':
      return <Globe className="w-5 h-5 text-teal-300" />;
    case 'code':
      return <Code className="w-5 h-5 text-pink-300" />;
    case 'layers':
      return <Layers className="w-5 h-5 text-slate-300" />;
    default:
      return <AppWindow className="w-5 h-5 text-slate-300" />;
  }
};

const AVAILABLE_ICONS = [
  { key: 'app-window', label: '標準アプリ' },
  { key: 'home', label: 'ホーム・IoT' },
  { key: 'globe', label: 'Web・外部' },
  { key: 'sparkles', label: '機能' },
  { key: 'coins', label: '金融' },
  { key: 'coffee', label: 'カフェ・休憩' },
  { key: 'cloud-rain', label: '環境・天気' },
  { key: 'code', label: '開発' },
];

export const PluginMarketModal: React.FC<PluginMarketModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, togglePlugin, installPlugin, uninstallPlugin } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'store' | 'custom' | 'guide'>('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom plugin form states
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [customUrl, setCustomUrl] = useState('https://');
  const [customIcon, setCustomIcon] = useState('app-window');

  if (!isOpen) return null;

  const plugins = settings.installedPlugins || DEFAULT_COMMUNITY_PLUGINS;

  const handleInstallCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customUrl.trim()) return;

    const newPlugin: CommunityPlugin = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      author: customAuthor.trim() || '有志開発者',
      description: customDesc.trim() || 'カスタム Webview プラグイン',
      version: '1.0.0',
      icon: customIcon || 'app-window',
      category: 'custom',
      enabled: true,
      installed: true,
      embedUrl: customUrl.trim(),
    };

    installPlugin(newPlugin);
    setCustomName('');
    setCustomDesc('');
    setCustomAuthor('');
    setCustomUrl('https://');
    setActiveTab('store');
    alert(`アプリ「${newPlugin.name}」を正常にインストールしました！`);
  };

  const filteredPlugins = plugins.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      (selectedCategory === 'installed' && p.installed);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-2xl p-2 sm:p-6 overflow-y-auto animate-fade-in select-none">
      <div className="glass-panel-elevated w-full max-w-5xl h-[92vh] max-h-[850px] my-auto rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Header (Top-safe) */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-500/10 border border-slate-500/20 backdrop-blur-md flex items-center justify-center text-slate-300 shadow-sm">
              <ShoppingBag className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-white flex items-center gap-2">
                Zenislate App & Plugin Store
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20 font-medium">
                  公式有志マーケット
                </span>
              </h2>
              <p className="text-[11px] text-white/50 hidden sm:block">
                100% 無料・ゼロコスト運用のスマートハブ拡張アプリストア
              </p>
            </div>
          </div>

          <button
            data-focusable="true"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Navigation Bar */}
        <div className="px-6 py-2.5 border-b border-white/10 flex items-center justify-between bg-black/10 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              data-focusable="true"
              onClick={() => setActiveTab('store')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'store'
                  ? 'bg-white/20 text-white border border-white/25 shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>アプリ一覧 ({plugins.length})</span>
            </button>

            <button
              data-focusable="true"
              onClick={() => setActiveTab('custom')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'custom'
                  ? 'bg-white/20 text-white border border-white/25 shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>カスタムアプリ作成 (Webview/URL)</span>
            </button>

            <button
              data-focusable="true"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-white/20 text-white border border-white/25 shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>開発者ガイド (自作方法)</span>
            </button>
          </div>

          {activeTab === 'store' && (
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="アプリを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 w-44"
              />
            </div>
          )}
        </div>

        {/* Tab 1: App Store Catalog */}
        {activeTab === 'store' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              {[
                { key: 'all', label: 'すべて' },
                { key: 'installed', label: 'インストール済' },
                { key: 'life', label: '暮らし・情報' },
                { key: 'time', label: '時間・タイマー' },
                { key: 'tools', label: 'ツール・金融' },
                { key: 'custom', label: 'カスタム' },
              ].map((c) => (
                <button
                  key={c.key}
                  data-focusable="true"
                  onClick={() => setSelectedCategory(c.key)}
                  className={`px-3 py-1 rounded-full border transition-all nowrap-pill ${
                    selectedCategory === c.key
                      ? 'bg-slate-500/20 border-slate-500/40 text-white font-medium'
                      : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="p-4 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-sm shrink-0">
                        {renderPluginIcon(plugin.icon)}
                      </div>
                      <div className="flex items-center space-x-1 text-amber-300 text-[11px] font-mono">
                        <Star className="w-3 h-3 fill-current" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-white leading-tight balanced-text">
                      {plugin.name}
                    </h3>
                    <div className="text-[11px] text-white/40 flex items-center gap-1.5 mt-0.5 mb-2">
                      <span>{plugin.author}</span>
                      <span>•</span>
                      <span>v{plugin.version}</span>
                    </div>

                    <p className="text-xs text-white/70 line-clamp-3 leading-relaxed pretty-text">
                      {plugin.description}
                    </p>
                  </div>

                  <div className="shrink-0 pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                      {plugin.category}
                    </span>

                    <div className="flex items-center space-x-2">
                      {plugin.installed ? (
                        <>
                          <button
                            data-focusable="true"
                            onClick={() => togglePlugin(plugin.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                              plugin.enabled
                                ? 'bg-slate-500/20 text-slate-200 border-slate-500/40'
                                : 'bg-white/5 text-white/50 border-white/10'
                            }`}
                          >
                            {plugin.enabled ? '有効' : '無効'}
                          </button>

                          {plugin.category === 'custom' && (
                            <button
                              data-focusable="true"
                              onClick={() => uninstallPlugin(plugin.id)}
                              className="p-1 rounded-full hover:bg-rose-500/20 text-white/40 hover:text-rose-300"
                              title="アンインストール"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          data-focusable="true"
                          onClick={() => installPlugin(plugin)}
                          className="flex items-center space-x-1 px-3.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold border border-white/25 shadow-sm transition-all"
                        >
                          <Download className="w-3 h-3" />
                          <span>入手</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Custom App Studio */}
        {activeTab === 'custom' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-xl mx-auto space-y-5 animate-fade-in">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">
                カスタム Webview / ダッシュボード追加
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Home Assistant、Grafana、Notion、任意の Web アプリや自作ダッシュボードの URL を登録し、スマートハブのウィジェット枠に安全にインライン表示できます。
              </p>
            </div>

            <form onSubmit={handleInstallCustom} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="text-xs text-white/70 block mb-1">アイコン</label>
                  <select
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-2.5 text-xs text-white focus:outline-none focus:border-white/30"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.key} value={ic.key} className="bg-slate-900 text-white">
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="text-xs text-white/70 block mb-1">ウィジェット名</label>
                  <input
                    type="text"
                    required
                    placeholder="例: 自宅スマートホーム盤"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">作者・開発者名 (任意)</label>
                <input
                  type="text"
                  placeholder="例: 有志開発者 / コミュニティ"
                  value={customAuthor}
                  onChange={(e) => setCustomAuthor(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">埋め込み Web URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/dashboard"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  ※ iframe 埋め込みに対応した HTTPS サイトの URL を入力してください。
                </p>
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">説明・メモ (任意)</label>
                <textarea
                  rows={2}
                  placeholder="ウィジェットの用途や補足事項"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  data-focusable="true"
                  className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold border border-white/30 shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>スマートハブへインストール</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Developer Guide */}
        {activeTab === 'guide' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto space-y-6 text-white text-xs leading-relaxed animate-fade-in">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-slate-300" />
                Zenislate 有志ウィジェット開発公式ガイド
              </h3>
              <p className="text-white/70 leading-relaxed">
                Zenislate は 100% 無料かつ外部の有償 API キーを一切要求しないオープンソースのスマートハブです。世界中の有志開発者からの新ウィジェット・プラグインの寄贈を大歓迎しています。
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white/90">■ 3大開発原則</h4>
              <ul className="list-disc list-inside space-y-1.5 text-white/70">
                <li><strong className="text-white">ゼロコスト原則:</strong> OpenAI, Google, AWS などの有料従量課金 API キーは使用不可。パブリックな無料 API または端末内計算を使用してください。</li>
                <li><strong className="text-white">リモコン D-Pad 対応:</strong> インタラクティブなボタンや入力には <code className="bg-white/10 px-1 py-0.5 rounded text-[11px]">data-focusable=&quot;true&quot;</code> を必ず付与してください。</li>
                <li><strong className="text-white">フロストガラス調の遵守:</strong> 共通クラス <code className="bg-white/10 px-1 py-0.5 rounded text-[11px]">glass-panel</code> および <code className="bg-white/10 px-1 py-0.5 rounded text-[11px]">bento-card-unified</code> を使用して統一感を保ってください。</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-500/10 border border-slate-500/20 text-[11px] text-slate-300">
              ※ 詳細なチュートリアルとサンプルコードは、プロジェクト直下の <code className="bg-white/10 px-1 py-0.5 rounded">CUSTOM_APPS_AND_PLUGINS_GUIDE.md</code> にて閲覧できます。
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
