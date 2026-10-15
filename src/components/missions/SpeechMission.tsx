/**
 * Zenislate - Morning Speech Briefing Mission
 * Reads out date, time, and morning briefing with Web Speech API
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';

interface SpeechMissionProps {
  onComplete: () => void;
}

export const SpeechMission: React.FC<SpeechMissionProps> = ({ onComplete }) => {
  const { settings } = useSettingsStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [briefingText, setBriefingText] = useState('');

  useEffect(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
    const timeStr = `${now.getHours()}時${now.getMinutes()}分`;

    const text = `おはようございます。今日は${dateStr}、現在時刻は${timeStr}です。${settings.cityName}の朝です。今日も素晴らしい一日をお過ごしください。`;
    setBriefingText(text);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ja-JP';
      utter.rate = 1.0;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => {
        setIsSpeaking(false);
        setTimeout(onComplete, 1000);
      };
      utter.onerror = () => {
        setIsSpeaking(false);
        onComplete();
      };
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(onComplete, 3000);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [settings.cityName, onComplete]);

  return (
    <div className="flex flex-col items-center max-w-sm w-full p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 mb-4 animate-pulse">
        <Volume2 className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-xl font-bold font-display text-white mb-2">
        朝の音声ブリーフィング
      </h3>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-200 leading-relaxed my-4">
        {briefingText}
      </div>

      <p className="text-xs text-sky-400">
        {isSpeaking ? '音声を読み上げています...' : '読み上げ完了'}
      </p>

      <button
        data-focusable="true"
        onClick={onComplete}
        className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-gray-300 transition-colors"
      >
        読み上げをスキップして停止
      </button>
    </div>
  );
};
