/**
 * Zenislate - Sunrise Lighting Overlay
 * Simulates sunrise gradual illumination prior to alarm sound
 * Created by Hikaproj
 * License: MIT
 */

import React from 'react';
import { Sun } from 'lucide-react';

interface SunriseOverlayProps {
  onDismiss: () => void;
}

export const SunriseOverlay: React.FC<SunriseOverlayProps> = ({ onDismiss }) => {
  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-40 bg-gradient-to-t from-amber-400/80 via-orange-400/50 to-indigo-950/90 animate-pulse flex flex-col items-center justify-center cursor-pointer p-6"
    >
      <div className="w-24 h-24 rounded-full bg-amber-300 shadow-[0_0_80px_rgba(251,191,36,0.8)] flex items-center justify-center mb-6 animate-bounce">
        <Sun className="w-14 h-14 text-amber-600" />
      </div>

      <h2 className="text-3xl font-display font-bold text-white mb-2 drop-shadow-lg">
        サンライズ調光稼働中
      </h2>
      <p className="text-sm text-amber-100 max-w-sm text-center drop-shadow">
        画面をタップすると調光を終了します
      </p>
    </div>
  );
};
