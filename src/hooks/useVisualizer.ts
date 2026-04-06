"use client";

import { useEffect, useRef, useCallback } from "react";

export function useVisualizer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const initVisualizer = useCallback(async () => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      analyserRef.current.connect(audioContextRef.current.destination);
    } catch (err) {
      console.error("Visualizer init error:", err);
    }
  }, []);

  const getFrequencyData = useCallback(() => {
    if (!analyserRef.current) return new Uint8Array(0);
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    return data;
  }, []);

  const getWaveformData = useCallback(() => {
    if (!analyserRef.current) return new Uint8Array(0);
    const data = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(data);
    return data;
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return { initVisualizer, getFrequencyData, getWaveformData, analyserRef };
}
