/**
 * Zenislate - Web Audio Synthesizer Engine
 * Pure procedural synthesis for alarms, chimes, and UI feedback without external audio files.
 * Created by Hikaproj
 * License: MIT
 */

export class SynthEngine {
  private static audioCtx: AudioContext | null = null;
  private static alarmInterval: ReturnType<typeof setInterval> | null = null;

  public static getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Play a pleasant ambient chime chord (e.g. C major 9: C4, E4, G4, B4, D5)
   */
  public static playChime(volume = 0.5): void {
    const ctx = this.getContext();
    const notes = [261.63, 329.63, 392.0, 493.88, 587.33]; // C4, E4, G4, B4, D5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(volume * 0.2, ctx.currentTime + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 2.6);
    });
  }

  /**
   * Play a short tactile click for buttons / TV focus
   */
  public static playClick(volume = 0.15): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // AudioContext might be blocked before user gesture
    }
  }

  /**
   * Start looping alarm sound (synth-chime or beep) with fade-in
   */
  public static startAlarm(type: 'synth-chime' | 'synth-beep' = 'synth-chime', targetVolume = 0.8, fadeInSec = 5): void {
    this.stopAlarm();
    let currentVol = fadeInSec > 0 ? 0.05 : targetVolume;
    const volStep = (targetVolume - currentVol) / (fadeInSec > 0 ? fadeInSec * 2 : 1);

    const playRingtone = () => {
      if (type === 'synth-chime') {
        this.playChime(currentVol);
      } else {
        // High attention beep
        const ctx = this.getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(currentVol * 0.3, ctx.currentTime);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.36);
      }

      if (currentVol < targetVolume) {
        currentVol = Math.min(targetVolume, currentVol + volStep);
      }
    };

    playRingtone();
    this.alarmInterval = setInterval(playRingtone, 2800);
  }

  /**
   * Stop currently playing alarm loop
   */
  public static stopAlarm(): void {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }
}
