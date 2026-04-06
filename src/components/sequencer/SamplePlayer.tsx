"use client";

import { useState, useRef, useEffect } from "react";

const PRELOADED_TRACKS = [
  { id: "lofi1", name: "Lo-Fi Chill", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", color: "#6C63FF" },
  { id: "jazz1", name: "Jazz Vibes", url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749f2b1.mp3", color: "#FFD93D" },
  { id: "ambient1", name: "Ambient Flow", url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1fce.mp3", color: "#6BCB77" },
  { id: "hiphop1", name: "Hip Hop Beat", url: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_5b2e5e8b8d.mp3", color: "#FF6B6B" },
  { id: "trap1", name: "Trap Vibes", url: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b8e8731.mp3", color: "#C77DFF" },
];

export default function SamplePlayer() {
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [customTracks, setCustomTracks] = useState([]);
  const [show, setShow] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  function playTrack(track) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playing?.id === track.id) {
      setPlaying(null);
      return;
    }
    const audio = new Audio(track.url);
    audio.volume = volume;
    audio.loop = true;
    audio.play().catch((e) => console.error(e));
    audioRef.current = audio;
    setPlaying(track);
  }

  function stopAll() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(null);
  }

  function handleVolumeChange(val) {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }

  function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const track = {
        id: "custom_" + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        url,
        color: "#FF9F43",
        custom: true,
      };
      setCustomTracks((prev) => [...prev, track]);
    });
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const allTracks = [...PRELOADED_TRACKS, ...customTracks];

  return (
    <div style={{ marginTop: "16px" }}>
      <div
        style={{
          background: "#111118",
          borderRadius: "12px",
          border: "1px solid #2A2A3A",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          onClick={() => setShow(!show)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: playing ? "#6BCB77" : "#444",
              boxShadow: playing ? "0 0 8px #6BCB77" : "none",
              transition: "all 0.3s",
            }} />
            <span style={{ fontSize: "10px", color: "#888", fontFamily: "monospace", letterSpacing: "0.1em" }}>
              SAMPLE PLAYER {playing ? "— " + playing.name : ""}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {playing && (
              <button
                onClick={(e) => { e.stopPropagation(); stopAll(); }}
                style={{
                  background: "#FF6B6B22", color: "#FF6B6B",
                  border: "1px solid #FF6B6B44",
                  padding: "3px 10px", borderRadius: "4px",
                  fontSize: "9px", cursor: "pointer", fontFamily: "monospace",
                }}
              >
                STOP
              </button>
            )}
            <span style={{ fontSize: "10px", color: "#444", fontFamily: "monospace" }}>
              {show ? "▲" : "▼"}
            </span>
          </div>
        </div>

        {/* Panel */}
        {show && (
          <div style={{ padding: "0 16px 16px" }}>

            {/* Volume */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "9px", color: "#555", fontFamily: "monospace", minWidth: "40px" }}>VOL</span>
              <input
                type="range" min={0} max={1} step={0.01} value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#6C63FF" }}
              />
              <span style={{ fontSize: "9px", color: "#888", fontFamily: "monospace", minWidth: "30px" }}>
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Upload button */}
            <div style={{ marginBottom: "12px" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  background: "#1A1A24",
                  color: "#888",
                  border: "1px dashed #3A3A4A",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6C63FF88";
                  e.currentTarget.style.color = "#6C63FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#3A3A4A";
                  e.currentTarget.style.color = "#888";
                }}
              >
                + UPLOAD FROM DEVICE
              </button>
            </div>

            {/* Track list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {allTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: playing?.id === track.id ? track.color + "22" : "#1A1A24",
                    border: "1px solid " + (playing?.id === track.id ? track.color + "66" : "#2A2A3A"),
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: track.color + "33",
                    border: "1px solid " + track.color + "66",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "12px",
                  }}>
                    {playing?.id === track.id ? "■" : "▶"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "12px", color: "white", margin: 0, fontFamily: "monospace" }}>
                      {track.name}
                    </p>
                    <p style={{ fontSize: "9px", color: "#555", margin: 0, fontFamily: "monospace" }}>
                      {track.custom ? "custom upload" : "preloaded"}
                    </p>
                  </div>
                  {playing?.id === track.id && (
                    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                      {[1, 2, 3, 4].map((b) => (
                        <div key={b} style={{
                          width: "3px",
                          height: (4 + b * 4) + "px",
                          background: track.color,
                          borderRadius: "2px",
                          animation: "bounce 0.6s ease-in-out infinite",
                          animationDelay: b * 0.1 + "s",
                        }} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}