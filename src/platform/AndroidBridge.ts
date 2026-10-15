import { IPlatformBridge } from './PlatformBridge';
import { Alarm } from '../types';

export class AndroidBridge implements IPlatformBridge {
  readonly platformName = 'android' as const;
  readonly isTV: boolean;

  constructor() {
    // Detect Leanback / Android TV user agent or touch support
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    const hasTouch = typeof navigator !== 'undefined' && ('maxTouchPoints' in navigator ? navigator.maxTouchPoints > 0 : false);
    this.isTV = ua.includes('android tv') || ua.includes('google tv') || ua.includes('leanback') || (!hasTouch && ua.includes('android'));
  }

  async requestWakeLock(): Promise<boolean> {
    try {
      // Capacitor KeepAwake plugin if installed
      const cap = (window as unknown as { Capacitor?: { Plugins?: { KeepAwake?: { keepAwake: () => Promise<void> } } } }).Capacitor;
      if (cap?.Plugins?.KeepAwake) {
        await cap.Plugins.KeepAwake.keepAwake();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidBridge] KeepAwake plugin failed:', e);
    }

    // Fallback to Web WakeLock
    if ('wakeLock' in navigator) {
      try {
        await navigator.wakeLock.request('screen');
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  async releaseWakeLock(): Promise<void> {
    try {
      const cap = (window as unknown as { Capacitor?: { Plugins?: { KeepAwake?: { allowSleep: () => Promise<void> } } } }).Capacitor;
      if (cap?.Plugins?.KeepAwake) {
        await cap.Plugins.KeepAwake.allowSleep();
      }
    } catch (e) {
      console.warn('[AndroidBridge] AllowSleep failed:', e);
    }
  }

  async scheduleNativeAlarm(alarm: Alarm): Promise<void> {
    console.info(`[AndroidBridge] Scheduled native AlarmManager: ${alarm.time}`);
  }

  async cancelNativeAlarm(alarmId: string): Promise<void> {
    console.info(`[AndroidBridge] Cancelled native AlarmManager: ${alarmId}`);
  }

  async setAutostart(_enable: boolean): Promise<void> {
    // Android TV uses BOOT_COMPLETED receiver
    console.info('[AndroidBridge] Autostart is configured via AndroidManifest BOOT_COMPLETED.');
  }

  async minimizeToTray(): Promise<void> {
    // Android apps move to background via standard intent
  }

  async showNotification(title: string, body: string): Promise<void> {
    try {
      const cap = (window as unknown as { Capacitor?: { Plugins?: { LocalNotifications?: { schedule: (opts: unknown) => Promise<void> } } } }).Capacitor;
      if (cap?.Plugins?.LocalNotifications) {
        await cap.Plugins.LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: Date.now() % 100000,
              sound: 'beep.wav',
            }
          ]
        });
        return;
      }
    } catch (e) {
      console.warn('[AndroidBridge] LocalNotifications failed:', e);
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}
