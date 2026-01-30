"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Card, Badge } from "@/components/ui";
import { SessionSummary } from "@/components/dashboard/SessionSummary";
import {
  getSessions,
  deleteSession,
  getAgents,
  saveSession,
} from "@/lib/storage";
import type { Session, Agent } from "@/types";
import { CircularProgress } from "@mui/material";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setSessions(getSessions());
      setAgents(getAgents());
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      deleteSession(id);
      setSessions(getSessions());
    }
  };

  const handleAgentChange = (
    sessionId: string,
    agentId: string | undefined,
  ) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session && session.status !== "submitted") {
      const updatedSession: Session = {
        ...session,
        agentId: agentId,
      };
      saveSession(updatedSession);
      setSessions(getSessions());
    }
  };

  return (
    <Box
      sx={{
        maxWidth: { xs: "md", md: "lg" },
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 2, sm: 3 },
          mb: { xs: 3, sm: 5 },
        }}
      >
        <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <Typography
            variant="h1"
            sx={{
              color: "text.primary",
              fontSize: { xs: "1.5rem", sm: "1.875rem" },
            }}
          >
            Active Collection Sessions
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              mt: { xs: 1, sm: 2 },
              fontSize: { xs: "1rem", sm: "1.125rem" },
            }}
          >
            Monitor and manage sample collection sessions
          </Typography>
        </Box>
        <Link
          href="/session/new"
          style={{ width: "100%", display: "contents" }}
        >
          <Button size="lg" sx={{ width: { xs: "100%", sm: "auto" } }}>
            + New Session
          </Button>
        </Link>
      </Box>

      <SessionSummary sessions={sessions} />

      {sessions.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 8 }}>
          <Typography sx={{ fontSize: "3.75rem", mb: 2 }}>📋</Typography>
          <Typography variant="h3" sx={{ color: "text.primary", mb: 1 }}>
            No sessions yet
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Create your first collection session to get started
          </Typography>
          <Link href="/session/new">
            <Button>Create Session</Button>
          </Link>
        </Card>
      ) : (
        <Stack spacing={2.5}>
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              agents={agents}
              onDelete={() => handleDelete(session.id)}
              onAgentChange={handleAgentChange}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

function SessionCard({
  session,
  agents,
  onDelete,
  onAgentChange,
}: {
  session: Session;
  agents: Agent[];
  onDelete: () => void;
  onAgentChange: (sessionId: string, agentId: string | undefined) => void;
}) {
  const completedDocs = session.submissions.length;
  const totalDocs = session.requiredDocuments.length;
  const completionPercent =
    totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

  // Check if agent can be reassigned (not submitted)
  const canReassignAgent = session.status !== "submitted";

  // Find assigned agent
  const assignedAgent = session.agentId
    ? agents.find((a) => a.id === session.agentId)
    : null;

  // Determine next action based on status
  const getNextAction = () => {
    switch (session.status) {
      case "created":
        return {
          href: `/session/${session.id}/documents`,
          label: "Select Documents",
        };
      case "link_generated":
      case "in_progress":
      case "submitted":
        return { href: `/session/${session.id}/review`, label: "View Details" };
      default:
        return { href: `/session/${session.id}/documents`, label: "Continue" };
    }
  };

  const action = getNextAction();

  return (
    <Card hover>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "flex-start" },
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
              {session.patientName}
            </Typography>
            <Badge status={session.status} />
          </Box>
          <Typography
            sx={{ color: "text.secondary", fontSize: "0.875rem", mb: 1.5 }}
          >
            📱 {session.phoneNumber}
            {session.city && ` • 📍 ${session.city}`}
          </Typography>

          {totalDocs > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography
                  sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                >
                  Documentation
                </Typography>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {completedDocs}/{totalDocs} complete
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionPercent}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(to right, #8b5cf6, #6366f1)",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          )}

          {/* Agent Assignment/Reassignment */}
          {canReassignAgent && agents.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id={`agent-select-${session.id}`}>
                  Assign Agent
                </InputLabel>
                <Select
                  labelId={`agent-select-${session.id}`}
                  value={session.agentId || ""}
                  label="Assign Agent"
                  onChange={(e) => {
                    const newAgentId = e.target.value || undefined;
                    onAgentChange(session.id, newAgentId);
                  }}
                  sx={{ fontSize: "0.875rem" }}
                >
                  <MenuItem value="">No agent assigned</MenuItem>
                  {agents
                    .filter((a) => a.status === "active")
                    .map((agent) => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.name} • {agent.phone}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Show agent info as text for submitted sessions */}
          {!canReassignAgent && assignedAgent && (
            <Typography
              sx={{ color: "text.secondary", fontSize: "0.875rem", mb: 1.5 }}
            >
              👤 Agent: {assignedAgent.name}
            </Typography>
          )}

          <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
            Created{" "}
            {new Date(session.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
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
          <Link href={action.href} style={{ flex: 1 }}>
            <Button
              size="sm"
              variant="outline"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {action.label}
            </Button>
          </Link>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            🗑️
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
