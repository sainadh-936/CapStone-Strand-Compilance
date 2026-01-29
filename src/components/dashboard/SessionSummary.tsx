"use client";

import Grid from "@mui/material/Grid";
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
      iconBg: "#dcfce7",
      iconColor: "#16a34a",
    },
    {
      value: summary.yetToComplete,
      label: "Yet to Complete",
      icon: "⏳",
      iconBg: "#fef3c7",
      iconColor: "#d97706",
    },
    {
      value: summary.needsLink,
      label: "Needs Link",
      icon: "🔗",
      iconBg: "#fee2e2",
      iconColor: "#dc2626",
    },
    {
      value: summary.total,
      label: "Total Sessions",
      icon: "📊",
      iconBg: "#e0e7ff",
      iconColor: "#4f46e5",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 6, sm: 3 }}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              py: { xs: 2, sm: 2.5 },
              px: { xs: 2, sm: 2.5 },
              backgroundColor: "#ffffff",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              transition: "box-shadow 0.2s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 2,
                backgroundColor: card.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                flexShrink: 0,
              }}
            >
              {card.icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  fontWeight: 700,
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                {card.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  color: "text.secondary",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {card.label}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
