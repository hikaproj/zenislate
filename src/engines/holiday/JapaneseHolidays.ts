/**
 * Zenislate - Japanese Holiday Calculation Engine
 * Pure TypeScript Astronomical & Calendar algorithm without external APIs
 * Created by Hikaproj
 * License: MIT
 */

export interface Holiday {
  dateString: string; // "YYYY-MM-DD"
  name: string;
}

export class JapaneseHolidayEngine {
  /**
   * Astronomical estimation of Vernal Equinox (春分の日) for years 1900-2099
   */
  public static getVernalEquinoxDay(year: number): number {
    if (year >= 1980 && year <= 2099) {
      return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
    }
    return 20;
  }

  /**
   * Astronomical estimation of Autumnal Equinox (秋分の日) for years 1900-2099
   */
  public static getAutumnalEquinoxDay(year: number): number {
    if (year >= 1980 && year <= 2099) {
      return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
    }
    return 23;
  }

  /**
   * Calculate N-th Monday of a given month
   */
  private static getNthMonday(year: number, month: number, nth: number): number {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const offset = (8 - firstDay) % 7;
    return 1 + offset + (nth - 1) * 7;
  }

  /**
   * Format helper: YYYY-MM-DD
   */
  private static formatDate(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  /**
   * Calculate all holidays for a given year
   */
  public static getHolidays(year: number): Map<string, string> {
    const map = new Map<string, string>();
    const add = (m: number, d: number, name: string) => {
      map.set(this.formatDate(year, m, d), name);
    };

    // Fixed holidays
    add(1, 1, '元日');
    add(2, 11, '建国記念の日');
    if (year >= 2020) {
      add(2, 23, '天皇誕生日');
    } else if (year >= 1989 && year <= 2018) {
      add(12, 23, '天皇誕生日');
    }
    add(4, 29, '昭和の日');
    add(5, 3, '憲法記念日');
    add(5, 4, 'みどりの日');
    add(5, 5, 'こどもの日');
    add(8, 11, '山の日');
    add(11, 3, '文化の日');
    add(11, 23, '勤労感謝の日');

    // Happy Monday (第N月曜日)
    add(1, this.getNthMonday(year, 1, 2), '成人の日');
    add(7, this.getNthMonday(year, 7, 3), '海の日');
    add(9, this.getNthMonday(year, 9, 3), '敬老の日');
    add(10, this.getNthMonday(year, 10, 2), 'スポーツの日');

    // Astronomical holidays
    const vernalDay = this.getVernalEquinoxDay(year);
    add(3, vernalDay, '春分の日');

    const autumnalDay = this.getAutumnalEquinoxDay(year);
    add(9, autumnalDay, '秋分の日');

    // 国民の休日 (Sandwiched between two holidays)
    // E.g. Silver Week in September: when 敬老の日 (Monday) and 秋分の日 (Wednesday) have Tuesday in between
    const respectForAgedDay = this.getNthMonday(year, 9, 3);
    if (autumnalDay - respectForAgedDay === 2) {
      add(9, respectForAgedDay + 1, '国民の休日');
    }

    // 振替休日 (Substitute Holiday)
    // If a holiday is on a Sunday, the next weekday that is not a holiday becomes a substitute holiday
    const sortedDates = Array.from(map.keys()).sort();
    for (const dStr of sortedDates) {
      const parts = dStr.split('-').map(Number);
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      if (date.getDay() === 0) {
        // Sunday
        let target = new Date(parts[0], parts[1] - 1, parts[2]);
        while (true) {
          target.setDate(target.getDate() + 1);
          const tStr = this.formatDate(target.getFullYear(), target.getMonth() + 1, target.getDate());
          if (!map.has(tStr)) {
            map.set(tStr, '振替休日');
            break;
          }
        }
      }
    }

    return map;
  }

  /**
   * Check if a specific date is a holiday
   */
  public static isHoliday(date: Date): { isHoliday: boolean; name?: string } {
    const year = date.getFullYear();
    const holidays = this.getHolidays(year);
    const dateStr = this.formatDate(year, date.getMonth() + 1, date.getDate());
    const name = holidays.get(dateStr);
    return {
      isHoliday: !!name,
      name,
    };
  }
}
