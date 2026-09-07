// Real-time Chat Sync Engine with BroadcastChannel, LocalStorage fallback & Web Audio notifications

export interface RealtimeEvent {
  type: 'NEW_MESSAGE' | 'TYPING_STATUS' | 'READ_RECEIPT' | 'CLEAR_UNREAD';
  payload: any;
}

const CHANNEL_NAME = 'hindu_matrimony_realtime_chat';

class RealtimeChatService {
  private channel: BroadcastChannel | null = null;
  private listeners: Array<(event: RealtimeEvent) => void> = [];
  private isAudioMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (e) => {
          this.notifyListeners(e.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization failed, falling back to storage listener:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'soulmate_realtime_event' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifyListeners(parsed);
          } catch {}
        }
      });
    }
  }

  // Subscribe to real-time events
  public subscribe(callback: (event: RealtimeEvent) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  // Broadcast an event across all open tabs/windows and local components
  public broadcast(event: RealtimeEvent): void {
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (e) {
        console.error('Error posting to BroadcastChannel:', e);
      }
    }

    // Storage fallback trigger
    try {
      localStorage.setItem('soulmate_realtime_event', JSON.stringify({ ...event, timestamp: Date.now() }));
    } catch {}

    // Also notify listeners in current window
    this.notifyListeners(event);
  }

  private notifyListeners(event: RealtimeEvent): void {
    this.listeners.forEach((callback) => callback(event));
  }

  // Play real-time Vedic synth audio chime when incoming message arrives
  public playIncomingChime(): void {
    if (this.isAudioMuted) return;
    if (typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Note 1 (E5 / ~659Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2 (B5 / ~987Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.09, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.5);
    } catch (e) {
      // Audio playback might be restricted before user interaction
    }
  }

  public setMuted(muted: boolean): void {
    this.isAudioMuted = muted;
  }

  public getMuted(): boolean {
    return this.isAudioMuted;
  }
}

export const realtimeChatService = new RealtimeChatService();
