import Tone from 'tone';

const synth1 = new Tone.Synth({
  oscillator: { type: 'sine' },
  envelope: {
    attack: 0.5,
    decay: 0.1,
    sustain: 0.3,
    release: 3
  }
}).toMaster();

const synth2 = new Tone.Synth({
  oscillator: { type: 'triangle4' },
  envelope: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.3,
    release: 0.3
  }
}).toMaster();

export { synth1, synth2 };
