/**
 * Zenislate - Sticky Memo Widget
 * Markdown sticky notes with color coding and pin support
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState } from 'react';
import { useMemoStore } from '../../stores/useMemoStore';
import { FileText, Plus, Pin, Trash2 } from 'lucide-react';
import { StickyMemo } from '../../types';

export const MemoWidget: React.FC = () => {
  const { memos, addMemo, deleteMemo, togglePin } = useMemoStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<StickyMemo['color']>('yellow');

  const handleCreate = () => {
    if (!newContent.trim()) return;
    addMemo(newTitle.trim() || 'メモ', newContent.trim(), selectedColor);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const getColorClasses = (color: StickyMemo['color']) => {
    switch (color) {
      case 'yellow':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-200';
      case 'cyan':
        return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200';
      case 'green':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200';
      case 'pink':
        return 'bg-pink-500/10 border-pink-500/30 text-pink-200';
      case 'purple':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-200';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <FileText className="w-4 h-4 text-slate-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            付箋メモ
          </span>
        </div>
        <button
          data-focusable="true"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 text-xs transition-colors nowrap-pill"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新規メモ</span>
        </button>
      </div>

      {/* New memo form */}
      {isAdding && (
        <div className="mb-3 p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <input
            type="text"
            placeholder="タイトル"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          />
          <textarea
            placeholder="内容 (Markdown可)"
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 resize-none"
          />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-1.5">
              {(['yellow', 'cyan', 'green', 'pink', 'purple'] as StickyMemo['color'][]).map(
                (c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-4 h-4 rounded-full border ${
                      c === 'yellow'
                        ? 'bg-amber-400'
                        : c === 'cyan'
                        ? 'bg-cyan-400'
                        : c === 'green'
                        ? 'bg-emerald-400'
                        : c === 'pink'
                        ? 'bg-pink-400'
                        : 'bg-purple-400'
                    } ${selectedColor === c ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                  />
                )
              )}
            </div>
            <button
              data-focusable="true"
              onClick={handleCreate}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg shadow transition-all"
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* Memos list */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {memos.map((memo) => (
          <div
            key={memo.id}
            className={`p-3 rounded-xl border transition-all ${getColorClasses(
              memo.color
            )}`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                {memo.pinned && <Pin className="w-3 h-3 fill-amber-400 text-amber-400" />}
                {memo.title}
              </h4>
              <div className="flex items-center space-x-1">
                <button
                  data-focusable="true"
                  onClick={() => togglePin(memo.id)}
                  className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                  title={memo.pinned ? 'ピン解除' : 'ピン留め'}
                >
                  <Pin className={`w-3 h-3 ${memo.pinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
                <button
                  data-focusable="true"
                  onClick={() => deleteMemo(memo.id)}
                  className="p-1 rounded hover:bg-rose-500/20 text-gray-400 hover:text-rose-400"
                  title="削除"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
              {memo.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
