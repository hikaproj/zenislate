export type DisplayMode =
  | 'smart-hub'
  | 'smart-display'
  | 'ambient-clock'
  | 'bedside-night'
  | 'work-focus'
  | 'mobile-portrait'
  | 'photo-frame'
  | 'ultra-light';

export type MissionType =
  | 'none'
  | 'math'
  | 'briefing'
  | 'sunrise'
  | 'shake'
  | 'simon'
  | 'qr';

export type MissionDifficulty = 'easy' | 'medium' | 'hard';

export interface Alarm {
  id: string;
  time: string; // "HH:mm" (24h)
  enabled: boolean;
  days: number[]; // 0:日, 1:月, ..., 6:土 (空配列は1回のみ)
  label: string;
  soundType: 'synth-chime' | 'synth-beep' | 'radio' | 'sunrise';
  missionType: MissionType;
  missionDifficulty: MissionDifficulty;
  snoozeCount: number;
  maxSnooze: number;
  volume: number; // 0.0 - 1.0
  fadeInSeconds: number; // 0なら即時最大
}

export interface TimerItem {
  id: string;
  label: string;
  durationMs: number;
  remainingMs: number;
  isRunning: boolean;
  isPaused: boolean;
  endTimestamp: number | null;
}

export interface StopwatchLap {
  lapNumber: number;
  timeMs: number;
  splitMs: number;
}

export interface StickyMemo {
  id: string;
  title: string;
  content: string; // Markdown
  color: 'yellow' | 'cyan' | 'green' | 'pink' | 'purple';
  pinned: boolean;
  updatedAt: number;
}

export interface WeatherDay {
  date: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
}

export interface WeatherInfo {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  daily: WeatherDay[];
  cityName: string;
  updatedAt: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export type AmbientSoundType = 'rain' | 'thunder' | 'waves' | 'fire' | 'cafe' | 'whitenoise';

export interface AmbientTrackState {
  id: string;
  name: string;
  volume: number; // 0.0 - 1.0
  muted: boolean;
  type: AmbientSoundType;
}

export interface RadioStation {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  bitrate: number;
}

export type BackgroundTheme =
  | 'graphite-slate'
  | 'titanium-gray'
  | 'aurora'
  | 'tokyo-night'
  | 'warm-amber'
  | 'zen-emerald'
  | 'deep-space'
  | 'oled-black';

export type WidgetId =
  | 'system'
  | 'photo-frame'
  | 'weather'
  | 'alarm'
  | 'pomodoro'
  | 'timer'
  | 'stopwatch'
  | 'countdown'
  | 'breathing'
  | 'mixer'
  | 'radio'
  | 'calendar'
  | 'news'
  | 'memo'
  | 'calculator';

export interface CustomPhoto {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  source: 'upload' | 'url';
  addedAt: string;
}

export interface CustomRssFeed {
  id: string;
  name: string;
  url: string;
  category: string;
}

export type UiScale = 'compact' | 'standard' | 'large';
export type FontFamily = 'sans' | 'mono' | 'serif';
export type WallpaperMode = 'scenic' | 'theme';

export interface ScenicWallpaper {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  thumbnail: string;
}

export const SCENIC_WALLPAPERS: ScenicWallpaper[] = [
  {
    id: 'alpine-sunrise',
    title: '白銀のアルプス朝焼け',
    subtitle: '澄み渡る夜明けの連峰と茜空',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=70',
  },
  {
    id: 'misty-forest',
    title: '静寂深き北欧の原生林',
    subtitle: '朝露に包まれる針葉樹林と光のヴェール',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=70',
  },
  {
    id: 'lake-tekapo',
    title: '南天の星空と湖畔',
    subtitle: '満天の天の川と静穏な水鏡',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70',
  },
  {
    id: 'kyoto-bamboo',
    title: '嵐山 嵯峨野の竹林',
    subtitle: '天へと伸びる青竹と木漏れ日の静けさ',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=70',
  },
  {
    id: 'tokyo-twilight',
    title: '黄昏の東京タワー & 摩天楼',
    subtitle: '都会の夕暮れと灯り始めるサイバーシティ',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=70',
  },
  {
    id: 'pacific-horizon',
    title: '静穏な夕暮れの海原',
    subtitle: '水平線に溶け合う柔らかな薄紅の光',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=70',
  },
  {
    id: 'yosemite-valley',
    title: 'ヨセミテ渓谷と朝霧',
    subtitle: '雄大な花崗岩の崖壁と大自然の息吹',
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=400&q=70',
  },
  {
    id: 'autumn-mountain',
    title: '紅葉の深山と清流',
    subtitle: '彩り豊かな錦秋の山河と澄んだせせらぎ',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=70',
  },
];

export type ColorScheme = 'light' | 'dark' | 'auto';
export type PluginCategory = 'time' | 'life' | 'audio' | 'tools' | 'custom';

export interface CommunityPlugin {
  id: string;
  name: string;
  author: string;
  description: string;
  version: string;
  icon: string;
  category: PluginCategory;
  enabled: boolean;
  installed: boolean;
  embedUrl?: string;
  customCode?: string;
}

export const DEFAULT_COMMUNITY_PLUGINS: CommunityPlugin[] = [
  {
    id: 'zen-proverbs',
    name: '日々の禅語・心の調律',
    author: 'Hikaproj (公式有志)',
    description: '毎日を穏やかに整える日本の禅語と現代語訳・心の整え方を毎日お届けします。',
    version: '1.2.0',
    icon: 'sparkles',
    category: 'life',
    enabled: true,
    installed: true,
  },
  {
    id: 'crypto-rates',
    name: '暗号資産 & 主要為替レート',
    author: 'Community @cryptodev',
    description: 'BTC, ETH, SOL および USD/JPY, EUR/JPY のリアルタイム市況ボード。',
    version: '1.0.4',
    icon: 'coins',
    category: 'tools',
    enabled: true,
    installed: true,
  },
  {
    id: 'tea-master',
    name: '至高の日本茶・珈琲抽出タイマー',
    author: 'Kyoto Craftsman @teafan',
    description: '玉露・煎茶・深蒸し茶・フレンチプレスの最適温度と蒸らし秒数をプロ仕様でガイド。',
    version: '2.0.1',
    icon: 'coffee',
    category: 'time',
    enabled: true,
    installed: true,
  },
  {
    id: 'github-activity',
    name: '開発者 GitHub アクティビティ',
    author: 'OSS Volunteer @gitfan',
    description: '本日のコミット草状況とコントリビューション推移を常時監視。',
    version: '1.1.0',
    icon: 'git-branch',
    category: 'tools',
    enabled: false,
    installed: false,
  },
  {
    id: 'weather-radar',
    name: 'リアルタイム雨雲レーダー',
    author: 'RainViewer Open API',
    description: '日本全国の雨雲接近状況と降水ナウキャストをインタラクティブ表示。',
    version: '1.3.0',
    icon: 'cloud-rain',
    category: 'life',
    enabled: true,
    installed: true,
    embedUrl: 'https://www.rainviewer.com/map.html?loc=35.6895,139.6917,8&oFa=0&oC=1&oU=0&oRev=0&layer=radar&sm=1&sn=1',
  },
  {
    id: 'home-assistant',
    name: 'Home Assistant IoT ダッシュボード',
    author: 'SmartHome Community',
    description: '照明、エアコン、スマートロックなどのIoT家電制御パネルを安全に埋め込み。',
    version: '1.0.2',
    icon: 'home',
    category: 'custom',
    enabled: false,
    installed: false,
    embedUrl: 'http://homeassistant.local:8123',
  },
  {
    id: 'custom-embed',
    name: 'カスタム Webview ダッシュボード',
    author: 'Zenislate Community',
    description: '任意の Web サイト、Notion、Grafana グラフを安全にインライン埋め込み。',
    version: '1.0.0',
    icon: 'globe',
    category: 'custom',
    enabled: false,
    installed: false,
    embedUrl: 'https://example.com',
  },
];

export const DEFAULT_WIDGET_ORDER: string[] = [
  'weather',
  'system',
  'alarm',
  'pomodoro',
  'timer',
  'stopwatch',
  'countdown',
  'mixer',
  'radio',
  'photo-frame',
  'breathing',
  'calendar',
  'news',
  'memo',
  'calculator',
  'zen-proverbs',
  'crypto-rates',
  'tea-master',
  'weather-radar',
];

export interface AppSettings {
  mode: DisplayMode;
  colorScheme: ColorScheme;
  clockType: 'digital' | 'analog';
  use24Hour: boolean;
  showSeconds: boolean;
  showMilliseconds: boolean;
  backgroundTheme: BackgroundTheme;
  burnInProtection: boolean; // ピクセルシフト
  proxyEndpoint: string; // "api/news.php", "api/news.py", "direct", etc.
  customRssUrl: string;
  latitude: number;
  longitude: number;
  cityName: string;
  autostartWindows: boolean;
  tvSafeMargin: boolean;
  nightColor: 'amber' | 'crimson' | 'emerald';
  photoUrls: string[];
  photoIntervalSeconds: number;
  visibleWidgets: Record<string, boolean>;
  uiScale: UiScale;
  fontFamily: FontFamily;
  masterVolume: number;
  screenBrightness: number;
  ambientParticles: boolean;
  wallpaperMode: WallpaperMode;
  scenicWallpaperUrl: string;
  wallpaperBlur: number;
  wallpaperDim: number;
  wallpaperSlideshow: boolean;
  wallpaperIntervalSeconds: number;
  widgetOrder: string[];
  installedPlugins: CommunityPlugin[];
  customPhotos: CustomPhoto[];
  customStations: RadioStation[];
  customRssFeeds: CustomRssFeed[];
  includeCustomPhotosInSlideshow: boolean;
  hubViewLayout?: 'slides' | 'grid';
  hubPageOrder?: string[];
}
