"use client";

import { useEffect, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Card } from "@/components/ui";
import { AgentCard, AgentForm, type AgentInput } from "@/features/agents";
import { getAgents, saveAgent, getSessionsByAgent } from "@/lib/storage";
import type { Agent } from "@/types";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load agents on mount
  useEffect(() => {
    async function loadAgents() {
      setAgents(getAgents());
      setIsLoading(false);
    }
    loadAgents();
  }, []);

  // Calculate session counts for each agent
  const sessionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    agents.forEach((agent) => {
      counts[agent.id] = getSessionsByAgent(agent.id).length;
    });
    return counts;
  }, [agents]);

  // Summary statistics
  const summary = useMemo(() => {
    const active = agents.filter((a) => a.status === "active").length;
    const inactive = agents.filter((a) => a.status === "inactive").length;
    return { total: agents.length, active, inactive };
  }, [agents]);

  const handleCreateAgent = (data: AgentInput) => {
    setIsSubmitting(true);
    const newAgent: Agent = {
      id: uuidv4(),
      name: data.name,
      phone: data.phone,
      status: data.status,
      createdAt: new Date().toISOString(),
    };
    saveAgent(newAgent);
    setAgents(getAgents());
    setShowForm(false);
    setIsSubmitting(false);
  };

  const handleUpdateAgent = (data: AgentInput) => {
    if (!editingAgent) return;
    setIsSubmitting(true);
    const updatedAgent: Agent = {
      ...editingAgent,
      name: data.name,
      phone: data.phone,
      status: data.status,
    };
    saveAgent(updatedAgent);
    setAgents(getAgents());
    setEditingAgent(null);
    setIsSubmitting(false);
  };

  const handleToggleStatus = (agent: Agent) => {
    const updatedAgent: Agent = {
      ...agent,
      status: agent.status === "active" ? "inactive" : "active",
    };
    saveAgent(updatedAgent);
    setAgents(getAgents());
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAgent(null);
  };

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

  return (
    <Box
      sx={{
        maxWidth: "md",
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 6 },
      }}
    >
      {/* Header */}
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
            Agent Management
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              mt: { xs: 1, sm: 2 },
              fontSize: { xs: "1rem", sm: "1.125rem" },
            }}
          >
            Manage phlebotomists and sample collectors
          </Typography>
        </Box>
        {!showForm && !editingAgent && (
          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            + Add Agent
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      {agents.length > 0 && !showForm && !editingAgent && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: { xs: 2, sm: 3 },
            mb: { xs: 3, sm: 4 },
          }}
        >
          {[
            {
              value: summary.total,
              label: "Total",
              icon: "👥",
              color: "text.primary",
            },
            {
              value: summary.active,
              label: "Active",
              icon: "✓",
              color: "success.main",
            },
            {
              value: summary.inactive,
              label: "Inactive",
              icon: "⏸",
              color: "error.main",
            },
          ].map((card) => (
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
      )}

      {/* Create Form */}
      {showForm && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ color: "text.primary", mb: 2 }}>
            Add New Agent
          </Typography>
          <AgentForm
            onSubmit={handleCreateAgent}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
          />
        </Box>
      )}

      {/* Edit Form */}
      {editingAgent && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ color: "text.primary", mb: 2 }}>
            Edit Agent
          </Typography>
          <AgentForm
            key={editingAgent.id}
            agent={editingAgent}
            onSubmit={handleUpdateAgent}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
          />
        </Box>
      )}

      {/* Agent List */}
      {!showForm && !editingAgent && (
        <>
          {agents.length === 0 ? (
            <Card sx={{ textAlign: "center", py: 8 }}>
              <Typography sx={{ fontSize: "3.75rem", mb: 2 }}>👤</Typography>
              <Typography variant="h3" sx={{ color: "text.primary", mb: 1 }}>
                No agents yet
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 3 }}>
                Add your first phlebotomist to get started
              </Typography>
              <Button onClick={() => setShowForm(true)}>Add Agent</Button>
            </Card>
          ) : (
            <Stack spacing={2.5}>
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  sessionCount={sessionCounts[agent.id] || 0}
                  onEdit={() => handleEdit(agent)}
                  onToggleStatus={() => handleToggleStatus(agent)}
                />
              ))}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
