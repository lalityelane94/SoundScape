"use client";

import { useState } from "react";
import { SAMPLE_LIBRARY } from "@/types";
import { useSequencerStore } from "@/store/sequencerStore";

interface SampleBrowserProps {
  trackId: string;
  currentSample: string;
  onClose: () => void;
}

export default function SampleBrowser({ trackId, currentSample, onClose }: SampleBrowserProps) {
  const { updateTrackSample } = useSequencerStore();
  const [selected, setSelected] = useState(currentSample);

  function handleSelect(sample: typeof SAMPLE_LIBRARY[0]) {
    setSelected(sample.file);
    updateTrackSample(trackId, sample.file, sample.name, sample.color);
  }

  async function previewSample(file: string) {
    try {
      const audio = new Audio(file);
      audio.volume = 0.8;
      audio.play();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000,
    }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111118", border: "1px solid #2A2A3A",
          borderRadius: "16px", padding: "24px", width: "400px",
          maxWidth: "90vw",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "12px", color: "#6C63FF", fontFamily: "monospace", letterSpacing: "0.1em" }}>
            SAMPLE BROWSER
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "16px" }}
          >
            X
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {SAMPLE_LIBRARY.map((sample) => (
            <div
              key={sample.id}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 14px", borderRadius: "8px",
                background: selected === sample.file ? sample.color + "22" : "#1A1A24",
                border: "1px solid " + (selected === sample.file ? sample.color + "66" : "#2A2A3A"),
                cursor: "pointer", transition: "all 0.15s",
              }}
              onClick={() => handleSelect(sample)}
            >
              <div style={{
                width: "10px", height: "10px", borderRadius: "50%",
                background: sample.color, flexShrink: 0,
                boxShadow: "0 0 6px " + sample.color + "88",
              }} />
              <span style={{ fontSize: "13px", color: "white", flex: 1, fontFamily: "monospace" }}>
                {sample.name}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); previewSample(sample.file); }}
                style={{
                  background: "#2A2A3A", border: "none", color: "#888",
                  padding: "4px 10px", borderRadius: "4px",
                  fontSize: "10px", cursor: "pointer", fontFamily: "monospace",
                }}
              >
                PLAY
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button
            onClick={onClose}
            style={{
              background: "#6C63FF", color: "white", border: "none",
              padding: "8px 24px", borderRadius: "8px",
              fontSize: "12px", cursor: "pointer", fontFamily: "monospace",
            }}
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}
