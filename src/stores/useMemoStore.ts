/**
 * Zenislate - Sticky Memo Zustand Store with Local Storage Persistence
 * Created by Hikaproj
 * License: MIT
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StickyMemo } from '../types';

interface MemoState {
  memos: StickyMemo[];
  addMemo: (title: string, content: string, color?: StickyMemo['color']) => void;
  updateMemo: (id: string, partial: Partial<StickyMemo>) => void;
  deleteMemo: (id: string) => void;
  togglePin: (id: string) => void;
}

const initialMemos: StickyMemo[] = [
  {
    id: 'memo-1',
    title: 'Zenislate へようこそ',
    content: '- 常時稼働スマートディスプレイ\n- 7大特化モード切り替え可能\n- TVリモコン十字キー操作対応',
    color: 'yellow',
    pinned: true,
    updatedAt: Date.now(),
  },
  {
    id: 'memo-2',
    title: 'やることリスト',
    content: '- [x] コア基盤起動\n- [ ] アラーム設定テスト\n- [ ] 環境音ミキサーで集中',
    color: 'cyan',
    pinned: false,
    updatedAt: Date.now(),
  },
];

export const useMemoStore = create<MemoState>()(
  persist(
    (set) => ({
      memos: initialMemos,
      addMemo: (title, content, color = 'yellow') => {
        const newMemo: StickyMemo = {
          id: `memo-${Date.now()}`,
          title: title || 'メモ',
          content,
          color,
          pinned: false,
          updatedAt: Date.now(),
        };
        set((state) => ({ memos: [newMemo, ...state.memos] }));
      },
      updateMemo: (id, partial) => {
        set((state) => ({
          memos: state.memos.map((m) =>
            m.id === id ? { ...m, ...partial, updatedAt: Date.now() } : m
          ),
        }));
      },
      deleteMemo: (id) => {
        set((state) => ({
          memos: state.memos.filter((m) => m.id !== id),
        }));
      },
      togglePin: (id) => {
        set((state) => ({
          memos: state.memos.map((m) =>
            m.id === id ? { ...m, pinned: !m.pinned } : m
          ),
        }));
      },
    }),
    {
      name: 'zenislate-memos-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
