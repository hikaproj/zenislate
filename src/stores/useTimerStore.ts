/**
 * Zenislate - Timer, Stopwatch, and Pomodoro Zustand Store
 * Created by Hikaproj
 * License: MIT
 */

import { create } from 'zustand';
import { TimerItem, StopwatchLap } from '../types';

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroState {
  mode: PomodoroMode;
  remainingMs: number;
  isRunning: boolean;
  workDurationMs: number;
  shortBreakDurationMs: number;
  longBreakDurationMs: number;
  completedCycles: number;
  lastTick: number;
}

interface StopwatchState {
  timeMs: number;
  isRunning: boolean;
  laps: StopwatchLap[];
  lastTick: number;
}

interface TimerStoreState {
  timers: TimerItem[];
  stopwatch: StopwatchState;
  pomodoro: PomodoroState;

  // Countdown timer actions
  addTimer: (label: string, durationMs: number) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  deleteTimer: (id: string) => void;

  // Stopwatch actions
  startStopwatch: () => void;
  pauseStopwatch: () => void;
  resetStopwatch: () => void;
  recordLap: () => void;

  // Pomodoro actions
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  skipPomodoroPhase: () => void;

  // Master tick dispatched by WorkerBridge
  tickAll: (now: number) => void;
}

const DEFAULT_WORK_MS = 25 * 60 * 1000;
const DEFAULT_SHORT_BREAK_MS = 5 * 60 * 1000;
const DEFAULT_LONG_BREAK_MS = 15 * 60 * 1000;

export const useTimerStore = create<TimerStoreState>((set) => ({
  timers: [
    {
      id: 'timer-1',
      label: '3分タイマー',
      durationMs: 3 * 60 * 1000,
      remainingMs: 3 * 60 * 1000,
      isRunning: false,
      isPaused: false,
      endTimestamp: null,
    },
    {
      id: 'timer-2',
      label: '5分タイマー',
      durationMs: 5 * 60 * 1000,
      remainingMs: 5 * 60 * 1000,
      isRunning: false,
      isPaused: false,
      endTimestamp: null,
    },
  ],

  stopwatch: {
    timeMs: 0,
    isRunning: false,
    laps: [],
    lastTick: 0,
  },

  pomodoro: {
    mode: 'work',
    remainingMs: DEFAULT_WORK_MS,
    isRunning: false,
    workDurationMs: DEFAULT_WORK_MS,
    shortBreakDurationMs: DEFAULT_SHORT_BREAK_MS,
    longBreakDurationMs: DEFAULT_LONG_BREAK_MS,
    completedCycles: 0,
    lastTick: 0,
  },

  addTimer: (label: string, durationMs: number) => {
    const newTimer: TimerItem = {
      id: `timer-${Date.now()}`,
      label: label || 'タイマー',
      durationMs,
      remainingMs: durationMs,
      isRunning: false,
      isPaused: false,
      endTimestamp: null,
    };
    set((state) => ({ timers: [...state.timers, newTimer] }));
  },

  startTimer: (id: string) => {
    set((state) => ({
      timers: state.timers.map((t) => {
        if (t.id === id) {
          const remaining = t.remainingMs <= 0 ? t.durationMs : t.remainingMs;
          return {
            ...t,
            remainingMs: remaining,
            isRunning: true,
            isPaused: false,
            endTimestamp: Date.now() + remaining,
          };
        }
        return t;
      }),
    }));
  },

  pauseTimer: (id: string) => {
    set((state) => ({
      timers: state.timers.map((t) => {
        if (t.id === id && t.isRunning) {
          return {
            ...t,
            isRunning: false,
            isPaused: true,
            endTimestamp: null,
          };
        }
        return t;
      }),
    }));
  },

  resetTimer: (id: string) => {
    set((state) => ({
      timers: state.timers.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            remainingMs: t.durationMs,
            isRunning: false,
            isPaused: false,
            endTimestamp: null,
          };
        }
        return t;
      }),
    }));
  },

  deleteTimer: (id: string) => {
    set((state) => ({
      timers: state.timers.filter((t) => t.id !== id),
    }));
  },

  startStopwatch: () => {
    set((state) => ({
      stopwatch: {
        ...state.stopwatch,
        isRunning: true,
        lastTick: Date.now(),
      },
    }));
  },

  pauseStopwatch: () => {
    set((state) => ({
      stopwatch: {
        ...state.stopwatch,
        isRunning: false,
      },
    }));
  },

  resetStopwatch: () => {
    set({
      stopwatch: {
        timeMs: 0,
        isRunning: false,
        laps: [],
        lastTick: 0,
      },
    });
  },

  recordLap: () => {
    set((state) => {
      const { timeMs, laps } = state.stopwatch;
      const lastLapTime = laps.length > 0 ? laps[laps.length - 1].timeMs : 0;
      const splitMs = timeMs - lastLapTime;
      const newLap: StopwatchLap = {
        lapNumber: laps.length + 1,
        timeMs,
        splitMs,
      };
      return {
        stopwatch: {
          ...state.stopwatch,
          laps: [...laps, newLap],
        },
      };
    });
  },

  startPomodoro: () => {
    set((state) => ({
      pomodoro: {
        ...state.pomodoro,
        isRunning: true,
        lastTick: Date.now(),
      },
    }));
  },

  pausePomodoro: () => {
    set((state) => ({
      pomodoro: {
        ...state.pomodoro,
        isRunning: false,
      },
    }));
  },

  resetPomodoro: () => {
    set((state) => ({
      pomodoro: {
        ...state.pomodoro,
        mode: 'work',
        remainingMs: state.pomodoro.workDurationMs,
        isRunning: false,
        lastTick: 0,
      },
    }));
  },

  skipPomodoroPhase: () => {
    set((state) => {
      const p = state.pomodoro;
      let nextMode: PomodoroMode = 'work';
      let nextDuration = p.workDurationMs;
      let cycles = p.completedCycles;

      if (p.mode === 'work') {
        cycles += 1;
        if (cycles % 4 === 0) {
          nextMode = 'longBreak';
          nextDuration = p.longBreakDurationMs;
        } else {
          nextMode = 'shortBreak';
          nextDuration = p.shortBreakDurationMs;
        }
      } else {
        nextMode = 'work';
        nextDuration = p.workDurationMs;
      }

      return {
        pomodoro: {
          ...p,
          mode: nextMode,
          remainingMs: nextDuration,
          completedCycles: cycles,
          isRunning: false,
          lastTick: 0,
        },
      };
    });
  },

  tickAll: (now: number) => {
    set((state) => {
      // 1. Tick Countdown Timers
      const updatedTimers = state.timers.map((t) => {
        if (!t.isRunning || !t.endTimestamp) return t;
        const diff = Math.max(0, t.endTimestamp - now);
        if (diff === 0) {
          return {
            ...t,
            remainingMs: 0,
            isRunning: false,
            isPaused: false,
            endTimestamp: null,
          };
        }
        return { ...t, remainingMs: diff };
      });

      // 2. Tick Stopwatch
      let updatedStopwatch = state.stopwatch;
      if (state.stopwatch.isRunning) {
        const delta = state.stopwatch.lastTick > 0 ? now - state.stopwatch.lastTick : 0;
        updatedStopwatch = {
          ...state.stopwatch,
          timeMs: state.stopwatch.timeMs + delta,
          lastTick: now,
        };
      }

      // 3. Tick Pomodoro
      let updatedPomodoro = state.pomodoro;
      if (state.pomodoro.isRunning) {
        const delta = state.pomodoro.lastTick > 0 ? now - state.pomodoro.lastTick : 0;
        const newRemaining = Math.max(0, state.pomodoro.remainingMs - delta);

        if (newRemaining === 0) {
          let nextMode: PomodoroMode = 'work';
          let nextDuration = state.pomodoro.workDurationMs;
          let cycles = state.pomodoro.completedCycles;

          if (state.pomodoro.mode === 'work') {
            cycles += 1;
            if (cycles % 4 === 0) {
              nextMode = 'longBreak';
              nextDuration = state.pomodoro.longBreakDurationMs;
            } else {
              nextMode = 'shortBreak';
              nextDuration = state.pomodoro.shortBreakDurationMs;
            }
          } else {
            nextMode = 'work';
            nextDuration = state.pomodoro.workDurationMs;
          }

          updatedPomodoro = {
            ...state.pomodoro,
            mode: nextMode,
            remainingMs: nextDuration,
            completedCycles: cycles,
            isRunning: false,
            lastTick: 0,
          };
        } else {
          updatedPomodoro = {
            ...state.pomodoro,
            remainingMs: newRemaining,
            lastTick: now,
          };
        }
      }

      return {
        timers: updatedTimers,
        stopwatch: updatedStopwatch,
        pomodoro: updatedPomodoro,
      };
    });
  },
}));
