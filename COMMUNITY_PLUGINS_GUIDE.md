# Zenislate Community Plugin & Widget Development Guide
**スマートハブ向け有志プラグイン & ウィジェット開発ガイド**  
Created by Hikaproj • License: MIT • Zero-Cost Policy

---

## 1. 概要 (Overview)
Zenislate（ゼニスレート）は、100% 無料かつオープンソースのアンビエント・スマートディスプレイです。
本システムは高い拡張性を備えており、世界中の有志開発者が独自のウィジェットや外部連携プラグインを作成・コントリビュートできるアーキテクチャを採用しています。

---

## 2. ウィジェット開発の基本原則 (Design Principles)

1. **フロステッド・グラスモーフィズム (Frosted Glassmorphism)**:
   すべてのウィジェットは `.glass-panel` クラスを使用し、背景の風景写真やテーマが美しく透過する設計としてください。
2. **ゼロコスト原則 (Zero-Cost Policy)**:
   ユーザーに有料 API キーの取得を要求する仕様は禁止です。無料・キー不要のパブリック API（例: Open-Meteo, Radio-Browser, AllOrigins 等）またはクライアントサイド完結処理を使用してください。
3. **リモコン・D-Pad操作の配慮**:
   クリック・タップ可能な全インタラクティブ要素には `data-focusable="true"` 属性を付与してください。テレビリモコンの十字キーでの操作フォーカスが自動適用されます。
4. **クライアントサイド完結の音響**:
   効果音や通知音が必要な場合は、`SynthEngine`（Web Audio API）によるプロシージャル合成音を使用してください。外部 MP3 のダウンロードは不要です。

---

## 3. ウィジェットの作成手順 (Step-by-Step Implementation)

### Step 1: コンポーネントファイルの作成
`src/components/widgets/` 配下に新規コンポーネントを作成します。

```tsx
// src/components/widgets/MyCustomWidget.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { SynthEngine } from '../../engines/audio/SynthEngine';

export const MyCustomWidget: React.FC = () => {
  const handleClick = () => {
    SynthEngine.playClick(0.15);
    // 独自のアクション
  };

  return (
    <div className="glass-panel p-5 rounded-3xl flex flex-col w-full max-w-sm border border-white/10 shadow-lg">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <h3 className="text-xs font-semibold text-white/90">マイカスタムウィジェット</h3>
      </div>
      
      <p className="text-xs text-white/70 leading-relaxed">
        ここに独自のデータ表示やインタラクションを記述します。
      </p>

      <button
        data-focusable="true"
        onClick={handleClick}
        className="mt-3 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all border border-white/15"
      >
        アクション実行
      </button>
    </div>
  );
};
```

---

### Step 2: プラグインメタデータの登録
`src/types/index.ts` の `DEFAULT_COMMUNITY_PLUGINS` 配列にプラグインのメタデータを登録します。

```ts
{
  id: 'my-custom-plugin',
  name: 'マイカスタム機能',
  author: 'あなたのGitHub名 (@username)',
  description: 'プラグインの機能説明をここに記載します。',
  version: '1.0.0',
  icon: '🚀',
  category: 'tools', // 'time' | 'life' | 'audio' | 'tools' | 'custom'
  enabled: true,
  installed: true,
}
```

---

### Step 3: スマートハブへの登録
`src/components/modes/SmartHubView.tsx` の `widgets` 配列に登録します。

```tsx
import { MyCustomWidget } from '../widgets/MyCustomWidget';

// widgets 配列に追加:
{
  id: 'my-custom-plugin',
  name: 'マイカスタム機能',
  category: 'life',
  component: <MyCustomWidget />,
}
```

これで、スマートハブ画面での**ドラッグ／並び替え、表示・非表示の切り替え、カテゴリ別フィルタリング**が自動的に有効になります。

---

## 4. Webview / Iframe による簡易埋め込みプラグイン
コードを書かずに、Home Assistant や Grafana、自作 Web アプリをウィジェット化したい場合は、アプリ内の **「Zenislate Hub Market」 > 「カスタム追加」** タブから HTTPS URL を登録するだけで、即座にホーム画面へ安全にインライン表示できます。

---

## 5. コントリビュート方法 (Pull Request)
1. 本リポジトリを Fork します。
2. ブランチを作成します (`git checkout -b feature/my-new-widget`)。
3. `npm run test` および `npm run build` を実行し、テストとビルドが完全に通ることを確認します。
4. コミットして Pull Request を作成してください！
