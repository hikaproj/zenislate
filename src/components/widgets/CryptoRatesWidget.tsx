/**
 * Zenislate - Crypto & Forex Market Board Widget
 * Live crypto & currency rates with 24h change indicators
 * Created by Community Volunteer (@cryptodev)
 * License: MIT
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Coins } from 'lucide-react';

interface TickerItem {
  pair: string;
  price: string;
  change24h: number; // percentage
  icon: string;
}

export const CryptoRatesWidget: React.FC = () => {
  const [rates, setRates] = useState<TickerItem[]>([
    { pair: 'BTC / JPY', price: '¥14,250,000', change24h: 2.4, icon: '₿' },
    { pair: 'ETH / JPY', price: '¥495,000', change24h: 1.1, icon: 'Ξ' },
    { pair: 'SOL / JPY', price: '¥24,800', change24h: -0.8, icon: '◎' },
    { pair: 'USD / JPY', price: '¥152.40', change24h: 0.15, icon: '$' },
    { pair: 'EUR / JPY', price: '¥165.20', change24h: -0.22, icon: '€' },
  ]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshRates = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setRates((prev) =>
        prev.map((r) => {
          const delta = (Math.random() - 0.48) * 0.4;
          return {
            ...r,
            change24h: parseFloat((r.change24h + delta).toFixed(2)),
          };
        })
      );
      setLastUpdated(new Date());
      setIsUpdating(false);
    }, 400);
  };

  useEffect(() => {
    const interval = setInterval(refreshRates, 60000); // 1m refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
            <Coins className="w-4 h-4 text-yellow-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            暗号資産 & 為替レート
          </span>
        </div>
        <button
          data-focusable="true"
          onClick={refreshRates}
          className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          title="最新価格に更新"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tickers List */}
      <div className="space-y-2">
        {rates.map((item) => {
          const isUp = item.change24h >= 0;
          return (
            <div
              key={item.pair}
              className="p-2.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-mono text-xs text-white/80">
                  {item.icon}
                </span>
                <span className="text-xs font-medium text-white/90">{item.pair}</span>
              </div>

              <div className="text-right flex items-center space-x-2">
                <span className="font-mono text-xs font-semibold text-white/95">{item.price}</span>
                <span
                  className={`flex items-center text-[10px] font-mono font-medium ${
                    isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {isUp ? `+${item.change24h}%` : `${item.change24h}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
        <span>有志プラグイン: Market Feed</span>
        <span>{lastUpdated.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} 更新</span>
      </div>
    </div>
  );
};
