"use client";

import { useState } from "react";
import { useSequencerStore } from "@/store/sequencerStore";

const SUGGESTIONS = [
  { id: "melody", label: "Add melody", desc: "Generate a matching melody line", icon: "♪" },
  { id: "bassline", label: "Add bassline", desc: "Low-end 808 pattern", icon: "♩" },
  { id: "hats", label: "Fill hi-hats", desc: "Add hi-hat groove pattern", icon: "×" },
  { id: "percussion", label: "Add percussion", desc: "Extra perc layer", icon: "●" },
];

function analyzeBeat(tracks) {
  const suggestions = [];
  const kick = tracks.find((t) => t.id === "kick");
  const snare = tracks.find((t) => t.id === "snare");
  const hihat = tracks.find((t) => t.id === "hihat");
  const bass = tracks.find((t) => t.id === "808");

  const kickActive = kick?.steps.filter((s) => s.active).length ?? 0;
  const snareActive = snare?.steps.filter((s) => s.active).length ?? 0;
  const hihatActive = hihat?.steps.filter((s) => s.active).length ?? 0;
  const bassActive = bass?.steps.filter((s) => s.active).length ?? 0;

  if (kickActive === 0) suggestions.push("Add a kick drum — your beat has no low-end punch");
  if (snareActive === 0) suggestions.push("Add a snare on beats 2 and 4 for a classic groove");
  if (hihatActive < 4) suggestions.push("Fill in hi-hats — try every 2 steps for energy");
  if (bassActive === 0) suggestions.push("Add an 808 bassline to complement the kick");
  if (kickActive > 0 && snareActive > 0 && hihatActive > 0) suggestions.push("Your groove is solid — try adding a melody on top");
  if (kickActive + snareActive + hihatActive > 20) suggestions.push("Dense pattern — try muting some tracks for a breakdown");

  return suggestions.length > 0 ? suggestions : ["Pattern looks great! Try generating an AI melody."];
}

export default function AISuggestion() {
  const { bpm, setAiTrack, aiTrack, tracks } = useSequencerStore();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [deploying, setDeploying] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = analyzeBeat(tracks);

  async function generate() {
    setLoading(true);
    setStatus("loading");
    try {
      const { generateMelody } = await import("@/lib/magenta");
      const { stepsArray, notesArray } = await generateMelody(bpm);
      setAiTrack({
        steps: stepsArray.map((active) => ({ active, velocity: 0.8 })),
        notes: notesArray,
        active: true,
      });
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  async function deployPattern(id) {
    setDeploying(id);
    const store = useSequencerStore.getState();

    await new Promise((r) => setTimeout(r, 600));

    if (id === "hats") {
      const hihatTrack = store.tracks.find((t) => t.id === "hihat");
      if (hihatTrack) {
        [0, 2, 4, 6, 8, 10, 12, 14].forEach((i) => {
          if (!hihatTrack.steps[i].active) store.toggleStep("hihat", i);
        });
      }
    } else if (id === "bassline") {
      const bassTrack = store.tracks.find((t) => t.id === "808");
      if (bassTrack) {
        [0, 3, 8, 11].forEach((i) => {
          if (!bassTrack.steps[i].active) store.toggleStep("808", i);
        });
      }
    } else if (id === "percussion") {
      const percTrack = store.tracks.find((t) => t.id === "perc");
      if (percTrack) {
        [2, 5, 10, 13].forEach((i) => {
          if (!percTrack.steps[i].active) store.toggleStep("perc", i);
        });
      }
    } else if (id === "melody") {
      await generate();
    }

    setDeploying(null);
  }

  return (
    <div style={{ background: "#111118", borderRadius: "12px", padding: "16px", border: "1px solid #3A2A5A", marginTop: "16px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C77DFF", boxShadow: "0 0 8px #C77DFF" }} />
          <span style={{ fontSize: "10px", color: "#C77DFF", fontFamily: "monospace", letterSpacing: "0.1em" }}>AI PRODUCER</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            style={{ background: showSuggestions ? "#C77DFF22" : "#1A1A24", color: showSuggestions ? "#C77DFF" : "#888", border: "1px solid " + (showSuggestions ? "#C77DFF44" : "#2A2A3A"), padding: "5px 12px", borderRadius: "6px", fontSize: "10px", cursor: "pointer", fontFamily: "monospace" }}
          >
            {showSuggestions ? "HIDE TIPS" : "WHAT TO ADD?"}
          </button>
          <button
            onClick={generate}
            disabled={loading}
            style={{ background: loading ? "#2A1A4A" : "#6C63FF", color: "white", border: "none", padding: "5px 14px", borderRadius: "6px", fontSize: "10px", fontFamily: "monospace", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "GENERATING..." : "GENERATE MELODY"}
          </button>
        </div>
      </div>

      {/* AI Suggestions panel */}
      {showSuggestions && (
        <div style={{ marginBottom: "14px", padding: "12px", background: "#0D0D16", borderRadius: "8px", border: "1px solid #2A2A3A" }}>
          <p style={{ fontSize: "9px", color: "#555", fontFamily: "monospace", margin: "0 0 10px", letterSpacing: "0.1em" }}>BEAT ANALYSIS</p>

          {/* Analysis */}
          <div style={{ marginBottom: "12px" }}>
            {suggestions.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#C77DFF", marginTop: "5px", flexShrink: 0 }} />
                <p style={{ fontSize: "11px", color: "#aaa", fontFamily: "monospace", margin: 0, lineHeight: 1.5 }}>{s}</p>
              </div>
            ))}
          </div>

          {/* One-click deploy buttons */}
          <p style={{ fontSize: "9px", color: "#555", fontFamily: "monospace", margin: "0 0 8px", letterSpacing: "0.1em" }}>ONE-CLICK DEPLOY</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => deployPattern(s.id)}
                disabled={deploying === s.id}
                style={{
                  background: deploying === s.id ? "#C77DFF22" : "#1A1A24",
                  color: deploying === s.id ? "#C77DFF" : "#888",
                  border: "1px solid " + (deploying === s.id ? "#C77DFF44" : "#2A2A3A"),
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  cursor: deploying === s.id ? "not-allowed" : "pointer",
                  fontFamily: "monospace",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (deploying !== s.id) {
                    e.currentTarget.style.borderColor = "#C77DFF44";
                    e.currentTarget.style.color = "#C77DFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (deploying !== s.id) {
                    e.currentTarget.style.borderColor = "#2A2A3A";
                    e.currentTarget.style.color = "#888";
                  }
                }}
              >
                <div style={{ fontSize: "14px", marginBottom: "2px" }}>{s.icon}</div>
                <div style={{ fontWeight: "500" }}>{s.label}</div>
                <div style={{ fontSize: "9px", opacity: 0.6, marginTop: "2px" }}>{deploying === s.id ? "deploying..." : s.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading bar */}
      {status === "loading" && (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: "11px", color: "#888", fontFamily: "monospace", marginBottom: "6px" }}>Generating melody...</div>
          <div style={{ height: "2px", background: "#2A2A3A", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#6C63FF", borderRadius: "2px", width: "60%", animation: "slide 1s ease-in-out infinite" }} />
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <p style={{ fontSize: "11px", color: "#FF6B6B", fontFamily: "monospace", margin: 0 }}>Failed to generate. Try again.</p>
      )}

      {/* AI melody display */}
      {aiTrack.active && aiTrack.steps.some((s) => s.active) && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "9px", color: "#888", fontFamily: "monospace" }}>AI MELODY</span>
            {status === "done" && (
              <span style={{ fontSize: "9px", color: "#6BCB77", fontFamily: "monospace" }}>Generated at {bpm} BPM</span>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: "3px" }}>
            {aiTrack.steps.map((step, i) => (
              <div
                key={i}
                style={{
                  height: "36px",
                  borderRadius: "5px",
                  background: step.active ? "#C77DFF" : "#1A1A24",
                  border: "1px solid " + (step.active ? "#C77DFF44" : "#2A2A3A"),
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: "3px",
                }}
              >
                {step.active && aiTrack.notes[i] && (
                  <span style={{ fontSize: "8px", color: "#fff", fontFamily: "monospace", opacity: 0.8 }}>
                    {["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][aiTrack.notes[i] % 12]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}