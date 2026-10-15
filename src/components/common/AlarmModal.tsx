/**
 * Zenislate - Alarm Ringing Modal
 * Handles sound output, snooze, and 6 specialized mission解除 interfaces
 * Created by Hikaproj
 * License: MIT
 */

import React, { useEffect } from 'react';
import { useAlarmStore } from '../../stores/useAlarmStore';
import { SynthEngine } from '../../engines/audio/SynthEngine';
import { Bell, RotateCcw } from 'lucide-react';
import { MathMission } from '../missions/MathMission';
import { ShakeMission } from '../missions/ShakeMission';
import { SimonMission } from '../missions/SimonMission';
import { SpeechMission } from '../missions/SpeechMission';
import { QRMission } from '../missions/QRMission';

export const AlarmModal: React.FC = () => {
  const { activeAlarm, dismissAlarm, snoozeAlarm } = useAlarmStore();

  useEffect(() => {
    if (activeAlarm) {
      const sound = activeAlarm.soundType === 'synth-beep' ? 'synth-beep' : 'synth-chime';
      SynthEngine.startAlarm(sound, activeAlarm.volume, activeAlarm.fadeInSeconds);
    } else {
      SynthEngine.stopAlarm();
    }

    return () => {
      SynthEngine.stopAlarm();
    };
  }, [activeAlarm]);

  if (!activeAlarm) return null;

  const handleDismiss = () => {
    SynthEngine.stopAlarm();
    dismissAlarm();
  };

  const handleSnooze = () => {
    SynthEngine.stopAlarm();
    snoozeAlarm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in select-none">
      <div className="glass-panel-elevated w-full max-w-lg rounded-3xl p-6 md:p-8 border border-rose-500/30 shadow-[0_0_80px_rgba(244,63,94,0.3)] flex flex-col items-center text-center">
        {/* Header Alert Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/40 mb-4 animate-bounce">
          <Bell className="w-8 h-8 text-white" />
        </div>

        <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2">
          {activeAlarm.time}
        </div>

        <h2 className="text-xl font-bold font-display text-gray-200 mb-6">
          {activeAlarm.label}
        </h2>

        {/* Missions or Standard Stop */}
        {activeAlarm.missionType === 'math' && (
          <MathMission
            difficulty={activeAlarm.missionDifficulty}
            onComplete={handleDismiss}
          />
        )}

        {activeAlarm.missionType === 'shake' && (
          <ShakeMission onComplete={handleDismiss} />
        )}

        {activeAlarm.missionType === 'simon' && (
          <SimonMission onComplete={handleDismiss} />
        )}

        {activeAlarm.missionType === 'briefing' && (
          <SpeechMission onComplete={handleDismiss} />
        )}

        {activeAlarm.missionType === 'qr' && (
          <QRMission onComplete={handleDismiss} />
        )}

        {(activeAlarm.missionType === 'none' ||
          activeAlarm.missionType === 'sunrise') && (
          <div className="w-full space-y-3 mt-4">
            <button
              data-focusable="true"
              onClick={handleDismiss}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 font-bold text-lg text-white shadow-xl shadow-rose-500/30 transition-all transform active:scale-95"
            >
              アラームを停止する
            </button>

            {activeAlarm.snoozeCount < activeAlarm.maxSnooze && (
              <button
                data-focusable="true"
                onClick={handleSnooze}
                className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm text-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>スヌーズ (5分後)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
