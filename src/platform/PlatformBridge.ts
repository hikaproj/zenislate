import { Alarm } from '../types';

export interface IPlatformBridge {
  readonly platformName: 'web' | 'android' | 'windows';
  readonly isTV: boolean;

  // 画面消灯防止 (Wake Lock)
  requestWakeLock(): Promise<boolean>;
  releaseWakeLock(): Promise<void>;

  // アラーム・バックグラウンド連携
  scheduleNativeAlarm(alarm: Alarm): Promise<void>;
  cancelNativeAlarm(alarmId: string): Promise<void>;

  // OS設定連携 (Windows / Android)
  setAutostart(enable: boolean): Promise<void>;
  minimizeToTray(): Promise<void>;

  // デバイス通知
  showNotification(title: string, body: string): Promise<void>;
}

// Global factory / singleton resolver
let bridgeInstance: IPlatformBridge | null = null;

export const getPlatformBridge = async (): Promise<IPlatformBridge> => {
  if (bridgeInstance) return bridgeInstance;

  // Check Windows Tauri v2
  if (typeof window !== 'undefined' && ('__TAURI__' in window || '__TAURI_INTERNALS__' in window)) {
    const { WindowsBridge } = await import('./WindowsBridge');
    bridgeInstance = new WindowsBridge();
    return bridgeInstance;
  }

  // Check Android Capacitor
  if (typeof window !== 'undefined' && (window as unknown as { Capacitor?: { isNativePlatform: () => boolean } }).Capacitor?.isNativePlatform()) {
    const { AndroidBridge } = await import('./AndroidBridge');
    bridgeInstance = new AndroidBridge();
    return bridgeInstance;
  }

  // Default to standard Web
  const { WebBridge } = await import('./WebBridge');
  bridgeInstance = new WebBridge();
  return bridgeInstance;
};
