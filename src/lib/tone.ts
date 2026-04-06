import * as Tone from "tone";

let initialized = false;

const synths: Record<string, any> = {};

export async function initAudio() {
  if (initialized) return;
  await Tone.start();

  synths.kick = new Tone.MembraneSynth({
    pitchDecay: 0.08,
    octaves: 8,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 },
  }).toDestination();

  synths.snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.05 },
  }).toDestination();

  synths.hihat = new Tone.MetalSynth({
    frequency: 800,
    envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();

  synths.clap = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.05 },
  }).toDestination();

  synths.openhat = new Tone.MetalSynth({
    frequency: 600,
    envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
    harmonicity: 5.1,
    modulationIndex: 16,
    resonance: 3000,
    octaves: 1.2,
  }).toDestination();

  synths.clap2 = new Tone.NoiseSynth({
    noise: { type: "brown" },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
  }).toDestination();

  synths["808"] = new Tone.MembraneSynth({
    pitchDecay: 0.5,
    octaves: 4,
    envelope: { attack: 0.001, decay: 0.8, sustain: 0, release: 0.3 },
  }).toDestination();

  synths.perc = new Tone.MetalSynth({
    frequency: 200,
    envelope: { attack: 0.001, decay: 0.08, release: 0.02 },
    harmonicity: 3.1,
    modulationIndex: 16,
    resonance: 2000,
    octaves: 0.8,
  }).toDestination();

  initialized = true;
}

export function triggerSound(trackId: string, volume: number = 0.8) {
  if (!initialized || !synths[trackId]) return;
  try {
    const db = Tone.gainToDb(Math.max(0.01, volume));
    synths[trackId].volume.value = db;

    if (trackId === "kick") synths.kick.triggerAttackRelease("C1", "8n");
    else if (trackId === "808") synths["808"].triggerAttackRelease("C0", "4n");
    else if (trackId === "snare" || trackId === "clap" || trackId === "clap2" || trackId === "openhat") {
      synths[trackId].triggerAttackRelease("8n");
    } else if (trackId === "hihat" || trackId === "perc") {
      synths[trackId].triggerAttackRelease("8n");
    }
  } catch (e) {
    console.error("trigger error", e);
  }
}

export { Tone };
