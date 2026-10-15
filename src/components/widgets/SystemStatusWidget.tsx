/**
 * Zenislate - System Status & Device Vitals Widget
 * Monitors online connectivity, ping latency, display uptime, and quick ambient controls
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Activity, Battery, Clock, VolumeX, ShieldCheck, RefreshCw } from 'lucide-react';
import { useMediaStore } from '../../stores/useMediaStore';
import { useSettingsStore } from '../../stores/useSettingsStore';

export const SystemStatusWidget: React.FC = () => {
  const { stopAllAmbient, pauseRadio, isRadioPlaying } = useMediaStore();
  const { settings, updateSettings } = useSettingsStore();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  // Monitor network status & latency
  const measurePing = async () => {
    const start = performance.now();
    try {
      await fetch('https://1.1.1.1/cdn-cgi/trace', { mode: 'no-cors', cache: 'no-store' });
      setLatencyMs(Math.round(performance.now() - start));
      setIsOnline(true);
    } catch {
      setLatencyMs(null);
      setIsOnline(navigator.onLine);
    }
  };

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); measurePing(); };
    const handleOffline = () => { setIsOnline(false); setLatencyMs(null); };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    measurePing();
    const pingTimer = setInterval(measurePing, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(pingTimer);
    };
  }, []);

  // Monitor Battery API
  useEffect(() => {
    if ('getBattery' in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    }
  }, []);

  // Uptime counter
  useEffect(() => {
    const timer = setInterval(() => setUptimeSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}時間${m}分`;
    return `${m}分${s}秒`;
  };

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      {/* Header */}
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <Activity className="w-4 h-4 text-slate-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            端末ステータス
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20 nowrap-pill">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
          <span>{isOnline ? 'オンライン' : 'オフライン'}</span>
        </div>
      </div>

      {/* Body: Vitals Grid */}
      <div className="flex-1 min-h-0 flex flex-col justify-center space-y-2.5 my-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Network Latency */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 text-[11px]">
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5" />
                通信応答
              </span>
              <button
                data-focusable="true"
                onClick={measurePing}
                className="hover:text-white transition-colors"
                title="再計測"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <div className="font-mono text-base font-bold text-white mt-1">
              {latencyMs !== null ? `${latencyMs}ms` : '計測中...'}
            </div>
            <div className="text-[10px] text-white/40 truncate">Cloudflare CDN</div>
          </div>

          {/* Battery / Power */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 text-[11px]">
              <span className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5" />
                バッテリー
              </span>
              {isCharging && (
                <span className="text-[10px] font-medium text-emerald-300">給電中</span>
              )}
            </div>
            <div className="font-mono text-base font-bold text-white mt-1">
              {batteryLevel !== null ? `${batteryLevel}%` : '常時給電'}
            </div>
            <div className="text-[10px] text-white/40 truncate">
              {isCharging ? 'ACアダプター接続' : '内蔵バッテリー駆動'}
            </div>
          </div>
        </div>

        {/* Display Uptime & Resource Attrib */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-[11px] text-white/50">連続稼働時間 (Uptime)</div>
              <div className="text-xs font-mono font-semibold text-white">{formatUptime(uptimeSeconds)}</div>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>0円運用・省電力</span>
          </div>
        </div>
      </div>

      {/* Footer: Quick Control Toggles */}
      <div className="shrink-0 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <button
          data-focusable="true"
          onClick={() => {
            stopAllAmbient();
            if (isRadioPlaying) pauseRadio();
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all nowrap-pill"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>全消音 (Mute All)</span>
        </button>

        <button
          data-focusable="true"
          onClick={() =>
            updateSettings({
              screenBrightness: settings.screenBrightness === 50 ? 100 : 50,
            })
          }
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all nowrap-pill"
        >
          <span>調光 {settings.screenBrightness || 100}%</span>
        </button>
      </div>
    </div>
  );
};
