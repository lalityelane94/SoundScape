"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSequencerStore } from "@/store/sequencerStore";

export function useSocket(roomId: string, userId: string) {
  const socketRef = useRef<any>(null);
  const { toggleStep, setBpm, setIsPlaying, setCurrentStep, setAiTrack } = useSequencerStore();
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!roomId || !userId || connectedRef.current) return;

    async function connect() {
      const { io } = await import("socket.io-client");
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        socket.emit("join:room", { roomId, userId });
        connectedRef.current = true;
      });

      socket.on("step:toggle", ({ trackId, stepIndex }: { trackId: string; stepIndex: number }) => {
        toggleStep(trackId, stepIndex);
      });

      socket.on("bpm:change", ({ bpm }: { bpm: number }) => {
        setBpm(bpm);
      });

      socket.on("playback:sync", ({ isPlaying, currentStep }: { isPlaying: boolean; currentStep: number }) => {
        setIsPlaying(isPlaying);
        setCurrentStep(currentStep);
      });

      socket.on("ai:generated", ({ aiTrack }: { aiTrack: any }) => {
        setAiTrack(aiTrack);
      });

      socketRef.current = socket;
    }

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        connectedRef.current = false;
      }
    };
  }, [roomId, userId]);

  const emitStepToggle = useCallback((trackId: string, stepIndex: number) => {
    socketRef.current?.emit("step:toggle", { roomId, trackId, stepIndex });
  }, [roomId]);

  const emitBpmChange = useCallback((bpm: number) => {
    socketRef.current?.emit("bpm:change", { roomId, bpm });
  }, [roomId]);

  const emitPlayback = useCallback((isPlaying: boolean, currentStep: number) => {
    socketRef.current?.emit("playback:sync", { roomId, isPlaying, currentStep });
  }, [roomId]);

  const emitAiGenerated = useCallback((aiTrack: any) => {
    socketRef.current?.emit("ai:generated", { roomId, aiTrack });
  }, [roomId]);

  return { emitStepToggle, emitBpmChange, emitPlayback, emitAiGenerated };
}
