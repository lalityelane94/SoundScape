"use client";

import { useEffect, useRef, useState } from "react";

interface Cursor {
  socketId: string;
  x: number;
  y: number;
  userId: string;
  userName: string;
}

const CURSOR_COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF", "#FF9F43"];

interface CollabCursorsProps {
  roomId: string;
  userId: string;
  userName: string;
}

export default function CollabCursors({ roomId, userId, userName }: CollabCursorsProps) {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});
  const socketRef = useRef<any>(null);
  const colorMap = useRef<Record<string, string>>({});
  const colorIndex = useRef(0);

  function getColor(socketId: string) {
    if (!colorMap.current[socketId]) {
      colorMap.current[socketId] = CURSOR_COLORS[colorIndex.current % CURSOR_COLORS.length];
      colorIndex.current++;
    }
    return colorMap.current[socketId];
  }

  useEffect(() => {
    async function connect() {
      const { io } = await import("socket.io-client");
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");

      socket.on("connect", () => {
        socket.emit("join:room", { roomId, userId, userName });
      });

      socket.on("cursor:move", (data: Cursor) => {
        setCursors((prev) => ({ ...prev, [data.socketId]: data }));
      });

      socket.on("cursor:leave", ({ socketId }: { socketId: string }) => {
        setCursors((prev) => {
          const next = { ...prev };
          delete next[socketId];
          return next;
        });
      });

      socketRef.current = socket;

      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        socket.emit("cursor:move", { roomId, x, y, userId, userName });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }

    let cleanup: (() => void) | undefined;
    connect().then((fn) => { cleanup = fn; });

    return () => {
      cleanup?.();
      socketRef.current?.disconnect();
    };
  }, [roomId, userId, userName]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 9999,
      overflow: "hidden",
    }}>
      {Object.values(cursors).map((cursor) => {
        const color = getColor(cursor.socketId);
        return (
          <div
            key={cursor.socketId}
            style={{
              position: "absolute",
              left: cursor.x + "%",
              top: cursor.y + "%",
              transform: "translate(-2px, -2px)",
              pointerEvents: "none",
              transition: "left 0.05s, top 0.05s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ pointerEvents: "none" }}>
              <path d="M0 0L0 12L3.5 8.5L6 14L8 13L5.5 7.5L10 7.5L0 0Z" fill={color} />
            </svg>
            <div style={{
              position: "absolute", top: "14px", left: "8px",
              background: color, color: "white", fontSize: "9px",
              padding: "1px 5px", borderRadius: "3px",
              whiteSpace: "nowrap", fontFamily: "monospace",
              pointerEvents: "none",
            }}>
              {cursor.userName}
            </div>
          </div>
        );
      })}
    </div>
  );
}
