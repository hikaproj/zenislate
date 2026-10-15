/**
 * Zenislate - Internet Radio Widget & Custom Stream Manager
 * Supports Radio-Browser streams and user custom Icecast / Shoutcast / M3U8 audio URLs
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState } from 'react';
import { useMediaStore } from '../../stores/useMediaStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import {
  Radio,
  Play,
  Pause,
  Plus,
  Trash2,
  Volume2,
  X,
  Music,
} from 'lucide-react';
import { RadioStation } from '../../types';

const PRESET_STATIONS: RadioStation[] = [
  {
    changeuuid: 'p-1',
    stationuuid: 'p-1',
    name: 'Lofi Cafe Beats',
    url_resolved: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    homepage: 'https://lofi.stream',
    favicon: '',
    tags: 'チル, 作業用BGM',
    country: 'Japan',
    bitrate: 128,
  },
  {
    changeuuid: 'p-2',
    stationuuid: 'p-2',
    name: 'Classical Piano Relaxation',
    url_resolved: 'https://stream.zeno.fm/cq86cv0u92quv',
    homepage: 'https://classical.stream',
    favicon: '',
    tags: 'クラシック, ピアノ',
    country: 'Worldwide',
    bitrate: 128,
  },
  {
    changeuuid: 'p-3',
    stationuuid: 'p-3',
    name: 'Tokyo Jazz Cafe Night',
    url_resolved: 'https://stream.zeno.fm/c3f683eec1hvv',
    homepage: 'https://jazz.stream',
    favicon: '',
    tags: 'ジャズ, カフェ',
    country: 'Japan',
    bitrate: 128,
  },
  {
    changeuuid: 'p-4',
    stationuuid: 'p-4',
    name: 'NPR News 24/7 Live',
    url_resolved: 'https://npr-ice.streamguys1.com/live.mp3',
    homepage: 'https://www.npr.org',
    favicon: '',
    tags: 'ニュース, 国際速報',
    country: 'USA',
    bitrate: 128,
  },
  {
    changeuuid: 'p-5',
    stationuuid: 'p-5',
    name: 'BBC World Service Live',
    url_resolved: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
    homepage: 'https://www.bbc.co.uk/sounds',
    favicon: '',
    tags: '国際ニュース, 英語',
    country: 'UK',
    bitrate: 128,
  },
  {
    changeuuid: 'p-6',
    stationuuid: 'p-6',
    name: 'Anime & Gaming Chiptune Chill',
    url_resolved: 'https://stream.zeno.fm/9uvh4xdfq7zuv',
    homepage: 'https://chiptune.stream',
    favicon: '',
    tags: 'ゲーム音楽, チップチューン',
    country: 'Japan',
    bitrate: 128,
  },
];

type RadioCategory = 'all' | 'chill' | 'news' | 'custom';

export const RadioWidget: React.FC = () => {
  const {
    currentStation,
    isRadioPlaying,
    radioVolume,
    playRadioStation,
    pauseRadio,
    resumeRadio,
    setRadioVolume,
  } = useMediaStore();

  const { settings, addCustomStation, removeCustomStation } = useSettingsStore();

  const [activeCategory, setActiveCategory] = useState<RadioCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStationName, setNewStationName] = useState('');
  const [newStationUrl, setNewStationUrl] = useState('');
  const [newStationTag, setNewStationTag] = useState('');

  const customStations = settings.customStations || [];
  const allStations = [...customStations, ...PRESET_STATIONS];

  const filteredStations = allStations.filter((s) => {
    if (activeCategory === 'custom') return customStations.some((c) => c.stationuuid === s.stationuuid);
    if (activeCategory === 'chill') return s.tags.includes('チル') || s.tags.includes('ジャズ') || s.tags.includes('クラシック');
    if (activeCategory === 'news') return s.tags.includes('ニュース') || s.tags.includes('情報');
    return true;
  });

  const handleTogglePlay = (station: RadioStation) => {
    if (currentStation?.stationuuid === station.stationuuid) {
      if (isRadioPlaying) {
        pauseRadio();
      } else {
        resumeRadio();
      }
    } else {
      playRadioStation(station);
    }
  };

  const handleAddCustomStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStationName.trim() || !newStationUrl.trim()) return;

    const newStation: RadioStation = {
      changeuuid: `custom-${Date.now()}`,
      stationuuid: `custom-${Date.now()}`,
      name: newStationName.trim(),
      url_resolved: newStationUrl.trim(),
      homepage: '',
      favicon: '',
      tags: newStationTag.trim() || 'カスタム配信',
      country: 'カスタム',
      bitrate: 128,
    };

    addCustomStation(newStation);
    setNewStationName('');
    setNewStationUrl('');
    setNewStationTag('');
    setIsAddModalOpen(false);
    playRadioStation(newStation);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      {/* Header */}
      <div className="h-8 shrink-0 flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <Radio className="w-4 h-4 text-slate-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            ネットラジオ
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            data-focusable="true"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 text-xs transition-colors nowrap-pill"
            title="カスタム配信URLを追加"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>カスタム追加</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-1 mb-2 overflow-x-auto pb-1 text-[11px]">
        {[
          { key: 'all', label: 'すべて' },
          { key: 'chill', label: 'カフェ・チル' },
          { key: 'news', label: 'ニュース' },
          { key: 'custom', label: `マイ登録 (${customStations.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            data-focusable="true"
            onClick={() => setActiveCategory(tab.key as RadioCategory)}
            className={`px-2.5 py-0.5 rounded-full border transition-all nowrap-pill ${
              activeCategory === tab.key
                ? 'bg-slate-500/20 border-slate-500/40 text-white font-medium'
                : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body: Stations List (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 my-1">
        {filteredStations.length === 0 ? (
          <div className="text-center py-6 text-white/40 text-xs">
            登録されているステーションがありません
          </div>
        ) : (
          filteredStations.map((station) => {
            const isSelected = currentStation?.stationuuid === station.stationuuid;
            const isPlayingThis = isSelected && isRadioPlaying;
            const isCustom = customStations.some((c) => c.stationuuid === station.stationuuid);

            return (
              <div
                key={station.stationuuid}
                className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isPlayingThis
                    ? 'bg-slate-500/25 border-slate-400/40 shadow-sm'
                    : isSelected
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-white truncate">
                      {station.name}
                    </span>
                    {isPlayingThis && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[10px] text-white/50 truncate flex items-center gap-1.5 mt-0.5">
                    <span>{station.tags}</span>
                    <span>•</span>
                    <span>{station.country}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  {isCustom && (
                    <button
                      data-focusable="true"
                      onClick={() => removeCustomStation(station.stationuuid)}
                      className="p-1 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-300 transition-colors"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    data-focusable="true"
                    onClick={() => handleTogglePlay(station)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      isPlayingThis
                        ? 'bg-slate-200 text-slate-900 shadow'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title={isPlayingThis ? '一時停止' : '再生'}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer: Volume slider & Now Playing status */}
      <div className="shrink-0 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-white/60 min-w-0 pr-2">
          <Music className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate text-[11px]">
            {isRadioPlaying && currentStation ? currentStation.name : '停止中'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <Volume2 className="w-3.5 h-3.5 text-white/50" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={radioVolume}
            onChange={(e) => setRadioVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* Custom Station Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xl p-4 animate-fade-in">
          <div className="glass-panel-elevated w-full max-w-md p-6 rounded-3xl border border-white/20 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-slate-300" />
                <h3 className="text-sm font-semibold text-white">カスタムラジオ局を追加</h3>
              </div>
              <button
                data-focusable="true"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomStation} className="space-y-3">
              <div>
                <label className="text-xs text-white/70 block mb-1">ステーション名</label>
                <input
                  type="text"
                  required
                  placeholder="例: マイ お気に入り BGM"
                  value={newStationName}
                  onChange={(e) => setNewStationName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">音声ストリーム URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/stream.mp3 または m3u8"
                  value={newStationUrl}
                  onChange={(e) => setNewStationUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  ※ HTTPS の MP3, AAC, または HLS (m3u8) 配信ストリームに対応しています。
                </p>
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">ジャンル・タグ (任意)</label>
                <input
                  type="text"
                  placeholder="例: ジャズ, 作業用, ニュース"
                  value={newStationTag}
                  onChange={(e) => setNewStationTag(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  data-focusable="true"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl text-xs text-white/60 hover:text-white"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  data-focusable="true"
                  className="px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold border border-white/25 shadow-sm"
                >
                  ステーションを保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
