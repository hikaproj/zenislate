/**
 * Zenislate - Work Focus Mode View
 * Combines Pomodoro Timer, Procedural Soundscapes, and Pinned Tasks
 * Created by Hikaproj
 * License: MIT
 */

import React from 'react';
import { PomodoroWidget } from '../widgets/PomodoroWidget';
import { AudioMixerWidget } from '../widgets/AudioMixerWidget';
import { MemoWidget } from '../widgets/MemoWidget';
import { ClockWidget } from '../widgets/ClockWidget';
import { BreathingWidget } from '../widgets/BreathingWidget';

export const WorkFocusView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      {/* Subtle Clock Header */}
      <div className="mb-4">
        <ClockWidget size="normal" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full items-start justify-items-center">
        {/* Procedural Soundscapes */}
        <div className="w-full max-w-sm">
          <AudioMixerWidget />
        </div>

        {/* Pomodoro Focus Timer */}
        <div className="w-full max-w-sm flex justify-center">
          <PomodoroWidget />
        </div>

        {/* 4-7-8 Breathing Guide */}
        <div className="w-full max-w-sm flex justify-center">
          <BreathingWidget />
        </div>

        {/* Pinned Tasks & Memos */}
        <div className="w-full max-w-sm">
          <MemoWidget />
        </div>
      </div>
    </div>
  );
};
