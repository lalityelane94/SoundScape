"use client";

import BeatCell from "./BeatCell";
import { useSequencerStore } from "@/store/sequencerStore";

export default function TrackRow({ track, currentStep, onStepToggle }) {
  const { toggleStep, toggleMute, setTrackVolume } = useSequencerStore();

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "6px",
    }}>
      <div style={{ width: "80px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
          <button
            type="button"
            onClick={() => toggleMute(track.id)}
            style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: track.muted ? "#333" : track.color,
              border: "none", cursor: "pointer", padding: 0,
            }}
          />
          <span style={{ fontSize: "10px", color: "#aaa", fontFamily: "monospace" }}>
            {track.name}
          </span>
        </div>
        <input
          type="range" min={0} max={1} step={0.01} value={track.volume}
          onChange={(e) => setTrackVolume(track.id, Number(e.target.value))}
          style={{ width: "100%", accentColor: track.color }}
        />
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(16, 1fr)",
        gap: "3px",
        flex: 1,
      }}>
        {track.steps.map((step, i) => (
          <BeatCell
            key={i}
            active={step.active}
            isCurrentStep={currentStep === i}
            color={track.color}
            onClick={() => {
              toggleStep(track.id, i);
              onStepToggle?.(track.id, i);
            }}
            groupStart={i !== 0 && i % 4 === 0}
          />
        ))}
      </div>
    </div>
  );
}