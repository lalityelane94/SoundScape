"use client";

import { useEffect, useRef } from "react";
import { useSequencerStore } from "@/store/sequencerStore";

export default function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const { isPlaying, currentStep } = useSequencerStore();
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const mid = H / 2;

      ctx.fillStyle = "#0A0A0F";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "#6C63FF";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#6C63FF";
      ctx.beginPath();

      for (let x = 0; x < W; x++) {
        const t = (x / W) * Math.PI * 4;
        let y;
        if (isPlaying) {
          const wave1 = Math.sin(t + phaseRef.current) * 0.5;
          const wave2 = Math.sin(t * 2.3 + phaseRef.current * 1.5) * 0.25;
          const wave3 = Math.sin(t * 0.7 + phaseRef.current * 0.8) * 0.25;
          y = mid + (wave1 + wave2 + wave3) * mid * 0.7;
        } else {
          y = mid + Math.sin(t + phaseRef.current * 0.1) * 3;
        }
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "#6C63FF33";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(W, mid);
      ctx.stroke();

      if (isPlaying) phaseRef.current += 0.08;
      else phaseRef.current += 0.003;

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={80}
      style={{ width: "100%", height: "80px", borderRadius: "8px", display: "block" }}
    />
  );
}
