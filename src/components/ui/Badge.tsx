"use client";

import Chip from "@mui/material/Chip";
import type { SessionStatus } from "@/types";

interface BadgeProps {
  status: SessionStatus;
}

const statusConfig: Record<
  SessionStatus,
  { label: string; color: string; bgcolor: string; borderColor?: string }
> = {
  created: {
    label: "Created",
    color: "#c7d2fe", // indigo-200
    bgcolor: "rgba(55, 48, 163, 0.4)", // indigo-800/40
    borderColor: "#4338ca", // indigo-700
  },
  link_generated: {
    label: "Link Generated",
    color: "#a5b4fc", // indigo-300
    bgcolor: "rgba(79, 70, 229, 0.3)", // indigo-600/30
    borderColor: "#6366f1", // indigo-500
  },
  in_progress: {
    label: "In Progress",
    color: "#fbbf24", // amber-400
    bgcolor: "rgba(120, 53, 15, 0.5)", // amber-900/50
    borderColor: "#78350f",
  },
  submitted: {
    label: "Submitted",
    color: "#34d399", // emerald-400
    bgcolor: "rgba(6, 78, 59, 0.5)", // emerald-900/50
    borderColor: "#064e3b",
  },
  incomplete: {
    label: "Incomplete",
    color: "#f87171", // red-400
    bgcolor: "rgba(127, 29, 29, 0.5)", // red-900/50
    borderColor: "#7f1d1d",
  },
};

export function Badge({ status }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        color: config.color,
        bgcolor: config.bgcolor,
        border: config.borderColor ? `1px solid ${config.borderColor}` : "none",
        fontSize: "0.75rem",
        fontWeight: 500,
      }}
    />
  );
}
