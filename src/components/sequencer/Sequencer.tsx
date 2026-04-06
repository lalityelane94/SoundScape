"use client";

import { useSequencerStore } from "@/store/sequencerStore";
import { useSequencer } from "@/hooks/useSequencer";
import { useCollabCursors } from "@/hooks/useCollabCursors";
import { useUser } from "@clerk/nextjs";
import TransportBar from "./TransportBar";
import TrackRow from "./TrackRow";
import dynamic from "next/dynamic";
import { useState } from "react";
const SamplePlayer = dynamic(() => import("./SamplePlayer"), { ssr: false });
const Visualizer = dynamic(() => import("@/components/visualizer/Visualizer"), { ssr: false });
const AISuggestion = dynamic(() => import("@/components/ai/AISuggestion"), { ssr: false });

const COLORS = ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#C77DFF"];
const colorMap: Record<string,string> = {};
let colorIdx = 0;
function getColor(id: string) {
  if (!colorMap[id]) { colorMap[id] = COLORS[colorIdx % COLORS.length]; colorIdx++; }
  return colorMap[id];
}

interface SequencerProps { projectId: string; }

export default function Sequencer({ projectId }: SequencerProps) {
  const { tracks, currentStep, bpm, aiTrack } = useSequencerStore();
  const { play, stop } = useSequencer();
  const { user } = useUser();
  const { cursors, emitStepToggle, emitPlayback } = useCollabCursors(
    projectId, user?.id ?? "", user?.firstName ?? "Producer"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function saveProject() {
    setSaving(true);
    try {
      await fetch("/api/projects/" + projectId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracks, aiTrack, bpm }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  return (
    <>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
        {Object.values(cursors).map((cursor) => {
          const color = getColor(cursor.socketId);
          return (
            <div key={cursor.socketId} style={{ position: "absolute", left: cursor.x + "%", top: cursor.y + "%", pointerEvents: "none", transition: "left 0.06s, top 0.06s" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, boxShadow: "0 0 8px " + color, pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "12px", left: "4px", background: color, color: "white", fontSize: "9px", padding: "1px 6px", borderRadius: "3px", whiteSpace: "nowrap", fontFamily: "monospace", pointerEvents: "none" }}>
                {cursor.userName}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background: "#0A0A0F", minHeight: "100vh", padding: "24px", fontFamily: "monospace" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "1.25rem", fontWeight: "700", color: "white", margin: 0 }}>Sound<span style={{ color: "#6C63FF" }}>Scape</span></h1>
              <span style={{ fontSize: "9px", color: "#6C63FF", background: "#6C63FF22", padding: "2px 8px", borderRadius: "4px" }}>STUDIO</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={saveProject} disabled={saving} style={{ background: saved ? "#6BCB7722" : "#1A1A24", color: saved ? "#6BCB77" : "#888", border: "1px solid " + (saved ? "#6BCB7744" : "#2A2A3A"), padding: "5px 12px", borderRadius: "6px", fontSize: "10px", cursor: "pointer", fontFamily: "monospace" }}>
                {saving ? "SAVING..." : saved ? "SAVED" : "SAVE"}
              </button>
              <a href="/dashboard" style={{ color: "#555", fontSize: "10px", textDecoration: "none", padding: "5px 12px", border: "1px solid #2A2A3A", borderRadius: "6px" }}>DASHBOARD</a>
            </div>
          </div>
          <TransportBar onPlay={() => { play(); emitPlayback(true, 0); }} onStop={() => { stop(); emitPlayback(false, 0); }} />
          <div style={{ background: "#111118", borderRadius: "12px", padding: "20px", border: "1px solid #2A2A3A" }}>
            <div style={{ display: "flex", marginBottom: "8px", paddingLeft: "88px" }}>
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "9px", color: i % 4 === 0 ? "#6C63FF" : "#333" }}>
                  {i % 4 === 0 ? i / 4 + 1 : "."}
                </div>
              ))}
            </div>
            {tracks.map((track) => (
              <TrackRow key={track.id} track={track} currentStep={currentStep} onStepToggle={(trackId, stepIndex) => emitStepToggle(trackId, stepIndex)} />
            ))}
          </div>
          <AISuggestion />
          <SamplePlayer />
          <Visualizer />
          <div style={{ marginTop: "16px", padding: "12px 16px", background: "#111118", borderRadius: "8px", border: "1px solid #2A2A3A" }}>
            <p style={{ fontSize: "9px", color: "#444", margin: "0 0 4px" }}>SHARE TO COLLABORATE</p>
            <p style={{ fontSize: "10px", color: "#6C63FF", margin: 0, wordBreak: "break-all" }}>
              {typeof window !== "undefined" ? window.location.href : ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
