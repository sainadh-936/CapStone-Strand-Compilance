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
    color: "#4338ca", // indigo-700
    bgcolor: "#e0e7ff", // indigo-100
    borderColor: "#c7d2fe", // indigo-200
  },
  link_generated: {
    label: "Link Generated",
    color: "#1d4ed8", // blue-700
    bgcolor: "#dbeafe", // blue-100
    borderColor: "#bfdbfe", // blue-200
  },
  in_progress: {
    label: "In Progress",
    color: "#b45309", // amber-700
    bgcolor: "#fef3c7", // amber-100
    borderColor: "#fde68a", // amber-200
  },
  submitted: {
    label: "Submitted",
    color: "#047857", // emerald-700
    bgcolor: "#d1fae5", // emerald-100
    borderColor: "#a7f3d0", // emerald-200
  },
  incomplete: {
    label: "Incomplete",
    color: "#b91c1c", // red-700
    bgcolor: "#fee2e2", // red-100
    borderColor: "#fecaca", // red-200
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
