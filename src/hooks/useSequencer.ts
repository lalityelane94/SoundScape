"use client";

import { useEffect, useRef } from "react";
import { useSequencerStore } from "@/store/sequencerStore";

export function useSequencer() {
  const { tracks, bpm, isPlaying, setIsPlaying, setCurrentStep } = useSequencerStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepRef = useRef(0);
  const tracksRef = useRef(tracks);

  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  function play() { setIsPlaying(true); }

  function stop() {
    setIsPlaying(false);
    setCurrentStep(0);
    stepRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const stepMs = (60 / bpm / 4) * 1000;

    async function setup() {
      const { initAudio, triggerSound } = await import("@/lib/tone");
      await initAudio();

      intervalRef.current = setInterval(() => {
        const step = stepRef.current;
        setCurrentStep(step);
        tracksRef.current.forEach((track) => {
          if (!track.muted && track.steps[step]?.active) {
            triggerSound(track.id);
          }
        });
        stepRef.current = (step + 1) % 16;
      }, stepMs);
    }

    setup();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm]);

  return { play, stop };
}
