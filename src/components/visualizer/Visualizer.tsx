"use client";

import FrequencyBars from "./FrequencyBars";
import Waveform from "./Waveform";
import { useSequencerStore } from "@/store/sequencerStore";

export default function Visualizer() {
  const { isPlaying } = useSequencerStore();

  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{
        background: "#111118",
        borderRadius: "12px",
        padding: "16px",
        border: "1px solid #2A2A3A",
        marginBottom: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "0.1em" }}>FREQUENCY SPECTRUM</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: isPlaying ? "#6BCB77" : "#444",
              boxShadow: isPlaying ? "0 0 6px #6BCB77" : "none",
              transition: "all 0.3s",
            }} />
            <span style={{ fontSize: "10px", color: isPlaying ? "#6BCB77" : "#444", fontFamily: "monospace" }}>
              {isPlaying ? "LIVE" : "IDLE"}
            </span>
          </div>
        </div>
        <FrequencyBars />
      </div>

      <div style={{
        background: "#111118",
        borderRadius: "12px",
        padding: "16px",
        border: "1px solid #2A2A3A",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "0.1em" }}>WAVEFORM</span>
          <span style={{ fontSize: "10px", color: "#444", fontFamily: "monospace" }}>OSC</span>
        </div>
        <Waveform />
      </div>
    </div>
  );
}
