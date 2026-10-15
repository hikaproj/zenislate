import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AppSettings,
  DisplayMode,
  CommunityPlugin,
  DEFAULT_COMMUNITY_PLUGINS,
  DEFAULT_WIDGET_ORDER,
  CustomPhoto,
  RadioStation,
  CustomRssFeed,
} from '../types';

interface SettingsState {
  settings: AppSettings;
  setMode: (mode: DisplayMode) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
  toggleWidgetVisibility: (id: string) => void;
  toggleColorScheme: () => void;
  togglePlugin: (id: string) => void;
  installPlugin: (plugin: CommunityPlugin) => void;
  uninstallPlugin: (id: string) => void;
  reorderWidgets: (newOrder: string[]) => void;
  addCustomPhoto: (photo: CustomPhoto) => void;
  removeCustomPhoto: (id: string) => void;
  addCustomStation: (station: RadioStation) => void;
  removeCustomStation: (stationuuid: string) => void;
  addCustomRssFeed: (feed: CustomRssFeed) => void;
  removeCustomRssFeed: (id: string) => void;
}

export const defaultVisibleWidgets: Record<string, boolean> = {
  system: true,
  weather: true,
  alarm: true,
  pomodoro: true,
  timer: true,
  stopwatch: true,
  countdown: true,
  breathing: true,
  mixer: true,
  radio: true,
  'photo-frame': true,
  calendar: true,
  news: true,
  memo: true,
  calculator: true,
  'zen-proverbs': true,
  'crypto-rates': true,
  'tea-master': true,
  'weather-radar': true,
};

export const defaultSettings: AppSettings = {
  mode: 'smart-hub',
  colorScheme: 'light', // User requirement: Default to Light mode, with easy dark mode toggle
  clockType: 'digital',
  use24Hour: true,
  showSeconds: true,
  showMilliseconds: false,
  backgroundTheme: 'graphite-slate', // Sleek unified slate/graphite gray
  burnInProtection: true,
  proxyEndpoint: 'direct',
  customRssUrl: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
  latitude: 35.6895, // Tokyo default
  longitude: 139.6917,
  cityName: '東京都',
  autostartWindows: false,
  tvSafeMargin: false,
  nightColor: 'amber',
  photoUrls: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1920&q=80'
  ],
  photoIntervalSeconds: 15,
  visibleWidgets: defaultVisibleWidgets,
  uiScale: 'standard',
  fontFamily: 'sans',
  masterVolume: 80,
  screenBrightness: 100,
  ambientParticles: true,
  wallpaperMode: 'scenic',
  scenicWallpaperUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=85',
  wallpaperBlur: 0,
  wallpaperDim: 45,
  wallpaperSlideshow: true,
  wallpaperIntervalSeconds: 45,
  widgetOrder: DEFAULT_WIDGET_ORDER,
  installedPlugins: DEFAULT_COMMUNITY_PLUGINS,
  customPhotos: [],
  customStations: [],
  customRssFeeds: [
    { id: 'nhk-top', name: 'NHK 総合ニュース', url: 'https://www.nhk.or.jp/rss/news/cat0.xml', category: '総合' },
    { id: 'yahoo-top', name: 'Yahoo! ニュース 主要トピックス', url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml', category: '総合' },
    { id: 'itmedia-top', name: 'ITmedia 総合速報', url: 'https://rss.itmedia.co.jp/rss/2.0/itmedia_all.xml', category: 'IT・技術' },
    { id: 'gigazine-top', name: 'GIGAZINE 最新記事', url: 'https://gigazine.net/news/rss_2.0/', category: 'カルチャー' },
    { id: 'hatena-tech', name: 'はてなブックマーク テクノロジー', url: 'https://b.hatena.ne.jp/hotentry/it.rss', category: 'IT・技術' },
  ],
  includeCustomPhotosInSlideshow: true,
  hubViewLayout: 'slides',
  hubPageOrder: ['page-home', 'page-audio', 'page-time', 'page-news', 'page-gallery'],
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setMode: (mode: DisplayMode) =>
        set((state) => ({
          settings: { ...state.settings, mode },
        })),
      updateSettings: (partial: Partial<AppSettings>) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),
      toggleWidgetVisibility: (id: string) =>
        set((state) => {
          const current = state.settings.visibleWidgets || defaultVisibleWidgets;
          return {
            settings: {
              ...state.settings,
              visibleWidgets: {
                ...current,
                [id]: current[id] === false ? true : false,
              },
            },
          };
        }),
      toggleColorScheme: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            colorScheme: state.settings.colorScheme === 'dark' ? 'light' : 'dark',
          },
        })),
      togglePlugin: (id: string) =>
        set((state) => {
          const plugins = state.settings.installedPlugins || DEFAULT_COMMUNITY_PLUGINS;
          return {
            settings: {
              ...state.settings,
              installedPlugins: plugins.map((p) =>
                p.id === id ? { ...p, enabled: !p.enabled } : p
              ),
              visibleWidgets: {
                ...state.settings.visibleWidgets,
                [id]: !state.settings.visibleWidgets[id],
              },
            },
          };
        }),
      installPlugin: (plugin: CommunityPlugin) =>
        set((state) => {
          const plugins = state.settings.installedPlugins || DEFAULT_COMMUNITY_PLUGINS;
          const exists = plugins.some((p) => p.id === plugin.id);
          const nextPlugins = exists
            ? plugins.map((p) => (p.id === plugin.id ? { ...plugin, installed: true, enabled: true } : p))
            : [...plugins, { ...plugin, installed: true, enabled: true }];
          const nextOrder = state.settings.widgetOrder.includes(plugin.id)
            ? state.settings.widgetOrder
            : [...state.settings.widgetOrder, plugin.id];
          return {
            settings: {
              ...state.settings,
              installedPlugins: nextPlugins,
              widgetOrder: nextOrder,
              visibleWidgets: {
                ...state.settings.visibleWidgets,
                [plugin.id]: true,
              },
            },
          };
        }),
      uninstallPlugin: (id: string) =>
        set((state) => {
          const plugins = state.settings.installedPlugins || DEFAULT_COMMUNITY_PLUGINS;
          return {
            settings: {
              ...state.settings,
              installedPlugins: plugins.map((p) =>
                p.id === id ? { ...p, installed: false, enabled: false } : p
              ),
              visibleWidgets: {
                ...state.settings.visibleWidgets,
                [id]: false,
              },
            },
          };
        }),
      reorderWidgets: (newOrder: string[]) =>
        set((state) => ({
          settings: {
            ...state.settings,
            widgetOrder: newOrder,
          },
        })),
      addCustomPhoto: (photo: CustomPhoto) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customPhotos: [photo, ...(state.settings.customPhotos || [])],
          },
        })),
      removeCustomPhoto: (id: string) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customPhotos: (state.settings.customPhotos || []).filter((p) => p.id !== id),
          },
        })),
      addCustomStation: (station: RadioStation) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customStations: [station, ...(state.settings.customStations || [])],
          },
        })),
      removeCustomStation: (stationuuid: string) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customStations: (state.settings.customStations || []).filter((s) => s.stationuuid !== stationuuid),
          },
        })),
      addCustomRssFeed: (feed: CustomRssFeed) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customRssFeeds: [feed, ...(state.settings.customRssFeeds || [])],
          },
        })),
      removeCustomRssFeed: (id: string) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customRssFeeds: (state.settings.customRssFeeds || []).filter((f) => f.id !== id),
          },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'zenislate-settings-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
