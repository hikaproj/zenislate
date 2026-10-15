# Zenislate 有志ウィジェット & カスタムアプリ開発ガイド

> **Zenislate Developer & Contributor Guide**  
> *誰でも作れる、0円で動く、インテリアになじむスマートディスプレイ・拡張アプリ*  
> Author: Hikaproj • License: MIT

---

## 1. 開発の基本理念 (Core Philosophy)

Zenislate は、家庭内の使わなくなったスマートフォン、タブレット、スマートTVを高級なアンビエント・スマートディスプレイとして再活用するオープンソースプロジェクトです。有志によるウィジェットやアプリの開発にあたっては、以下の3原則を厳格に遵守してください。

1. **ゼロコスト原則 (Zero-Cost Operation)**:
   - OpenAI, Google Cloud, AWS などの有料従量課金 API キーをユーザーに要求する機能は組み込めません。
   - オープンなパブリック API（例: Open-Meteo, Radio-Browser, RainViewer）、ローカルブラウザ API（Web Audio, IndexedDB, Battery API）、またはセルフホスト可能なエンドポイント（Home Assistant, CGI プロキシ）のみを利用してください。
2. **スマートTV・D-Pad リモコン対応 (Remote First)**:
   - すべてのクリック可能な要素（ボタン、入力欄、リンク）には `data-focusable="true"` 属性を付与してください。
   - これにより、テレビリモコンの十字キー操作やキーボード矢印キーでスムーズにフォーカス移動できます。
3. **グレー＆フロストガラス調の統一美 (Cohesive Aesthetic)**:
   - 原色やネオンカラーの乱用を避け、モノトーン、チタングレー、スレート調のフロストガラスを基調としてください。
   - カードの高さや余白は共通の `.bento-card-unified` を遵守してください。

---

## 2. ウィジェットの基本テンプレート (React + TypeScript)

新しくウィジェットを作成する場合、`src/components/widgets/MyCustomWidget.tsx` に配置します。

```tsx
import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

export const MyCustomWidget: React.FC = () => {
  const [data, setData] = useState('こんにちは');

  return (
    <div className="glass-panel p-5 rounded-3xl bento-card-unified border border-white/10 shadow-lg select-none">
      {/* 1. ヘッダー (高さ 32px 固定) */}
      <div className="h-8 shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white balanced-text">
            マイウィジェット名
          </span>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20 nowrap-pill">
          ステータス
        </span>
      </div>

      {/* 2. ボディ (可変高・スクロール可能) */}
      <div className="flex-1 min-h-0 flex flex-col justify-center space-y-2 my-2">
        <p className="text-xs text-white/80 leading-relaxed pretty-text">
          {data}
        </p>
      </div>

      {/* 3. フッター (境界線付きアクション) */}
      <div className="shrink-0 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="text-[11px] text-white/40">更新: リアルタイム</span>
        <button
          data-focusable="true"
          onClick={() => setData('更新されました')}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs transition-all nowrap-pill"
        >
          再取得
        </button>
      </div>
    </div>
  );
};
```

---

## 3. アプリストア (Marketplace) への登録手順

自作したウィジェットを公式ストアのカタログに登録するには、以下の2ファイルを更新します。

### ステップ 1: `src/types/index.ts` にマニフェストを追加
`DEFAULT_COMMUNITY_PLUGINS` 配列にプラグインのメタデータを追記します。

```ts
{
  id: 'my-custom-widget',
  name: 'マイカスタムウィジェット',
  author: 'あなたの GitHub 名 (@username)',
  description: 'ウィジェットが提供する機能や特徴を簡潔に記載（2〜3行程度）。',
  version: '1.0.0',
  icon: '⚡',
  category: 'tools', // 'time' | 'life' | 'audio' | 'tools' | 'custom'
  enabled: true,
  installed: true,
}
```

### ステップ 2: `src/components/modes/SmartHubView.tsx` でインポート・配置
`SmartHubView.tsx` の `allWidgets` 配列に自作コンポーネントを接続します。

```tsx
import { MyCustomWidget } from '../widgets/MyCustomWidget';

// allWidgets 配列内:
{
  id: 'my-custom-widget',
  name: 'マイカスタムウィジェット',
  category: 'plugins',
  icon: '⚡',
  component: <MyCustomWidget />,
}
```

---

## 4. Webview 埋め込みアプリの追加（ノーコード）

コードを書かずに、既存の Web アプリ（Home Assistant、Grafana、Notion、ローカルサーバーなど）をウィジェット化したい場合は、アプリ内の **「ストア」→「カスタムアプリ作成」** から URL を入力するだけで、即座にホーム画面にインライン表示されます。

- **URL の要件**: HTTPS 通信に対応し、`X-Frame-Options: SAMEORIGIN` などの iframe 禁止ヘッダーが付いていないこと。
- **ローカル環境**: 同一 LAN 内の Home Assistant (`http://homeassistant.local:8123`) などのダッシュボードも登録可能です。

---

## 5. コントリビューション・Pull Request 送信

1. 本リポジトリを Fork します。
2. ブランチを作成: `git checkout -b feature/my-cool-widget`
3. ビルドとテストの通過を確認:
   ```bash
   npm run build
   npm run test
   ```
4. コミットを作成し、Pull Request を送信してください。
5. Hikaproj チームによって審査され、次期バージョンに同梱されます。
