/**
 * Zenislate - Precision Background Timer Web Worker
 * Runs independently from browser UI thread to prevent background tab throttling.
 * Created by Hikaproj
 * License: MIT
 */

let intervalId: ReturnType<typeof setInterval> | null = null;

self.onmessage = (e: MessageEvent) => {
  const { action, interval = 100 } = e.data;

  if (action === 'start') {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      self.postMessage({ type: 'tick', timestamp: Date.now() });
    }, interval);
  } else if (action === 'stop') {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
};
