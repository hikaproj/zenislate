/**
 * Zenislate - Web Audio Real-Time Visualizer Engine
 * Oscilloscope waveform & FFT spectrum rendering on HTML5 Canvas
 * Created by Hikaproj
 * License: MIT
 */

export class AudioVisualizer {
  private analyser: AnalyserNode | null = null;
  private animId: number | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;

  public attach(analyser: AnalyserNode): void {
    this.analyser = analyser;
    this.analyser.fftSize = 64;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(new ArrayBuffer(bufferLength));
  }

  public start(
    canvas: HTMLCanvasElement,
    mode: 'bars' | 'wave' = 'bars',
    primaryColor = '#38bdf8'
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.stop();

    const draw = () => {
      this.animId = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (!this.analyser || !this.dataArray) {
        // Draw idle wave line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      if (mode === 'bars') {
        this.analyser.getByteFrequencyData(this.dataArray);
        const barCount = this.dataArray.length;
        const barWidth = (width / barCount) * 1.5;
        let x = 0;

        for (let i = 0; i < barCount; i++) {
          const barHeight = (this.dataArray[i] / 255) * height;

          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, primaryColor);
          gradient.addColorStop(1, '#a855f7');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

          x += barWidth + 1;
        }
      } else {
        // Waveform oscilloscope
        this.analyser.getByteTimeDomainData(this.dataArray);
        ctx.lineWidth = 2;
        ctx.strokeStyle = primaryColor;
        ctx.beginPath();

        const sliceWidth = (width * 1.0) / this.dataArray.length;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
          const v = this.dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }
    };

    draw();
  }

  public stop(): void {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
