/**
 * Zenislate - WorkerBridge for Precision Timing
 * Bridges between Web Worker thread and UI components
 * Created by Hikaproj
 * License: MIT
 */

export type TickCallback = (timestamp: number) => void;

export class WorkerBridge {
  private worker: Worker | null = null;
  private fallbackInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<TickCallback> = new Set();
  private isRunning = false;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker(
          new URL('./timer.worker.ts', import.meta.url),
          { type: 'module' }
        );
        this.worker.onmessage = (e: MessageEvent) => {
          if (e.data.type === 'tick') {
            this.notify(e.data.timestamp);
          }
        };
      } catch (err) {
        console.warn('Zenislate: Web Worker initialization failed, using standard timer fallback.', err);
        this.worker = null;
      }
    }
  }

  public subscribe(cb: TickCallback): () => void {
    this.listeners.add(cb);
    if (!this.isRunning && this.listeners.size > 0) {
      this.start();
    }
    return () => {
      this.listeners.delete(cb);
      if (this.listeners.size === 0) {
        this.stop();
      }
    };
  }

  public start(interval = 100): void {
    this.isRunning = true;
    if (this.worker) {
      this.worker.postMessage({ action: 'start', interval });
    } else if (typeof window !== 'undefined') {
      if (this.fallbackInterval) clearInterval(this.fallbackInterval);
      this.fallbackInterval = setInterval(() => {
        this.notify(Date.now());
      }, interval);
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.worker) {
      this.worker.postMessage({ action: 'stop' });
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
  }

  private notify(timestamp: number) {
    this.listeners.forEach((cb) => {
      try {
        cb(timestamp);
      } catch (e) {
        console.error('Zenislate: Error in timer tick subscriber', e);
      }
    });
  }
}

export const precisionTimerBridge = new WorkerBridge();
