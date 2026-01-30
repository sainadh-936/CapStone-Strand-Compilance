"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Card, Button } from "@/components/ui";
import type { Agent } from "@/types";

interface AgentCardProps {
  agent: Agent;
  sessionCount?: number;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export function AgentCard({
  agent,
  sessionCount = 0,
  onEdit,
  onToggleStatus,
}: AgentCardProps) {
  return (
    <Card hover>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "text.primary",
                fontSize: { xs: "0.9375rem", sm: "1rem" },
                wordBreak: "break-word",
              }}
            >
              {agent.name}
            </Typography>
            <Chip
              label={agent.status === "active" ? "Active" : "Inactive"}
              size="small"
              sx={{
                bgcolor: agent.status === "active" ? "#d1fae5" : "#fee2e2",
                color: agent.status === "active" ? "#047857" : "#b91c1c",
                border: `1px solid ${agent.status === "active" ? "#a7f3d0" : "#fecaca"}`,
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            />
          </Box>
          <Typography
            sx={{ color: "text.secondary", fontSize: "0.875rem", mb: 0.5 }}
          >
            📱 {agent.phone}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
            {sessionCount} session{sessionCount !== 1 ? "s" : ""} assigned
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            ml: { xs: 0, sm: 2 },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            sx={{ flex: { xs: 1, sm: "none" } }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleStatus}
            sx={{ flex: { xs: 1, sm: "none" } }}
          >
            {agent.status === "active" ? "Deactivate" : "Activate"}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
