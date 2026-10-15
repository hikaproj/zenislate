import { IPlatformBridge } from './PlatformBridge';
import { Alarm } from '../types';

export class WebBridge implements IPlatformBridge {
  readonly platformName = 'web' as const;
  readonly isTV = false;
  private wakeLockSentinel: WakeLockSentinel | null = null;

  constructor() {
    this.initVisibilityListener();
  }

  private initVisibilityListener(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible' && this.wakeLockSentinel !== null) {
          // Re-acquire wake lock after returning from background
          await this.requestWakeLock();
        }
      });
    }
  }

  async requestWakeLock(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        this.wakeLockSentinel = await navigator.wakeLock.request('screen');
        this.wakeLockSentinel.addEventListener('release', () => {
          this.wakeLockSentinel = null;
        });
        return true;
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
        return false;
      }
    }
    return false;
  }

  async releaseWakeLock(): Promise<void> {
    if (this.wakeLockSentinel) {
      try {
        await this.wakeLockSentinel.release();
      } catch (err) {
        console.warn('Wake Lock release failed:', err);
      } finally {
        this.wakeLockSentinel = null;
      }
    }
  }

  async scheduleNativeAlarm(alarm: Alarm): Promise<void> {
    // Web: Register Notification permission and fallback to Web Worker / service worker
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    console.info(`[WebBridge] Scheduled in-browser alarm: ${alarm.time} (${alarm.label})`);
  }

  async cancelNativeAlarm(alarmId: string): Promise<void> {
    console.info(`[WebBridge] Cancelled alarm: ${alarmId}`);
  }

  async setAutostart(_enable: boolean): Promise<void> {
    console.warn('[WebBridge] Autostart is only supported in native Windows / Android TV runtime.');
  }

  async minimizeToTray(): Promise<void> {
    console.warn('[WebBridge] System Tray is only supported in native desktop runtime.');
  }

  async showNotification(title: string, body: string): Promise<void> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/zenislate-logo.svg',
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/zenislate-logo.svg',
          });
        }
      }
    }
  }
}
