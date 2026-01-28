"use client";

import Grid from "@mui/material/Grid";
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
      gradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      borderColor: "success.light",
      valueColor: "success.main",
      labelColor: "success.dark",
    },
    {
      value: summary.yetToComplete,
      label: "Yet to Complete",
      gradient: "linear-gradient(135deg, #fefce8 0%, #fef08a 100%)",
      borderColor: "warning.light",
      valueColor: "warning.dark",
      labelColor: "warning.dark",
    },
    {
      value: summary.needsLink,
      label: "Needs Link",
      gradient: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
      borderColor: "error.light",
      valueColor: "error.main",
      labelColor: "error.dark",
    },
    {
      value: summary.total,
      label: "Total Sessions",
      gradient: "linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)",
      borderColor: "info.light",
      valueColor: "info.main",
      labelColor: "info.dark",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 6, sm: 3 }}>
          <Card
            sx={{
              textAlign: "center",
              py: { xs: 2, sm: 3 },
              background: card.gradient,
              border: "1px solid",
              borderColor: card.borderColor,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem" },
                fontWeight: 700,
                color: card.valueColor,
              }}
            >
              {card.value}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                color: card.labelColor,
                fontWeight: 500,
              }}
            >
              {card.label}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
