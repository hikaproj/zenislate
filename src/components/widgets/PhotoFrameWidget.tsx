/**
 * Zenislate - Custom Photo Frame & Memory Gallery Widget
 * Upload personal images or paste URLs to turn the hub into an ambient digital photo frame
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState, useRef } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { CustomPhoto } from '../../types';

export const PhotoFrameWidget: React.FC = () => {
  const { settings, addCustomPhoto, removeCustomPhoto, updateSettings } = useSettingsStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoTitleInput, setPhotoTitleInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const customPhotos = settings.customPhotos || [];

  // Default fallback sample photos if no user photos
  const fallbackPhotos: CustomPhoto[] = [
    {
      id: 'fb-p1',
      title: '静寂の山嶺と朝露',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      source: 'url',
      addedAt: '初期サンプル',
    },
    {
      id: 'fb-p2',
      title: '深緑の森林浴',
      url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
      source: 'url',
      addedAt: '初期サンプル',
    },
  ];

  const activePhotoList = customPhotos.length > 0 ? customPhotos : fallbackPhotos;
  const currentPhoto = activePhotoList[currentIndex % activePhotoList.length];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activePhotoList.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activePhotoList.length);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('写真のサイズは 8MB 以下にしてください。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newPhoto: CustomPhoto = {
        id: `photo-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: dataUrl,
        source: 'upload',
        addedAt: new Date().toLocaleDateString('ja-JP'),
      };
      addCustomPhoto(newPhoto);
      setCurrentIndex(0);
      setIsAddModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrlInput.trim()) return;

    const newPhoto: CustomPhoto = {
      id: `photo-${Date.now()}`,
      title: photoTitleInput.trim() || 'カスタム写真',
      url: photoUrlInput.trim(),
      source: 'url',
      addedAt: new Date().toLocaleDateString('ja-JP'),
    };
    addCustomPhoto(newPhoto);
    setPhotoUrlInput('');
    setPhotoTitleInput('');
    setCurrentIndex(0);
    setIsAddModalOpen(false);
  };

  const isCurrentWallpaper = settings.scenicWallpaperUrl === currentPhoto?.url;

  return (
    <div className="glass-panel p-3.5 sm:p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      {/* Header */}
      <div className="h-8 shrink-0 flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <ImageIcon className="w-4 h-4 text-slate-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            フォトフレーム & 写真
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            data-focusable="true"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 text-xs transition-colors nowrap-pill"
            title="写真を追加"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>写真追加</span>
          </button>
        </div>
      </div>

      {/* Body: Photo Display */}
      <div className="flex-1 min-h-0 flex flex-col justify-center relative my-1">
        <div className="group relative w-full h-32 sm:h-36 md:h-44 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
          <img
            src={currentPhoto?.url}
            alt={currentPhoto?.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Caption Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-semibold text-white truncate">
                {currentPhoto?.title}
              </div>
              <div className="text-[10px] text-white/60">
                {currentIndex + 1} / {activePhotoList.length} • {currentPhoto?.addedAt}
              </div>
            </div>

            {/* Delete button if user custom photo */}
            {customPhotos.some((p) => p.id === currentPhoto?.id) && (
              <button
                data-focusable="true"
                onClick={() => removeCustomPhoto(currentPhoto.id)}
                className="p-1 rounded-lg bg-black/40 hover:bg-rose-500/40 text-white/60 hover:text-rose-300 transition-colors"
                title="この写真を削除"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Prev/Next arrows on hover */}
          {activePhotoList.length > 1 && (
            <>
              <button
                data-focusable="true"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition-opacity"
                title="前の写真"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                data-focusable="true"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition-opacity"
                title="次の写真"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer: Set as Wallpaper Action */}
      <div className="shrink-0 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <button
          data-focusable="true"
          onClick={() => {
            updateSettings({
              wallpaperMode: 'scenic',
              scenicWallpaperUrl: currentPhoto?.url,
            });
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all nowrap-pill ${
            isCurrentWallpaper
              ? 'bg-slate-500/20 text-slate-200 border-slate-500/30'
              : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10'
          }`}
        >
          {isCurrentWallpaper ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ImageIcon className="w-3.5 h-3.5" />}
          <span>{isCurrentWallpaper ? '壁紙に適用中' : 'この写真を壁紙に設定'}</span>
        </button>

        <span className="text-[11px] text-white/40">
          全{customPhotos.length}枚保存済
        </span>
      </div>

      {/* Add Photo Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xl p-4 animate-fade-in">
          <div className="glass-panel-elevated w-full max-w-md p-6 rounded-3xl border border-white/20 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-slate-300" />
                <h3 className="text-sm font-semibold text-white">カスタム写真を追加</h3>
              </div>
              <button
                data-focusable="true"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Option 1: Local Device File Upload */}
            <div>
              <label className="text-xs text-white/70 block mb-2 font-medium">
                端末内の画像ファイルを選択
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                data-focusable="true"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <Upload className="w-5 h-5 text-slate-300" />
                <span className="text-xs font-medium text-white">端末から画像を選択して保存</span>
                <span className="text-[10px] text-white/40">JPEG, PNG, WebP (最大8MB)</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute px-2 text-[10px] bg-slate-900 text-white/40">または URL から追加</span>
            </div>

            {/* Option 2: Image URL Form */}
            <form onSubmit={handleAddUrl} className="space-y-3">
              <div>
                <label className="text-xs text-white/70 block mb-1">写真のタイトル (任意)</label>
                <input
                  type="text"
                  placeholder="例: 家族旅行、思い出の風景"
                  value={photoTitleInput}
                  onChange={(e) => setPhotoTitleInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">画像 URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/photo.jpg"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  data-focusable="true"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl text-xs text-white/60 hover:text-white"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  data-focusable="true"
                  className="px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold border border-white/25 shadow-sm"
                >
                  写真を追加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
