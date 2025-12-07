import { useCallback } from 'react';

// Singleton AudioContext to reuse across the app
let audioCtx = null;
let masterGain = null;
let ambientNodes = []; // Store ambient oscillators to stop them later

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.3; // Master volume
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export default function useSystemAudio() {
  const playTone = useCallback((freq, type = 'sine', duration = 0.1, vol = 1, slideTo = null) => {
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, audioCtx.currentTime + duration);
      }

      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors (e.g. if not interacted yet)
    }
  }, []);

  const playType = useCallback(() => {
    // Randomize pitch slightly for organic typing feel
    const freq = 800 + Math.random() * 200;
    playTone(freq, 'square', 0.05, 0.1);
  }, [playTone]);

  const playHover = useCallback(() => {
    playTone(200, 'triangle', 0.05, 0.2); // Low blip
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(600, 'sine', 0.1, 0.3, 1200); // Upward chirp
  }, [playTone]);

  const playAlert = useCallback(() => {
    playTone(150, 'sawtooth', 0.3, 0.3, 100); // Downward rough tone
  }, [playTone]);

  const playSuccess = useCallback(() => {
    // Play a quick major triad
    const now = audioCtx ? audioCtx.currentTime : 0;
    setTimeout(() => playTone(440, 'sine', 0.2, 0.2), 0);
    setTimeout(() => playTone(554, 'sine', 0.2, 0.2), 100);
    setTimeout(() => playTone(659, 'sine', 0.4, 0.2), 200);
  }, [playTone]);

  const playGlitch = useCallback(() => {
    const count = 5;
    for(let i=0; i<count; i++) {
        setTimeout(() => {
            const freq = Math.random() * 1000 + 100;
            const type = Math.random() > 0.5 ? 'sawtooth' : 'square';
            playTone(freq, type, 0.05, 0.2);
        }, i * 30);
    }
  }, [playTone]);

  const playAmbient = useCallback(() => {
    try {
        initAudio();
        if (ambientNodes.length > 0) return; // Already playing

        const now = audioCtx.currentTime;
        const rootFreq = 55; // A1 (Low Drone)

        // Create a few oscillators for a thick pad
        const freqs = [rootFreq, rootFreq * 1.5, rootFreq * 2]; // Root, Fifth, Octave
        
        freqs.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();
            
            // Oscillator setup
            osc.type = i === 0 ? 'sawtooth' : 'triangle';
            osc.frequency.value = freq;
            // Detune slightly for thickness
            osc.detune.value = Math.random() * 10 - 5;

            // Filter setup (Lowpass LFO effect)
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            filter.Q.value = 1;

            // Volume setup
            gain.gain.value = 0; // Start silent
            gain.gain.linearRampToValueAtTime(0.03, now + 5); // Fade in slowly to 3% volume (very subtle)

            // Connections
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            osc.start();
            
            // Add LFO to filter for movement
            const lfo = audioCtx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.1 + (Math.random() * 0.1); // Slow breathing
            const lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 100; // Filter cutoff modulation depth
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start();

            ambientNodes.push({ osc, gain, lfo, lfoGain });
        });

    } catch (e) {
        console.error("Ambient audio failed", e);
    }
  }, []);

  const stopAmbient = useCallback(() => {
      if (ambientNodes.length > 0) {
          const now = audioCtx.currentTime;
          ambientNodes.forEach(node => {
              // Fade out
              node.gain.gain.linearRampToValueAtTime(0, now + 2);
              node.osc.stop(now + 2);
              node.lfo.stop(now + 2);
          });
          setTimeout(() => {
            ambientNodes = [];
          }, 2000);
      }
  }, []);

  return {
    playType,
    playHover,
    playClick,
    playAlert,
    playSuccess,
    playGlitch,
    playAmbient,
    stopAmbient,
    initAudio
  };
}