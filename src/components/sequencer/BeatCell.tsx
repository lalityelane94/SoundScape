"use client";

interface BeatCellProps {
  active: boolean;
  isCurrentStep: boolean;
  color: string;
  onClick: () => void;
  groupStart?: boolean;
}

export default function BeatCell({ active, isCurrentStep, color, onClick, groupStart }: BeatCellProps) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        width: "100%",
        height: "44px",
        borderRadius: "6px",
        border: isCurrentStep
          ? "1.5px solid rgba(255,255,255,0.6)"
          : active
          ? "1px solid " + color + "88"
          : "1px solid #2A2A3A",
        background: active
          ? color
          : isCurrentStep
          ? "#2A2A3A"
          : "#16161E",
        cursor: "pointer",
        transition: "all 0.06s ease",
        padding: 0,
        outline: "none",
        boxShadow: active && isCurrentStep
          ? "0 0 12px " + color + "99"
          : active
          ? "0 0 6px " + color + "44"
          : "none",
        transform: isCurrentStep && active ? "scaleY(1.06)" : "scaleY(1)",
        marginLeft: groupStart ? "6px" : "0",
      }}
    />
  );
}
