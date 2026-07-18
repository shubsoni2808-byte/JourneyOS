class SoundManager {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private bgmInterval: any = null;
  private isBgmPlaying = false;
  private bgmVolume = 0.04;
  private sfxVolume = 0.12;
  private muted = false;

  constructor() {
    // Initialized on first user interaction
  }

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.value = this.muted ? 0 : 1;
    this.masterVolume.connect(this.ctx.destination);
  }

  public setMute(muted: boolean) {
    this.muted = muted;
    if (this.masterVolume) {
      this.masterVolume.gain.value = muted ? 0 : 1;
    }
  }

  public isMuted() {
    return this.muted;
  }

  public toggleMute() {
    this.setMute(!this.muted);
    this.playClick();
    return this.muted;
  }

  // Plays a coin collection sound (high chime arpeggio)
  public playCoin() {
    this.init();
    if (!this.ctx || this.muted) return;
    
    // Resume context if suspended
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const now = this.ctx.currentTime;
    // B5 then E6
    this.playTone(987.77, 'sine', now, 0.08, this.sfxVolume);
    this.playTone(1318.51, 'sine', now + 0.08, 0.22, this.sfxVolume);
  }

  // Dialogue print tick (short clicky triangle wave)
  public playDialogue() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    this.playTone(180 + Math.random() * 40, 'triangle', now, 0.02, this.sfxVolume * 0.4);
  }

  // Button click
  public playClick() {
    this.init();
    if (!this.ctx || this.muted) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const now = this.ctx.currentTime;
    this.playTone(300, 'square', now, 0.04, this.sfxVolume);
    this.playTone(180, 'square', now + 0.03, 0.06, this.sfxVolume);
  }

  // Level Up sound
  public playLevelUp() {
    this.init();
    if (!this.ctx || this.muted) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'square', now + idx * 0.07, 0.12, this.sfxVolume);
    });
  }

  // Quest completed sound
  public playQuestComplete() {
    this.init();
    if (!this.ctx || this.muted) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const now = this.ctx.currentTime;
    this.playTone(523.25, 'triangle', now, 0.12, this.sfxVolume); // C5
    this.playTone(659.25, 'triangle', now + 0.12, 0.12, this.sfxVolume); // E5
    this.playTone(783.99, 'triangle', now + 0.24, 0.12, this.sfxVolume); // G5
    this.playTone(1046.50, 'square', now + 0.36, 0.35, this.sfxVolume); // C6
  }

  // Shop purchase sound
  public playPurchase() {
    this.init();
    if (!this.ctx || this.muted) return;
    
    const now = this.ctx.currentTime;
    this.playTone(587.33, 'sine', now, 0.06, this.sfxVolume); // D5
    this.playTone(880.00, 'sine', now + 0.06, 0.06, this.sfxVolume); // A5
    this.playTone(1174.66, 'square', now + 0.12, 0.18, this.sfxVolume); // D6
  }

  private playTone(freq: number, type: OscillatorType, start: number, duration: number, vol: number) {
    if (!this.ctx || !this.masterVolume) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration - 0.01);
    
    osc.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start(start);
    osc.stop(start + duration);
  }

  // Synthesize background 8-bit retro theme
  public startBgm() {
    this.init();
    if (!this.ctx || this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    let step = 0;
    // Chiptune chord loop: C major, G major, A minor, F major
    const bass = [
      130.81, 130.81, 130.81, 130.81, // C3
      98.00,  98.00,  98.00,  98.00,  // G2
      110.00, 110.00, 110.00, 110.00, // A2
      87.31,  87.31,  87.31,  87.31   // F2
    ];
    
    const melody = [
      261.63, 329.63, 392.00, 523.25, // C Major
      293.66, 392.00, 493.88, 587.33, // G Major
      440.00, 523.25, 659.25, 440.00, // A Minor
      349.23, 440.00, 523.25, 698.46  // F Major
    ];

    this.bgmInterval = setInterval(() => {
      if (this.muted || !this.ctx || !this.isBgmPlaying) return;
      const now = this.ctx.currentTime;
      
      // Play bass note on steps
      const bFreq = bass[step % bass.length];
      this.playTone(bFreq, 'triangle', now, 0.28, this.bgmVolume);
      
      // Play melody notes slightly staggered
      if (step % 2 === 0) {
        const mFreq = melody[Math.floor(step / 2) % melody.length];
        this.playTone(mFreq, 'sine', now, 0.55, this.bgmVolume * 0.6);
      }
      
      step++;
    }, 320);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public isBgmActive() {
    return this.isBgmPlaying;
  }
}

export const soundManager = new SoundManager();
export default soundManager;
