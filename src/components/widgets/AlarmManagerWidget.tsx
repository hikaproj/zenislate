/**
 * Zenislate - Alarm Manager Widget for Home Dashboard
 * Shows upcoming alarms, next alarm countdown, and quick toggle/edit
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState } from 'react';
import { useAlarmStore } from '../../stores/useAlarmStore';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';
import { MissionType, MissionDifficulty } from '../../types';

interface AlarmManagerWidgetProps {
  onOpenCreate?: () => void;
}

export const AlarmManagerWidget: React.FC<AlarmManagerWidgetProps> = () => {
  const { alarms, toggleAlarm, deleteAlarm, addAlarm } = useAlarmStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTime, setNewTime] = useState('07:00');
  const [newLabel, setNewLabel] = useState('アラーム');
  const [newMission, setNewMission] = useState<MissionType>('none');
  const [newDifficulty, setNewDifficulty] = useState<MissionDifficulty>('easy');
  const [newDays, setNewDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const nextAlarm = alarms.find((a) => a.enabled);

  const getMissionBadge = (type: MissionType) => {
    switch (type) {
      case 'math':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-semibold border border-rose-500/30">暗算解除</span>;
      case 'briefing':
        return <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-semibold border border-sky-500/30">音声朝礼</span>;
      case 'sunrise':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">朝焼け調光</span>;
      case 'shake':
        return <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-semibold border border-yellow-500/30">連打解除</span>;
      case 'simon':
        return <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30">記憶ゲーム</span>;
      case 'qr':
        return <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-semibold border border-teal-500/30">QRコード</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 text-[10px]">通常停止</span>;
    }
  };

  const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

  const toggleDay = (d: number) => {
    if (newDays.includes(d)) {
      setNewDays(newDays.filter((x) => x !== d));
    } else {
      setNewDays([...newDays, d].sort());
    }
  };

  const handleSaveNew = () => {
    addAlarm({
      time: newTime,
      label: newLabel || 'アラーム',
      enabled: true,
      days: newDays,
      soundType: newMission === 'sunrise' ? 'sunrise' : 'synth-chime',
      missionType: newMission,
      missionDifficulty: newDifficulty,
      maxSnooze: 3,
      volume: 0.8,
      fadeInSeconds: 5,
    });
    setIsCreating(false);
    setNewLabel('アラーム');
  };

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      {/* Header */}
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <Bell className="w-4 h-4 text-slate-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            アラーム管理
          </span>
        </div>
        <button
          data-focusable="true"
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 text-xs transition-colors nowrap-pill"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新規追加</span>
        </button>
      </div>

      {/* Next Alarm Alert Ribbon */}
      {nextAlarm && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-rose-300 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>次回: {nextAlarm.time}</span>
          </div>
          <span className="text-gray-400 truncate max-w-[140px] text-right">
            {nextAlarm.label}
          </span>
        </div>
      )}

      {/* Create Alarm Drawer / Form */}
      {isCreating && (
        <div className="mb-4 p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 font-mono text-xl text-white font-bold focus:outline-none focus:border-rose-400"
            />
            <input
              type="text"
              placeholder="ラベル (例: 起床)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Days picker */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-400">曜日:</span>
            <div className="flex gap-1">
              {dayLabels.map((lbl, idx) => (
                <button
                  key={idx}
                  type="button"
                  data-focusable="true"
                  onClick={() => toggleDay(idx)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all ${
                    newDays.includes(idx)
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Mission selector */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400">解除ミッション:</span>
            <select
              value={newMission}
              onChange={(e) => setNewMission(e.target.value as MissionType)}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white"
            >
              <option value="none">通常解除（ボタン押下）</option>
              <option value="math">計算ミッション（暗算3問）</option>
              <option value="briefing">朝の音声ブリーフィング（読み上げ）</option>
              <option value="sunrise">サンライズ調光（朝焼け光目覚まし）</option>
              <option value="shake">シェイク連打（30回タップ）</option>
              <option value="simon">サイモンゲーム（4色記憶）</option>
              <option value="qr">QRコードスキャン</option>
            </select>
          </div>

          {newMission === 'math' && (
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-[10px] text-gray-400">難易度:</span>
              {(['easy', 'medium', 'hard'] as MissionDifficulty[]).map((dif) => (
                <button
                  key={dif}
                  type="button"
                  onClick={() => setNewDifficulty(dif)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    newDifficulty === dif
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {dif === 'easy' ? '初級' : dif === 'medium' ? '中級' : '上級'}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
            <button
              data-focusable="true"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white"
            >
              キャンセル
            </button>
            <button
              data-focusable="true"
              onClick={handleSaveNew}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 font-bold text-xs text-white shadow-md shadow-rose-500/20"
            >
              登録する
            </button>
          </div>
        </div>
      )}

      {/* Alarms List */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
              alarm.enabled
                ? 'bg-white/5 border-rose-500/30'
                : 'bg-white/5 border-white/5 opacity-60'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-bold text-white tracking-tight">
                  {alarm.time}
                </span>
                {getMissionBadge(alarm.missionType)}
              </div>
              <div className="text-xs text-gray-300 truncate mt-0.5">
                {alarm.label}
              </div>
              <div className="text-[10px] text-gray-500 flex gap-1 mt-1 font-mono">
                {alarm.days.length === 0
                  ? '1回のみ'
                  : dayLabels.map((d, i) => (
                      <span
                        key={i}
                        className={alarm.days.includes(i) ? 'text-rose-400 font-bold' : 'opacity-30'}
                      >
                        {d}
                      </span>
                    ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {/* Toggle Switch */}
              <button
                data-focusable="true"
                onClick={() => toggleAlarm(alarm.id)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  alarm.enabled ? 'bg-rose-500' : 'bg-white/20'
                }`}
                aria-label={alarm.enabled ? 'アラーム無効化' : 'アラーム有効化'}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    alarm.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <button
                data-focusable="true"
                onClick={() => deleteAlarm(alarm.id)}
                className="p-1.5 rounded-lg hover:bg-rose-500/20 text-gray-500 hover:text-rose-400 transition-colors"
                aria-label="削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
