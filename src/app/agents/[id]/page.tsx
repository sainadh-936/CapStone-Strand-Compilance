"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import { Button, Card } from "@/components/ui";
import { AgentForm, type AgentInput } from "@/features/agents";
import {
  getAgent,
  saveAgent,
  getSessionsByAgent,
  getIncentivesByAgent,
} from "@/lib/storage";
import type { Agent, Session, Incentive } from "@/types";

export default function AgentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load agent data
  useEffect(() => {
    async function loadAgentData() {
      const agentData = getAgent(agentId);
      if (!agentData) {
        router.push("/agents");
        return;
      }
      setAgent(agentData);
      setSessions(getSessionsByAgent(agentId));
      setIncentives(getIncentivesByAgent(agentId));
      setIsLoading(false);
    }
    loadAgentData();
  }, [agentId, router]);

  // Calculate stats
  const stats = useMemo(() => {
    const completedSessions = sessions.filter(
      (s) => s.status === "submitted",
    ).length;
    const pendingIncentives = incentives.filter(
      (i) => i.status === "pending",
    ).length;
    const approvedIncentives = incentives.filter(
      (i) => i.status === "approved",
    ).length;
    const totalEarned = incentives
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.totalAmount, 0);
    const pendingAmount = incentives
      .filter((i) => i.status === "pending" || i.status === "approved")
      .reduce((sum, i) => sum + i.totalAmount, 0);

    return {
      totalSessions: sessions.length,
      completedSessions,
      pendingIncentives,
      approvedIncentives,
      totalEarned,
      pendingAmount,
    };
  }, [sessions, incentives]);

  const handleUpdateAgent = (data: AgentInput) => {
    if (!agent) return;
    setIsSubmitting(true);
    const updatedAgent: Agent = {
      ...agent,
      name: data.name,
      phone: data.phone,
      status: data.status,
    };
    saveAgent(updatedAgent);
    setAgent(updatedAgent);
    setIsEditing(false);
    setIsSubmitting(false);
  };

  const handleToggleStatus = () => {
    if (!agent) return;
    const updatedAgent: Agent = {
      ...agent,
      status: agent.status === "active" ? "inactive" : "active",
    };
    saveAgent(updatedAgent);
    setAgent(updatedAgent);
  };

  if (isLoading || !agent) {
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

  return (
    <Box
      sx={{
        maxWidth: "md",
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 6 },
      }}
    >
      {/* Back Button */}
      <Link href="/agents">
        <Button variant="ghost" size="sm" sx={{ mb: 2 }}>
          ← Back to Agents
        </Button>
      </Link>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 2, sm: 3 },
          mb: { xs: 3, sm: 4 },
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Typography
              variant="h1"
              sx={{
                color: "text.primary",
                fontSize: { xs: "1.5rem", sm: "1.875rem" },
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
                fontWeight: 500,
              }}
            />
          </Box>
          <Typography sx={{ color: "text.secondary" }}>
            📱 {agent.phone}
          </Typography>
        </Box>
        {!isEditing && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              sx={{ flex: { xs: 1, sm: "none" } }}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              onClick={handleToggleStatus}
              sx={{ flex: { xs: 1, sm: "none" } }}
            >
              {agent.status === "active" ? "Deactivate" : "Activate"}
            </Button>
          </Box>
        )}
      </Box>

      {/* Edit Form */}
      {isEditing && (
        <Box sx={{ mb: 4 }}>
          <AgentForm
            agent={agent}
            onSubmit={handleUpdateAgent}
            onCancel={() => setIsEditing(false)}
            isLoading={isSubmitting}
          />
        </Box>
      )}

      {/* Stats Cards */}
      {!isEditing && (
        <>
          <Typography variant="h3" sx={{ color: "text.primary", mb: 2 }}>
            Performance
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ textAlign: "center", py: 2 }}>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "primary.main",
                  }}
                >
                  {stats.totalSessions}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                >
                  Total Sessions
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ textAlign: "center", py: 2 }}>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "success.main",
                  }}
                >
                  {stats.completedSessions}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                >
                  Completed
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ textAlign: "center", py: 2 }}>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "success.main",
                  }}
                >
                  ₹{stats.totalEarned}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                >
                  Total Earned
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ textAlign: "center", py: 2 }}>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "warning.main",
                  }}
                >
                  ₹{stats.pendingAmount}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                >
                  Pending
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Sessions */}
          <Typography variant="h3" sx={{ color: "text.primary", mb: 2 }}>
            Recent Sessions
          </Typography>
          {sessions.length === 0 ? (
            <Card sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ color: "text.secondary" }}>
                No sessions assigned yet
              </Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {sessions.slice(0, 5).map((session) => (
                <Card key={session.id}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: 500, color: "text.primary" }}
                      >
                        {session.patientName}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                      >
                        {new Date(session.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </Typography>
                    </Box>
                    <Chip
                      label={session.status.replace("_", " ")}
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                </Card>
              ))}
              {sessions.length > 5 && (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: "0.875rem",
                  }}
                >
                  And {sessions.length - 5} more sessions...
                </Typography>
              )}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
