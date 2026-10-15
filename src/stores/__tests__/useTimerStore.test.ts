import { describe, it, expect, beforeEach } from 'vitest';
import { useTimerStore } from '../useTimerStore';

describe('useTimerStore', () => {
  beforeEach(() => {
    useTimerStore.setState({
      timers: [],
      stopwatch: { timeMs: 0, isRunning: false, laps: [], lastTick: 0 },
      pomodoro: {
        mode: 'work',
        remainingMs: 25 * 60 * 1000,
        isRunning: false,
        workDurationMs: 25 * 60 * 1000,
        shortBreakDurationMs: 5 * 60 * 1000,
        longBreakDurationMs: 15 * 60 * 1000,
        completedCycles: 0,
        lastTick: 0,
      },
    });
  });

  it('adds and manages countdown timers correctly', () => {
    const store = useTimerStore.getState();
    store.addTimer('テストタイマー', 60000);

    const updated = useTimerStore.getState();
    expect(updated.timers.length).toBe(1);
    expect(updated.timers[0].label).toBe('テストタイマー');
    expect(updated.timers[0].remainingMs).toBe(60000);

    // Start timer
    store.startTimer(updated.timers[0].id);
    expect(useTimerStore.getState().timers[0].isRunning).toBe(true);

    // Pause timer
    store.pauseTimer(updated.timers[0].id);
    expect(useTimerStore.getState().timers[0].isRunning).toBe(false);

    // Delete timer
    store.deleteTimer(updated.timers[0].id);
    expect(useTimerStore.getState().timers.length).toBe(0);
  });

  it('records laps on stopwatch', () => {
    const store = useTimerStore.getState();
    store.startStopwatch();
    expect(useTimerStore.getState().stopwatch.isRunning).toBe(true);

    // Simulate elapsed time
    useTimerStore.setState((s) => ({
      stopwatch: { ...s.stopwatch, timeMs: 5000 },
    }));

    store.recordLap();
    const laps = useTimerStore.getState().stopwatch.laps;
    expect(laps.length).toBe(1);
    expect(laps[0].lapNumber).toBe(1);
    expect(laps[0].timeMs).toBe(5000);

    store.resetStopwatch();
    expect(useTimerStore.getState().stopwatch.timeMs).toBe(0);
    expect(useTimerStore.getState().stopwatch.laps.length).toBe(0);
  });

  it('handles pomodoro phase transitions', () => {
    const store = useTimerStore.getState();
    expect(store.pomodoro.mode).toBe('work');

    // Skip to next phase (short break)
    store.skipPomodoroPhase();
    const nextState = useTimerStore.getState().pomodoro;
    expect(nextState.mode).toBe('shortBreak');
    expect(nextState.completedCycles).toBe(1);

    // Skip back to work
    store.skipPomodoroPhase();
    expect(useTimerStore.getState().pomodoro.mode).toBe('work');
  });
});
