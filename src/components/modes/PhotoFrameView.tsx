/**
 * Zenislate - Photo Frame Mode View
 * Ambient full-screen slideshow with elegant clock overlay
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { ClockWidget } from '../widgets/ClockWidget';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export const PhotoFrameView: React.FC = () => {
  const { settings } = useSettingsStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const customPhotos = settings.customPhotos?.map((p) => p.url) || [];
  const photos =
    customPhotos.length > 0
      ? customPhotos
      : settings.photoUrls && settings.photoUrls.length > 0
      ? settings.photoUrls
      : [
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1920&q=80',
        ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, (settings.photoIntervalSeconds || 15) * 1000);

    return () => clearInterval(interval);
  }, [isPlaying, photos.length, settings.photoIntervalSeconds]);

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-black select-none">
      {/* Background Slideshow Images */}
      {photos.map((url, idx) => (
        <div
          key={url}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 transform scale-105 ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ backgroundImage: `url(${url})` }}
        >
          {/* Subtle dark gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        </div>
      ))}

      {/* Floating Translucent Ambient Clock Pill (Bottom Left, Responsive) */}
      <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-20 glass-panel-elevated p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl max-w-[85vw] sm:max-w-none">
        <ClockWidget size="normal" />
      </div>

      {/* Slideshow Control Buttons (Bottom Right, Responsive) */}
      <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 z-20 flex items-center space-x-1 sm:space-x-2 glass-panel p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-white/20 backdrop-blur-md">
        <button
          data-focusable="true"
          onClick={prevPhoto}
          aria-label="前の写真"
          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          data-focusable="true"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'スライドショー一時停止' : 'スライドショー再生'}
          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />}
        </button>

        <button
          data-focusable="true"
          onClick={nextPhoto}
          aria-label="次の写真"
          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
