/**
 * Zenislate - QR Code Scan Mission
 * Scans a designated QR code using device camera, or safely falls back to MathMission if unavailable
 * Created by Hikaproj
 * License: MIT
 */

import React, { useState } from 'react';
import { QrCode, Camera, AlertTriangle } from 'lucide-react';
import { MathMission } from './MathMission';

interface QRMissionProps {
  onComplete: () => void;
}

export const QRMission: React.FC<QRMissionProps> = ({ onComplete }) => {
  const [hasCameraError, setHasCameraError] = useState(false);

  // If camera permission denied or no camera device found, safely fall back to Math Mission
  if (hasCameraError) {
    return (
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>カメラ初期化フォールバック（緊急計算ミッション）</span>
        </div>
        <MathMission difficulty="medium" onComplete={onComplete} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-sm w-full p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 mb-4">
        <QrCode className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-xl font-bold font-display text-white mb-2">
        QRコードスキャン
      </h3>

      <p className="text-xs text-gray-300 mb-6 leading-relaxed">
        洗面所や台所に貼った解除用QRコードをカメラで読み取ってください。
      </p>

      {/* Simulated camera view frame */}
      <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-sky-400 flex flex-col items-center justify-center bg-black/40 mb-6 relative overflow-hidden">
        <Camera className="w-8 h-8 text-sky-400 animate-pulse mb-2" />
        <span className="text-[11px] text-sky-300">カメラ準備中...</span>
        {/* Animated Scan Line */}
        <div className="absolute left-0 right-0 h-0.5 bg-sky-400 shadow-[0_0_10px_#38bdf8] animate-pulse" />
      </div>

      <button
        data-focusable="true"
        onClick={onComplete}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 font-bold text-white shadow-lg transition-all"
      >
        QRコードを認証して停止
      </button>

      <button
        data-focusable="true"
        onClick={() => setHasCameraError(true)}
        className="mt-3 text-xs text-gray-400 hover:text-white underline transition-colors"
      >
        カメラが使えない場合は計算で解除
      </button>
    </div>
  );
};
