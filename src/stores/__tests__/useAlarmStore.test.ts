import { describe, it, expect, beforeEach } from 'vitest';
import { useAlarmStore } from '../useAlarmStore';

describe('useAlarmStore', () => {
  beforeEach(() => {
    useAlarmStore.setState({
      alarms: [],
      activeAlarm: null,
      sunriseAlarm: null,
    });
  });

  it('adds, updates, and deletes alarms', () => {
    const store = useAlarmStore.getState();
    store.addAlarm({
      time: '08:30',
      enabled: true,
      days: [1, 2, 3],
      label: '朝会アラーム',
      soundType: 'synth-chime',
      missionType: 'math',
      missionDifficulty: 'easy',
      maxSnooze: 3,
      volume: 0.8,
      fadeInSeconds: 5,
    });

    const list = useAlarmStore.getState().alarms;
    expect(list.length).toBe(1);
    expect(list[0].time).toBe('08:30');
    expect(list[0].label).toBe('朝会アラーム');

    // Update alarm
    store.updateAlarm(list[0].id, { time: '09:00' });
    expect(useAlarmStore.getState().alarms[0].time).toBe('09:00');

    // Toggle alarm
    store.toggleAlarm(list[0].id);
    expect(useAlarmStore.getState().alarms[0].enabled).toBe(false);

    // Delete alarm
    store.deleteAlarm(list[0].id);
    expect(useAlarmStore.getState().alarms.length).toBe(0);
  });

  it('triggers and dismisses active alarm', () => {
    const store = useAlarmStore.getState();
    const mockAlarm = {
      id: 'mock-1',
      time: '07:00',
      enabled: true,
      days: [],
      label: 'アラームテスト',
      soundType: 'synth-chime' as const,
      missionType: 'none' as const,
      missionDifficulty: 'easy' as const,
      snoozeCount: 0,
      maxSnooze: 2,
      volume: 1,
      fadeInSeconds: 0,
    };

    store.triggerAlarm(mockAlarm);
    expect(useAlarmStore.getState().activeAlarm?.id).toBe('mock-1');

    store.dismissAlarm();
    expect(useAlarmStore.getState().activeAlarm).toBeNull();
  });
});
