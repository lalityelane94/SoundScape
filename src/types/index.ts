export interface BeatCell {
  active: boolean;
  velocity: number;
}

export type TrackId = "kick" | "snare" | "hihat" | "clap" | "openhat" | "clap2" | "808" | "perc";

export interface Track {
  id: string;
  name: string;
  color: string;
  sample: string;
  steps: BeatCell[];
  volume: number;
  muted: boolean;
}

export interface AITrack {
  steps: BeatCell[];
  notes: number[];
  active: boolean;
}

export interface SequencerState {
  tracks: Track[];
  aiTrack: AITrack;
  bpm: number;
  isPlaying: boolean;
  currentStep: number;
}

export interface Project {
  _id: string;
  name: string;
  ownerId: string;
  bpm: number;
  tracks: Track[];
  aiTrack: AITrack;
  collaborators: string[];
  createdAt: string;
  updatedAt: string;
}

export const SAMPLE_LIBRARY = [
  { id: "kick",    name: "Kick",      file: "/samples/kick.mp3",    color: "#FF6B6B" },
  { id: "snare",   name: "Snare",     file: "/samples/snare.mp3",   color: "#FFD93D" },
  { id: "hihat",   name: "Hi-Hat",    file: "/samples/hihat.mp3",   color: "#6BCB77" },
  { id: "clap",    name: "Clap",      file: "/samples/clap.mp3",    color: "#4D96FF" },
  { id: "openhat", name: "Open Hat",  file: "/samples/openhat.mp3", color: "#4ECDC4" },
  { id: "clap2",   name: "Clap 2",    file: "/samples/clap2.mp3",   color: "#FF9F43" },
  { id: "808",     name: "808",       file: "/samples/808.mp3",     color: "#C77DFF" },
  { id: "perc",    name: "Perc",      file: "/samples/perc.mp3",    color: "#F368E0" },
];

export const DEFAULT_TRACKS: Track[] = SAMPLE_LIBRARY.map((s) => ({
  id: s.id,
  name: s.name,
  color: s.color,
  sample: s.file,
  steps: Array(16).fill(null).map(() => ({ active: false, velocity: 0.8 })),
  volume: 0.8,
  muted: false,
}));

export const DEFAULT_AI_TRACK: AITrack = {
  steps: Array(16).fill(null).map(() => ({ active: false, velocity: 0.8 })),
  notes: [],
  active: false,
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
