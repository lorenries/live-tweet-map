import Tone from 'tone';
import { synth1, synth2 } from './Synths.js';

const sound = () => {
	const notes = ['A2', 'C2', 'D2', 'E2', 'G2'];
	const note = notes[Math.round(Math.random() * notes.length - 1)];
	const synths = [synth1, synth2];
	const random = Math.round(Math.random());
	const synth = synths[random];
	synth.triggerAttackRelease(note, 0.5);
	// _synthTwo.triggerAttackRelease(note, 5);
};

export default sound;
