/**
 * Zenislate - Alarms and Missions Zustand Store
 * Created by Hikaproj
 * License: MIT
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Alarm } from '../types';

interface AlarmState {
  alarms: Alarm[];
  activeAlarm: Alarm | null;
  sunriseAlarm: Alarm | null;
  addAlarm: (alarm: Omit<Alarm, 'id' | 'snoozeCount'>) => void;
  updateAlarm: (id: string, partial: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  triggerAlarm: (alarm: Alarm) => void;
  dismissAlarm: () => void;
  snoozeAlarm: () => void;
  checkAlarms: (now: Date) => void;
}

const initialAlarms: Alarm[] = [
  {
    id: 'alarm-1',
    time: '07:00',
    enabled: false,
    days: [1, 2, 3, 4, 5], // Mon-Fri
    label: '起床アラーム (計算ミッション)',
    soundType: 'synth-chime',
    missionType: 'math',
    missionDifficulty: 'medium',
    snoozeCount: 0,
    maxSnooze: 3,
    volume: 0.8,
    fadeInSeconds: 10,
  },
  {
    id: 'alarm-2',
    time: '23:30',
    enabled: false,
    days: [],
    label: '就寝リマインダー',
    soundType: 'synth-chime',
    missionType: 'none',
    missionDifficulty: 'easy',
    snoozeCount: 0,
    maxSnooze: 1,
    volume: 0.6,
    fadeInSeconds: 5,
  },
];

export const useAlarmStore = create<AlarmState>()(
  persist(
    (set, get) => ({
      alarms: initialAlarms,
      activeAlarm: null,
      sunriseAlarm: null,

      addAlarm: (newAlarmData) => {
        const newAlarm: Alarm = {
          ...newAlarmData,
          id: `alarm-${Date.now()}`,
          snoozeCount: 0,
        };
        set((state) => ({ alarms: [...state.alarms, newAlarm] }));
      },

      updateAlarm: (id, partial) => {
        set((state) => ({
          alarms: state.alarms.map((a) => (a.id === id ? { ...a, ...partial } : a)),
        }));
      },

      deleteAlarm: (id) => {
        set((state) => ({
          alarms: state.alarms.filter((a) => a.id !== id),
        }));
      },

      toggleAlarm: (id) => {
        set((state) => ({
          alarms: state.alarms.map((a) =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
          ),
        }));
      },

      triggerAlarm: (alarm) => {
        set({ activeAlarm: alarm, sunriseAlarm: null });
      },

      dismissAlarm: () => {
        set({ activeAlarm: null, sunriseAlarm: null });
      },

      snoozeAlarm: () => {
        const active = get().activeAlarm;
        if (!active) return;
        // Snooze for 5 minutes
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        const snoozeHours = String(now.getHours()).padStart(2, '0');
        const snoozeMinutes = String(now.getMinutes()).padStart(2, '0');
        const snoozedTime = `${snoozeHours}:${snoozeMinutes}`;

        set((state) => ({
          activeAlarm: null,
          sunriseAlarm: null,
          alarms: state.alarms.map((a) =>
            a.id === active.id
              ? {
                  ...a,
                  time: snoozedTime,
                  snoozeCount: a.snoozeCount + 1,
                }
              : a
          ),
        }));
      },

      checkAlarms: (now: Date) => {
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTimeStr = `${currentHours}:${currentMinutes}`;
        const currentDay = now.getDay();
        const currentSec = now.getSeconds();

        // Only check on 0 seconds to avoid repeating within same minute
        if (currentSec !== 0) return;

        const { alarms, activeAlarm } = get();
        if (activeAlarm) return; // Already ringing

        for (const alarm of alarms) {
          if (!alarm.enabled) continue;

          // Check day of week (empty array means once)
          if (alarm.days.length > 0 && !alarm.days.includes(currentDay)) {
            continue;
          }

          // Check sunrise mode (5 mins prior)
          if (alarm.soundType === 'sunrise' || alarm.missionType === 'sunrise') {
            const [aH, aM] = alarm.time.split(':').map(Number);
            const alarmDate = new Date(now);
            alarmDate.setHours(aH, aM, 0, 0);
            const diffMin = (alarmDate.getTime() - now.getTime()) / (60 * 1000);
            if (diffMin > 0 && diffMin <= 5) {
              set({ sunriseAlarm: alarm });
            }
          }

          if (alarm.time === currentTimeStr) {
            get().triggerAlarm(alarm);
            // If one-off alarm, disable it
            if (alarm.days.length === 0) {
              get().updateAlarm(alarm.id, { enabled: false });
            }
            break;
          }
        }
      },
    }),
    {
      name: 'zenislate-alarms-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
