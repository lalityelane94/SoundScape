import mongoose, { Schema, Document } from "mongoose";

// A single cell in the beat grid
export interface BeatCell {
  active: boolean;
  velocity: number; // 0–1, how hard the beat hits
}

// One instrument track (kick, snare, hi-hat, clap)
export interface Track {
  id: string;
  name: string;
  color: string;       // matches our beat.kick / beat.snare colors
  sample: string;      // which sample file to load
  steps: BeatCell[];   // always 16 steps
  volume: number;      // 0–1
  muted: boolean;
}

// The AI-generated melody track
export interface AITrack {
  steps: BeatCell[];
  notes: number[];     // MIDI note numbers from Magenta
  active: boolean;
}

export interface IProject extends Document {
  name: string;
  ownerId: string;     // Clerk user ID
  bpm: number;         // 60–180
  tracks: Track[];
  aiTrack: AITrack;
  collaborators: string[]; // Clerk user IDs
  createdAt: Date;
  updatedAt: Date;
}

const BeatCellSchema = new Schema<BeatCell>({
  active:   { type: Boolean, default: false },
  velocity: { type: Number,  default: 0.8, min: 0, max: 1 },
});

const TrackSchema = new Schema<Track>({
  id:     { type: String, required: true },
  name:   { type: String, required: true },
  color:  { type: String, required: true },
  sample: { type: String, required: true },
  steps:  { type: [BeatCellSchema], default: () => Array(16).fill({ active: false, velocity: 0.8 }) },
  volume: { type: Number, default: 0.8 },
  muted:  { type: Boolean, default: false },
});

const AITrackSchema = new Schema<AITrack>({
  steps:  { type: [BeatCellSchema], default: () => Array(16).fill({ active: false, velocity: 0.8 }) },
  notes:  { type: [Number], default: [] },
  active: { type: Boolean, default: false },
});

const ProjectSchema = new Schema<IProject>(
  {
    name:          { type: String, required: true, default: "Untitled Beat" },
    ownerId:       { type: String, required: true },
    bpm:           { type: Number, default: 120, min: 60, max: 180 },
    tracks:        { type: [TrackSchema], default: [] },
    aiTrack:       { type: AITrackSchema, default: () => ({}) },
    collaborators: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);