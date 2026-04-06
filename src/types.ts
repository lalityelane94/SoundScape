// src/types.ts

export interface Step {
  active: boolean;
}

export interface Track {
  id: string;
  name: string;
  sample: string;
  color: string;
  volume: number;
  muted: boolean;
  steps: Step[];
}

export interface AITrack {
  steps: Step[];
  sample: string;
  volume: number;
  muted: boolean;
}

export const DEFAULT_TRACKS: Track[] = [
  { id: "kick",  name: "Kick",  sample: "/samples/kick.wav",  color: "#FF6B6B", volume: 1, muted: false, steps: Array(16).fill(null).map(() => ({ active: false })) },
  { id: "snare", name: "Snare", sample: "/samples/snare.wav", color: "#FFD93D", volume: 1, muted: false, steps: Array(16).fill(null).map(() => ({ active: false })) },
  { id: "hihat", name: "Hi-Hat", sample: "/samples/hihat.wav", color: "#6BCB77", volume: 1, muted: false, steps: Array(16).fill(null).map(() => ({ active: false })) },
  { id: "clap",  name: "Clap",  sample: "/samples/clap.wav",  color: "#4D96FF", volume: 1, muted: false, steps: Array(16).fill(null).map(() => ({ active: false })) },
  { id: "bass",  name: "Bass",  sample: "/samples/bass.wav",  color: "#C77DFF", volume: 1, muted: false, steps: Array(16).fill(null).map(() => ({ active: false })) },
];

export const DEFAULT_AI_TRACK: AITrack = {
  steps: Array(16).fill(null).map(() => ({ active: false })),
  sample: "/samples/ai.wav",
  volume: 1,
  muted: false,
};