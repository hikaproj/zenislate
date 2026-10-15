/**
 * Zenislate - Weather Widget with Open-Meteo API
 * 100% Free, No API Key required, CC BY 4.0 compliance
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  CloudFog,
} from 'lucide-react';
import { WeatherInfo } from '../../types';

export const WeatherWidget: React.FC = () => {
  const { settings } = useSettingsStore();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${settings.latitude}&longitude=${settings.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();

        if (isMounted) {
          const daily = (data.daily?.time || []).slice(0, 5).map((date: string, idx: number) => ({
            date,
            weatherCode: data.daily.weather_code[idx],
            maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
            minTemp: Math.round(data.daily.temperature_2m_min[idx]),
          }));

          setWeather({
            temperature: Math.round(data.current?.temperature_2m ?? 20),
            weatherCode: data.current?.weather_code ?? 0,
            windSpeed: Math.round(data.current?.wind_speed_10m ?? 0),
            humidity: Math.round(data.current?.relative_humidity_2m ?? 50),
            daily,
            cityName: settings.cityName || '東京都',
            updatedAt: Date.now(),
          });
          setLoading(false);
        }
      } catch (err) {
        console.warn('Zenislate: Weather fetch fallback to offline demo data', err);
        if (isMounted) {
          // Reliable fallback
          setWeather({
            temperature: 22,
            weatherCode: 1,
            windSpeed: 3,
            humidity: 55,
            daily: [
              { date: '今日', weatherCode: 1, maxTemp: 24, minTemp: 18 },
              { date: '明日', weatherCode: 2, maxTemp: 23, minTemp: 17 },
              { date: '明後日', weatherCode: 61, maxTemp: 21, minTemp: 16 },
            ],
            cityName: settings.cityName || '東京都',
            updatedAt: Date.now(),
          });
          setLoading(false);
        }
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [settings.latitude, settings.longitude, settings.cityName]);

  const getWeatherVisual = (code: number) => {
    if (code === 0) {
      return { label: '快晴', icon: <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" /> };
    }
    if (code === 1 || code === 2) {
      return { label: '晴れ時々曇', icon: <CloudSun className="w-8 h-8 text-amber-300" /> };
    }
    if (code === 3) {
      return { label: '曇り', icon: <Cloud className="w-8 h-8 text-gray-300" /> };
    }
    if (code === 45 || code === 48) {
      return { label: '霧', icon: <CloudFog className="w-8 h-8 text-gray-400" /> };
    }
    if (code >= 51 && code <= 67 || (code >= 80 && code <= 82)) {
      return { label: '雨', icon: <CloudRain className="w-8 h-8 text-sky-400" /> };
    }
    if (code >= 71 && code <= 77 || code === 85 || code === 86) {
      return { label: '雪', icon: <CloudSnow className="w-8 h-8 text-blue-200" /> };
    }
    if (code >= 95) {
      return { label: '雷雨', icon: <CloudLightning className="w-8 h-8 text-yellow-400" /> };
    }
    return { label: '晴れ', icon: <Sun className="w-8 h-8 text-amber-400" /> };
  };

  if (loading || !weather) {
    return (
      <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none items-center justify-center">
        <div className="text-xs text-white/50 animate-pulse">気象データを取得中...</div>
      </div>
    );
  }

  const currentVisual = getWeatherVisual(weather.weatherCode);

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      {/* Header City & Condition */}
      <div className="h-8 shrink-0 flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {weather.cityName}
          </span>
          <div className="text-xs font-medium text-white/80">{currentVisual.label}</div>
        </div>
        {currentVisual.icon}
      </div>

      {/* Main Temperature & Details */}
      <div className="flex items-baseline justify-between my-2">
        <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tight">
          {weather.temperature}°<span className="text-2xl font-light text-gray-300">C</span>
        </div>

        <div className="flex flex-col text-right space-y-1 text-xs text-gray-400">
          <div className="flex items-center justify-end gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span>湿度: {weather.humidity}%</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span>風速: {weather.windSpeed} m/s</span>
          </div>
        </div>
      </div>

      {/* Daily Forecast Strip */}
      {weather.daily.length > 0 && (
        <div className="grid grid-cols-5 gap-1 pt-3 mt-2 border-t border-white/5 text-center">
          {weather.daily.map((day, idx) => {
            const visual = getWeatherVisual(day.weatherCode);
            const dateObj = new Date(day.date);
            const dayLabel = idx === 0 ? '今日' : `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
            return (
              <div key={day.date} className="flex flex-col items-center p-1 rounded-lg bg-white/5">
                <span className="text-[10px] text-gray-400 mb-1">{dayLabel}</span>
                <div className="scale-75 my-0.5">{visual.icon}</div>
                <div className="text-[11px] font-mono font-semibold text-white">
                  {day.maxTemp}°
                </div>
                <div className="text-[10px] font-mono text-gray-400">
                  {day.minTemp}°
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Open-Meteo CC BY 4.0 Credit (Mandatory requirement) */}
      <div className="mt-3 pt-2 border-t border-white/5 text-[9px] text-gray-500 text-center">
        Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline hover:text-gray-400">Open-Meteo.com</a> (CC BY 4.0)
      </div>
    </div>
  );
};
