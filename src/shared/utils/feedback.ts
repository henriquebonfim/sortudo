/**
 * Sensory Feedback Utility
 * Provides procedural audio (Web Audio API) and haptic feedback (Vibration API).
 */

class FeedbackService {
  private audioCtx: AudioContext | null = null;

  private initAudio() {
    if (!this.audioCtx) {
      const Win = window as unknown as {
        AudioContext: typeof AudioContext;
        webkitAudioContext: typeof AudioContext;
      };
      const ContextClass = Win.AudioContext || Win.webkitAudioContext;
      if (ContextClass) {
        this.audioCtx = new ContextClass();
      }
    }
  }

  /**
   * Plays a subtle procedural "tick" sound.
   * Frequency and duration are tuned for a mechanical feel.
   */
  public playTick(frequency = 150, volume = 0.05) {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      oscillator.start();
      oscillator.stop(this.audioCtx.currentTime + 0.1);
    } catch (e) {
      // Silence if audio is blocked by browser policy
    }
  }

  /**
   * Triggers a short vibration (haptic feedback) on supported mobile devices.
   */
  public vibrate(duration: number | number[] = 10) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }

  /**
   * Combined feedback for UI interactions.
   */
  public trigger(type: 'subtle' | 'success' | 'error' = 'subtle') {
    switch (type) {
      case 'subtle':
        this.playTick(150, 0.05);
        this.vibrate(10);
        break;
      case 'success':
        this.playTick(440, 0.1);
        this.vibrate([10, 30, 10]);
        break;
      case 'error':
        this.playTick(100, 0.1);
        this.vibrate([50, 50, 50]);
        break;
    }
  }
}

export const feedback = new FeedbackService();
