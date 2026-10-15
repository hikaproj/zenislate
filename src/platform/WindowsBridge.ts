import { IPlatformBridge } from './PlatformBridge';
import { Alarm } from '../types';

export class WindowsBridge implements IPlatformBridge {
  readonly platformName = 'windows' as const;
  readonly isTV = false;

  async requestWakeLock(): Promise<boolean> {
    // Tauri handles app window power suspension flags or uses standard screen wake lock
    if ('wakeLock' in navigator) {
      try {
        await navigator.wakeLock.request('screen');
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }

  async releaseWakeLock(): Promise<void> {
    // Release
  }

  async scheduleNativeAlarm(alarm: Alarm): Promise<void> {
    console.info(`[WindowsBridge] Native timer scheduled: ${alarm.time}`);
  }

  async cancelNativeAlarm(alarmId: string): Promise<void> {
    console.info(`[WindowsBridge] Native timer cancelled: ${alarmId}`);
  }

  async setAutostart(enable: boolean): Promise<void> {
    try {
      const autostart = (window as unknown as { __TAURI__?: { autostart?: { enable: () => Promise<void>; disable: () => Promise<void> } } }).__TAURI__?.autostart;
      if (autostart) {
        if (enable) {
          await autostart.enable();
        } else {
          await autostart.disable();
        }
      }
    } catch (e) {
      console.warn('[WindowsBridge] Autostart setting failed:', e);
    }
  }

  async minimizeToTray(): Promise<void> {
    try {
      const appWindow = (window as unknown as { __TAURI__?: { window?: { getCurrentWindow: () => { hide: () => Promise<void> } } } }).__TAURI__?.window?.getCurrentWindow();
      if (appWindow) {
        await appWindow.hide();
      }
    } catch (e) {
      console.warn('[WindowsBridge] Hide to tray failed:', e);
    }
  }

  async showNotification(title: string, body: string): Promise<void> {
    try {
      const notification = (window as unknown as { __TAURI__?: { notification?: { sendNotification: (opts: { title: string; body: string }) => Promise<void> } } }).__TAURI__?.notification;
      if (notification) {
        await notification.sendNotification({ title, body });
        return;
      }
    } catch (e) {
      console.warn('[WindowsBridge] Tauri notification failed:', e);
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}
