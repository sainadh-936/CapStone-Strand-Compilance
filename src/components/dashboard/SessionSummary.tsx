"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card } from "@/components/ui";
import type { Session } from "@/types";
import { useMemo } from "react";

interface SessionSummaryProps {
  sessions: Session[];
}

export function SessionSummary({ sessions }: SessionSummaryProps) {
  const summary = useMemo(() => {
    const completed = sessions.filter((s) => s.status === "submitted").length;
    const inProgress = sessions.filter(
      (s) => s.status === "in_progress" || s.status === "incomplete",
    ).length;
    const needsLink = sessions.filter((s) => s.status === "created").length;
    const linkGenerated = sessions.filter(
      (s) => s.status === "link_generated",
    ).length;

    return {
      total: sessions.length,
      completed,
      inProgress,
      needsLink,
      linkGenerated,
      yetToComplete: sessions.length - completed,
    };
  }, [sessions]);

  if (sessions.length === 0) {
    return null;
  }

  const cards = [
    {
      value: summary.completed,
      label: "Completed",
      icon: "✓",
      color: "success.main",
    },
    {
      value: summary.yetToComplete,
      label: "Yet to Complete",
      icon: "⏳",
      color: "warning.main",
    },
    {
      value: summary.needsLink,
      label: "Needs Link",
      icon: "🔗",
      color: "error.main",
    },
    {
      value: summary.total,
      label: "Total Sessions",
      icon: "📊",
      color: "text.primary",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(4, 1fr)",
        },
        gap: { xs: 2, sm: 3 },
        mb: { xs: 3, sm: 4 },
      }}
    >
      {cards.map((card) => (
        <Card key={card.label} sx={{ textAlign: "center" }}>
          <Typography
            sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}
          >
            {card.icon} {card.label}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: card.color,
            }}
          >
            {card.value}
          </Typography>
        </Card>
      ))}
    </Box>
  );
}
