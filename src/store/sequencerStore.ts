import { create } from "zustand";
import { Track, AITrack, DEFAULT_TRACKS, DEFAULT_AI_TRACK } from "@/types";

interface SequencerStore {
  tracks: Track[];
  aiTrack: AITrack;
  bpm: number;
  isPlaying: boolean;
  currentStep: number;
  toggleStep: (trackId: string, stepIndex: number) => void;
  setBpm: (bpm: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentStep: (step: number) => void;
  setTrackVolume: (trackId: string, volume: number) => void;
  toggleMute: (trackId: string) => void;
  setAiTrack: (aiTrack: AITrack) => void;
  resetAll: () => void;
  loadProject: (tracks: Track[], aiTrack: AITrack, bpm: number) => void;
  updateTrackSample: (trackId: string, sample: string, name: string, color: string) => void;
}

export const useSequencerStore = create<SequencerStore>((set) => ({
  tracks: DEFAULT_TRACKS,
  aiTrack: DEFAULT_AI_TRACK,
  bpm: 120,
  isPlaying: false,
  currentStep: 0,

  toggleStep: (trackId, stepIndex) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? { ...track, steps: track.steps.map((step, i) =>
              i === stepIndex ? { ...step, active: !step.active } : step
            )}
          : track
      ),
    })),

  setBpm: (bpm) => set({ bpm }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentStep: (currentStep) => set({ currentStep }),

  setTrackVolume: (trackId, volume) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, volume } : t
      ),
    })),

  toggleMute: (trackId) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, muted: !t.muted } : t
      ),
    })),

  setAiTrack: (aiTrack) => set({ aiTrack }),

  resetAll: () => set({
    tracks: DEFAULT_TRACKS,
    aiTrack: DEFAULT_AI_TRACK,
    bpm: 120,
    isPlaying: false,
    currentStep: 0,
  }),

  loadProject: (tracks, aiTrack, bpm) => set({ tracks, aiTrack, bpm }),

  updateTrackSample: (trackId, sample, name, color) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, sample, name, color } : t
      ),
    })),
}));
