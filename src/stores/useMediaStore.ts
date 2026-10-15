/**
 * Zenislate - Media, Ambient Sounds, and Radio Zustand Store
 * Created by Hikaproj
 * License: MIT
 */


import { create } from 'zustand';
import { AmbientSoundType, AmbientTrackState, RadioStation } from '../types';
import { ProceduralNoiseEngine } from '../engines/audio/ProceduralNoise';

interface MediaState {
  ambientTracks: AmbientTrackState[];
  isRadioPlaying: boolean;
  currentStation: RadioStation | null;
  radioVolume: number;
  audioRef: HTMLAudioElement | null;

  setTrackVolume: (type: AmbientSoundType, volume: number) => void;
  toggleTrackMute: (type: AmbientSoundType) => void;
  stopAllAmbient: () => void;

  setAudioRef: (el: HTMLAudioElement | null) => void;
  playRadioStation: (station: RadioStation) => void;
  pauseRadio: () => void;
  resumeRadio: () => void;
  setRadioVolume: (vol: number) => void;
}

const defaultTracks: AmbientTrackState[] = [
  { id: 'track-rain', name: '穏やかな雨音', volume: 0, muted: false, type: 'rain' },
  { id: 'track-waves', name: '寄せる波', volume: 0, muted: false, type: 'waves' },
  { id: 'track-fire', name: '焚き火の温もり', volume: 0, muted: false, type: 'fire' },
  { id: 'track-white', name: '静寂ホワイトノイズ', volume: 0, muted: false, type: 'whitenoise' },
];

export const useMediaStore = create<MediaState>((set, get) => ({
  ambientTracks: defaultTracks,
  isRadioPlaying: false,
  currentStation: null,
  radioVolume: 0.7,
  audioRef: null,

  setTrackVolume: (type, volume) => {
    const updated = get().ambientTracks.map((t) =>
      t.type === type ? { ...t, volume, muted: volume === 0 } : t
    );
    set({ ambientTracks: updated });
    ProceduralNoiseEngine.setTrack(type, volume);
  },

  toggleTrackMute: (type) => {
    const track = get().ambientTracks.find((t) => t.type === type);
    if (!track) return;
    const newMuted = !track.muted;
    const effectiveVol = newMuted ? 0 : (track.volume || 0.5);

    const updated = get().ambientTracks.map((t) =>
      t.type === type ? { ...t, muted: newMuted, volume: effectiveVol } : t
    );
    set({ ambientTracks: updated });
    ProceduralNoiseEngine.setTrack(type, effectiveVol);
  },

  stopAllAmbient: () => {
    ProceduralNoiseEngine.stopAll();
    set({
      ambientTracks: get().ambientTracks.map((t) => ({ ...t, volume: 0, muted: false })),
    });
  },

  setAudioRef: (el) => {
    set({ audioRef: el });
  },

  playRadioStation: (station) => {
    const { audioRef, radioVolume } = get();
    set({ currentStation: station, isRadioPlaying: true });
    if (audioRef) {
      audioRef.src = station.url_resolved;
      audioRef.volume = radioVolume;
      audioRef.play().catch((err) => {
        console.warn('Radio stream playback failed:', err);
        set({ isRadioPlaying: false });
      });
    }
  },

  pauseRadio: () => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.pause();
    }
    set({ isRadioPlaying: false });
  },

  resumeRadio: () => {
    const { audioRef, currentStation } = get();
    if (audioRef && currentStation) {
      if (!audioRef.src || audioRef.src !== currentStation.url_resolved) {
        audioRef.src = currentStation.url_resolved;
      }
      audioRef.play().then(() => {
        set({ isRadioPlaying: true });
      }).catch((err) => {
        console.warn('Radio stream resume failed:', err);
        set({ isRadioPlaying: false });
      });
    } else {
      set({ isRadioPlaying: false });
    }
  },

  setRadioVolume: (vol) => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.volume = vol;
    }
    set({ radioVolume: vol });
  },
}));
