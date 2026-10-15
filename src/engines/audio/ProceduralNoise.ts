/**
 * Zenislate - Procedural Ambient Sound Engine
 * Generates natural soundscapes (Rain, Ocean Waves, Campfire, White Noise)
 * completely in-browser with Web Audio API. 0 external MP3 files, 0 bandwidth.
 * Created by Hikaproj
 * License: MIT
 */

import { SynthEngine } from './SynthEngine';

export class ProceduralNoiseEngine {
  private static activeTracks: Map<string, { gainNode: GainNode; sourceNodes: AudioNode[] }> = new Map();

  /**
   * Helper to create 5 seconds of looped pink noise buffer
   */
  private static createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  /**
   * Helper to create 5 seconds of looped brown noise buffer
   */
  private static createBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  /**
   * Start or update procedural sound track
   */
  public static setTrack(type: string, volume: number): void {
    const ctx = SynthEngine.getContext();

    // If volume is 0 or stopped, clean up track
    if (volume <= 0.001) {
      this.stopTrack(type);
      return;
    }

    const existing = this.activeTracks.get(type);
    if (existing) {
      existing.gainNode.gain.setTargetAtTime(volume, ctx.currentTime, 0.1);
      return;
    }

    // Initialize new track
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.2);
    masterGain.connect(ctx.destination);

    const sourceNodes: AudioNode[] = [masterGain];

    switch (type) {
      case 'rain': {
        const buffer = this.createPinkNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        // Bandpass to simulate soothing gentle rain
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);

        source.connect(filter);
        filter.connect(masterGain);
        source.start();

        sourceNodes.push(source, filter);
        break;
      }

      case 'waves': {
        const buffer = this.createBrownNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        // LFO for wave surging
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec period

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(250, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        source.connect(filter);
        filter.connect(masterGain);

        source.start();
        lfo.start();

        sourceNodes.push(source, filter, lfo, lfoGain);
        break;
      }

      case 'fire': {
        const buffer = this.createBrownNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(350, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        source.connect(filter);
        filter.connect(masterGain);
        source.start();

        sourceNodes.push(source, filter);
        break;
      }

      case 'whitenoise':
      default: {
        const buffer = this.createPinkNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        source.connect(masterGain);
        source.start();
        sourceNodes.push(source);
        break;
      }
    }

    this.activeTracks.set(type, { gainNode: masterGain, sourceNodes });
  }

  /**
   * Stop an individual track
   */
  public static stopTrack(type: string): void {
    const existing = this.activeTracks.get(type);
    if (!existing) return;

    // Delete synchronously so immediate setTrack won't mutate or collide with decaying nodes
    this.activeTracks.delete(type);

    try {
      const ctx = SynthEngine.getContext();
      existing.gainNode.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
    } catch {
      // Ignored
    }

    setTimeout(() => {
      existing.sourceNodes.forEach((node) => {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // Ignored
        }
      });
    }, 120);
  }

  /**
   * Stop all procedural audio
   */
  public static stopAll(): void {
    const types = Array.from(this.activeTracks.keys());
    types.forEach((t) => this.stopTrack(t));
  }
}
