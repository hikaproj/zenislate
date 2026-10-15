/**
 * Zenislate - Ambient Clock Mode View (Giant Minimal Ambient Clock)
 * Created by Hikaproj
 * License: MIT
 */

import React from 'react';
import { ClockWidget } from '../widgets/ClockWidget';
import { useSettingsStore } from '../../stores/useSettingsStore';

export const AmbientClockView: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const toggleClockType = () => {
    updateSettings({
      clockType: settings.clockType === 'digital' ? 'analog' : 'digital',
    });
  };

  const toggleSeconds = () => {
    updateSettings({ showSeconds: !settings.showSeconds });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
      {/* Giant Clock in Center */}
      <div className="flex-1 flex items-center justify-center">
        <ClockWidget size="giant" />
      </div>

      {/* Subtle Floating Bottom Controls */}
      <div className="flex items-center space-x-3 py-2 px-4 rounded-full bg-white/5 border border-white/5 backdrop-blur-md text-xs text-gray-400">
        <button
          data-focusable="true"
          onClick={toggleClockType}
          className="hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
        >
          {settings.clockType === 'digital' ? 'アナログに切替' : 'デジタルに切替'}
        </button>
        <span className="opacity-20">•</span>
        <button
          data-focusable="true"
          onClick={toggleSeconds}
          className="hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
        >
          秒針: {settings.showSeconds ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};
