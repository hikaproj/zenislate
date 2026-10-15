/**
 * Zenislate - Procedural Ambient Sound Mixer Widget
 * 100% Client-Side Web Audio Noise Synthesis (0 external MP3 files)
 * Created by Hikaproj
 * License: MIT
 */

import React from 'react';
import { useMediaStore } from '../../stores/useMediaStore';
import { CloudRain, Waves, Flame, Wind, VolumeX, Sliders } from 'lucide-react';
import { AmbientSoundType } from '../../types';

export const AudioMixerWidget: React.FC = () => {
  const { ambientTracks, setTrackVolume, toggleTrackMute, stopAllAmbient } =
    useMediaStore();

  const getTrackIcon = (type: AmbientSoundType) => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-4 h-4 text-sky-400" />;
      case 'waves':
        return <Waves className="w-4 h-4 text-cyan-400" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'whitenoise':
      default:
        return <Wind className="w-4 h-4 text-purple-400" />;
    }
  };

  const isAnyActive = ambientTracks.some((t) => t.volume > 0 && !t.muted);

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified shadow-lg select-none">
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-slate-800 dark:text-slate-200">
            <Sliders className="w-4 h-4 text-slate-800 dark:text-slate-200" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white balanced-text">
            環境音ミキサー
          </span>
        </div>
        {isAnyActive && (
          <button
            data-focusable="true"
            onClick={stopAllAmbient}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-800 dark:text-rose-200 text-xs font-bold transition-colors"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>すべて停止</span>
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {ambientTracks.map((track) => {
          return (
            <div key={track.id} className="flex flex-col space-y-1">
              <div className="flex items-center justify-between text-xs">
                <button
                  data-focusable="true"
                  onClick={() => toggleTrackMute(track.type)}
                  className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-300 transition-colors"
                >
                  {getTrackIcon(track.type)}
                  <span>{track.name}</span>
                </button>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {track.muted ? '消音' : `${Math.round(track.volume * 100)}%`}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.muted ? 0 : track.volume}
                  onChange={(e) =>
                    setTrackVolume(track.type, parseFloat(e.target.value))
                  }
                  className="w-full h-1.5 bg-black/10 dark:bg-white/15 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 font-bold">
        <span>プロシージャル計算音源</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">外部通信 0KB</span>
      </div>
    </div>
  );
};
