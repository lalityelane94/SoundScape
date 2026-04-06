"use client";

import { useSequencerStore } from "@/store/sequencerStore";

interface TransportBarProps {
  onPlay: () => void;
  onStop: () => void;
}

export default function TransportBar({ onPlay, onStop }: TransportBarProps) {
  const { isPlaying, bpm, setBpm, currentStep } = useSequencerStore();

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "14px 20px",
      background: "rgba(17,17,24,0.95)",
      borderRadius: "12px",
      marginBottom: "16px",
      border: "1px solid #2A2A3A",
      backdropFilter: "blur(10px)",
    }}>
      <button
        onClick={isPlaying ? onStop : onPlay}
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "50%",
          background: isPlaying
            ? "linear-gradient(135deg, #FF6B6B, #FF4444)"
            : "linear-gradient(135deg, #6C63FF, #8B85FF)",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: isPlaying
            ? "0 0 20px #FF6B6B66"
            : "0 0 20px #6C63FF66",
          transition: "all 0.2s ease",
        }}
      >
        {isPlaying ? "■" : "▶"}
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", minWidth: "28px" }}>BPM</span>
          <input
            type="range" min={60} max={180} value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#6C63FF", height: "4px" }}
          />
          <span style={{ fontSize: "15px", fontWeight: "700", color: "white", fontFamily: "monospace", minWidth: "40px", textAlign: "right" }}>
            {bpm}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} style={{
            width: "6px",
            height: i === currentStep && isPlaying ? "20px" : "8px",
            borderRadius: "3px",
            background: i === currentStep && isPlaying
              ? "#6C63FF"
              : i % 4 === 0
              ? "#333"
              : "#222",
            transition: "height 0.05s ease",
          }} />
        ))}
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
        <span style={{ fontSize: "10px", color: isPlaying ? "#6BCB77" : "#444", fontFamily: "monospace", transition: "color 0.3s" }}>
          {isPlaying ? "PLAYING" : "STOPPED"}
        </span>
      </div>
    </div>
  );
}
