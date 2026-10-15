import { describe, it, expect } from 'vitest';
import { JapaneseHolidayEngine } from './JapaneseHolidays';

describe('JapaneseHolidayEngine', () => {
  it('correctly identifies fixed holidays', () => {
    const res = JapaneseHolidayEngine.isHoliday(new Date(2024, 0, 1)); // 2024-01-01
    expect(res.isHoliday).toBe(true);
    expect(res.name).toBe('元日');

    const res2 = JapaneseHolidayEngine.isHoliday(new Date(2024, 1, 11)); // 2024-02-11 建国記念の日 (Sunday)
    expect(res2.isHoliday).toBe(true);
    expect(res2.name).toBe('建国記念の日');

    // 2024-02-12 should be 振替休日
    const res3 = JapaneseHolidayEngine.isHoliday(new Date(2024, 1, 12));
    expect(res3.isHoliday).toBe(true);
    expect(res3.name).toBe('振替休日');
  });

  it('correctly calculates happy monday holidays', () => {
    // 2024 成人の日 (2nd Monday of January: Jan 8, 2024)
    const res = JapaneseHolidayEngine.isHoliday(new Date(2024, 0, 8));
    expect(res.isHoliday).toBe(true);
    expect(res.name).toBe('成人の日');

    // 2024 スポーツの日 (2nd Monday of October: Oct 14, 2024)
    const sportsDay = JapaneseHolidayEngine.isHoliday(new Date(2024, 9, 14));
    expect(sportsDay.isHoliday).toBe(true);
    expect(sportsDay.name).toBe('スポーツの日');
  });

  it('correctly calculates vernal and autumnal equinox', () => {
    // 2024 春分の日: March 20
    const vernal2024 = JapaneseHolidayEngine.isHoliday(new Date(2024, 2, 20));
    expect(vernal2024.isHoliday).toBe(true);
    expect(vernal2024.name).toBe('春分の日');

    // 2024 秋分の日: September 22
    const autumnal2024 = JapaneseHolidayEngine.isHoliday(new Date(2024, 8, 22));
    expect(autumnal2024.isHoliday).toBe(true);
    expect(autumnal2024.name).toBe('秋分の日');
  });

  it('returns false for ordinary weekdays', () => {
    const ordinary = JapaneseHolidayEngine.isHoliday(new Date(2024, 3, 10)); // 2024-04-10
    expect(ordinary.isHoliday).toBe(false);
    expect(ordinary.name).toBeUndefined();
  });
});
