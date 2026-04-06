"use client";

import { useEffect, useRef, useState } from "react";

export interface CursorData {
  socketId: string;
  x: number;
  y: number;
  userName: string;
}

export function useCollabCursors(projectId: string, userId: string, userName: string) {
  const [cursors, setCursors] = useState<Record<string, CursorData>>({});
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!projectId || !userId) return;
    let socket: any;

    async function connect() {
      const { io } = await import("socket.io-client");
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");

      socket.on("connect", () => {
        socket.emit("join:room", { roomId: projectId, userId, userName });
      });

      socket.on("cursor:move", (data: CursorData) => {
        setCursors((prev) => ({ ...prev, [data.socketId]: data }));
      });

      socket.on("cursor:leave", ({ socketId }: { socketId: string }) => {
        setCursors((prev) => {
          const n = { ...prev };
          delete n[socketId];
          return n;
        });
      });

      socket.on("step:toggle", ({ trackId, stepIndex }: any) => {
        const { useSequencerStore } = require("@/store/sequencerStore");
        useSequencerStore.getState().toggleStep(trackId, stepIndex);
      });

      socket.on("bpm:change", ({ bpm }: any) => {
        const { useSequencerStore } = require("@/store/sequencerStore");
        useSequencerStore.getState().setBpm(bpm);
      });

      socketRef.current = socket;

      const onMove = (e: MouseEvent) => {
        socket.emit("cursor:move", {
          roomId: projectId,
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
          userId,
          userName,
        });
      };

      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }

    let cleanup: any;
    connect().then((fn) => { cleanup = fn; });

    return () => {
      cleanup?.();
      socket?.disconnect();
    };
  }, [projectId, userId, userName]);

  function emitStepToggle(trackId: string, stepIndex: number) {
    socketRef.current?.emit("step:toggle", { roomId: projectId, trackId, stepIndex });
  }

  function emitBpmChange(bpm: number) {
    socketRef.current?.emit("bpm:change", { roomId: projectId, bpm });
  }

  function emitPlayback(isPlaying: boolean, currentStep: number) {
    socketRef.current?.emit("playback:sync", { roomId: projectId, isPlaying, currentStep });
  }

  return { cursors, emitStepToggle, emitBpmChange, emitPlayback };
}
