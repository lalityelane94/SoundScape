"use client";

import { useEffect, useRef } from "react";
import { useSequencerStore } from "@/store/sequencerStore";

const BAR_COLORS = ["#FF6B6B","#FF8E6B","#FFB86B","#FFD93D","#C8E63D","#6BCB77","#4ECDC4","#6C63FF","#8B85FF","#C77DFF"];

export default function FrequencyBars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const { isPlaying, currentStep, tracks } = useSequencerStore();
  const phaseRef = useRef(0);
  const peakRef = useRef<number[]>(new Array(32).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const BAR_COUNT = 32;

    const activeCount = tracks.reduce((sum, t) => {
      return sum + (t.steps[currentStep]?.active && !t.muted ? 1 : 0);
    }, 0);

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0A0A0F";
      ctx.fillRect(0, 0, W, H);
      const barW = (W / BAR_COUNT) - 2;
      const beatBoost = activeCount > 0 && isPlaying ? activeCount * 0.15 : 0;

      for (let i = 0; i < BAR_COUNT; i++) {
        let height;
        if (isPlaying) {
          const base = Math.sin((i / BAR_COUNT) * Math.PI * 2 + phaseRef.current) * 0.4 + 0.5;
          const beat = Math.sin(phaseRef.current * 4 + i * 0.3) * 0.2;
          const boost = Math.exp(-Math.pow(i / BAR_COUNT - 0.2, 2) * 8) * beatBoost;
          height = Math.max(4, (base + beat + boost) * H * 0.85);
        } else {
          height = 4 + Math.sin(i * 0.5 + phaseRef.current * 0.2) * 3;
        }

        if (height > peakRef.current[i]) {
          peakRef.current[i] = height;
        } else {
          peakRef.current[i] = Math.max(4, peakRef.current[i] - 1.5);
        }

        const colorIndex = Math.floor((i / BAR_COUNT) * BAR_COLORS.length);
        const color = BAR_COLORS[colorIndex];
        const grad = ctx.createLinearGradient(0, H - peakRef.current[i], 0, H);
        grad.addColorStop(0, color + "FF");
        grad.addColorStop(1, color + "22");
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(i * (barW + 2), H - peakRef.current[i], barW, peakRef.current[i], 3);
        else ctx.rect(i * (barW + 2), H - peakRef.current[i], barW, peakRef.current[i]);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.fillRect(i * (barW + 2), H - peakRef.current[i] - 2, barW, 2);
      }

      if (isPlaying) phaseRef.current += 0.055;
      else phaseRef.current += 0.004;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying, currentStep, tracks]);

  return (
    <canvas ref={canvasRef} width={600} height={120}
      style={{ width: "100%", height: "120px", borderRadius: "8px", display: "block" }} />
  );
}
