"use client";

import { useState } from "react";

export default function ExportButton() {
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);

  async function startExport() {
    setRecording(true);
    try {
      const { Tone } = await import("@/lib/tone");

      const recorder = new Tone.Recorder();
      Tone.getDestination().connect(recorder);
      recorder.start();

      let secs = 8;
      setCountdown(secs);

      const interval = setInterval(() => {
        secs--;
        setCountdown(secs);
        if (secs <= 0) clearInterval(interval);
      }, 1000);

      await new Promise((resolve) => setTimeout(resolve, 8000));

      const recording = await recorder.stop();
      Tone.getDestination().disconnect(recorder);

      const url = URL.createObjectURL(recording);
      const a = document.createElement("a");
      a.href = url;
      a.download = "soundscape-beat.webm";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed. Make sure the beat is playing first.");
    } finally {
      setRecording(false);
      setCountdown(0);
    }
  }

  return (
    <button
      onClick={startExport}
      disabled={recording}
      style={{
        background: recording ? "#FF6B6B22" : "#1A1A24",
        color: recording ? "#FF6B6B" : "#888",
        border: "1px solid " + (recording ? "#FF6B6B44" : "#2A2A3A"),
        padding: "5px 12px",
        borderRadius: "6px",
        fontSize: "10px",
        cursor: recording ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        fontFamily: "monospace",
      }}
    >
      {recording ? "REC " + countdown + "s" : "EXPORT"}
    </button>
  );
}
