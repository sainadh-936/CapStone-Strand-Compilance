"use client";

import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { Card, Button } from "@/components/ui";
import {
  getIncentives,
  getAgents,
  getSessions,
  getPayoutBatches,
  savePayoutBatch,
  markIncentivesAsPaid,
} from "@/lib/storage";
import type { Incentive, Agent, Session, PayoutBatch } from "@/types";

interface AgentPayout {
  agent: Agent;
  incentives: Incentive[];
  totalAmount: number;
}

export default function PayoutReportsPage() {
  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [batches, setBatches] = useState<PayoutBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIncentives(getIncentives());
      setAgents(getAgents());
      setSessions(getSessions());
      setBatches(getPayoutBatches());
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Get approved incentives ready for payout
  const approvedIncentives = useMemo(
    () => incentives.filter((i) => i.status === "approved"),
    [incentives],
  );

  // Group by agent
  const agentPayouts = useMemo(() => {
    const grouped: Record<string, AgentPayout> = {};

    approvedIncentives.forEach((incentive) => {
      const agent = agents.find((a) => a.id === incentive.agentId);
      if (!agent) return;

      if (!grouped[agent.id]) {
        grouped[agent.id] = {
          agent,
          incentives: [],
          totalAmount: 0,
        };
      }

      grouped[agent.id].incentives.push(incentive);
      grouped[agent.id].totalAmount += incentive.totalAmount;
    });

    return Object.values(grouped).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [approvedIncentives, agents]);

  const totalApprovedAmount = useMemo(
    () => approvedIncentives.reduce((sum, i) => sum + i.totalAmount, 0),
    [approvedIncentives],
  );

  // Generate CSV content
  const generateCSV = () => {
    const headers = [
      "Agent Name",
      "Agent Phone",
      "Patient Name",
      "Session ID",
      "Per Session (₹)",
      "On-Time Bonus (₹)",
      "Compliance Bonus (₹)",
      "Total (₹)",
      "Created Date",
    ];

    const rows = approvedIncentives.map((incentive) => {
      const agent = agents.find((a) => a.id === incentive.agentId);
      const session = sessions.find((s) => s.id === incentive.sessionId);

      return [
        agent?.name || "Unknown",
        agent?.phone || "",
        session?.patientName || "Unknown",
        incentive.sessionId,
        incentive.breakdown.perSession.toString(),
        incentive.breakdown.onTime.toString(),
        incentive.breakdown.compliance.toString(),
        incentive.totalAmount.toString(),
        new Date(incentive.createdAt).toLocaleDateString("en-IN"),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    return csvContent;
  };

  // Download CSV file
  const downloadCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `payout-report-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process payout - marks as paid and creates batch
  const processPayout = () => {
    if (approvedIncentives.length === 0) return;

    if (
      !confirm(
        `Mark ${approvedIncentives.length} incentives as paid? Total: ₹${totalApprovedAmount.toLocaleString("en-IN")}`,
      )
    ) {
      return;
    }

    const incentiveIds = approvedIncentives.map((i) => i.id);

    // Create payout batch
    const batch: PayoutBatch = {
      id: `batch_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      incentiveIds,
      totalAmount: totalApprovedAmount,
      agentCount: agentPayouts.length,
    };

    // Mark incentives as paid
    markIncentivesAsPaid(incentiveIds);
    savePayoutBatch(batch);

    // Refresh data
    setIncentives(getIncentives());
    setBatches(getPayoutBatches());
  };

  // Helper to find session
  const findSession = (sessionId: string) =>
    sessions.find((s) => s.id === sessionId);

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
      <Box sx={{ mb: { xs: 3, sm: 5 } }}>
        <Typography
          variant="h1"
          sx={{
            color: "text.primary",
            fontSize: { xs: "1.5rem", sm: "1.875rem" },
          }}
        >
          Payout Reports
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            mt: { xs: 1, sm: 2 },
            fontSize: { xs: "1rem", sm: "1.125rem" },
          }}
        >
          Generate payout reports and export for processing
        </Typography>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{ color: "text.secondary", fontSize: "0.875rem", mb: 0.5 }}
            >
              Ready for Payout
            </Typography>
            <Typography
              sx={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              ₹{totalApprovedAmount.toLocaleString("en-IN")}
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
              {approvedIncentives.length} incentives • {agentPayouts.length}{" "}
              agents
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="outline"
              onClick={downloadCSV}
              disabled={approvedIncentives.length === 0}
            >
              📥 Export CSV
            </Button>
            <Button
              onClick={processPayout}
              disabled={approvedIncentives.length === 0}
            >
              💰 Mark as Paid
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Agent Breakdown */}
      {agentPayouts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 2, color: "text.primary" }}>
            Agent Breakdown
          </Typography>
          <Stack spacing={2}>
            {agentPayouts.map(({ agent, incentives, totalAmount }) => (
              <Card key={agent.id}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
                      {agent.name}
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                    >
                      {agent.phone} • {incentives.length} sessions
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      color: "success.main",
                    }}
                  >
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                <Stack spacing={0.75}>
                  {incentives.map((inc) => {
                    const session = findSession(inc.sessionId);
                    return (
                      <Box
                        key={inc.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.875rem",
                        }}
                      >
                        <Typography
                          sx={{ color: "text.secondary", fontSize: "inherit" }}
                        >
                          {session?.patientName || "Unknown"}
                        </Typography>
                        <Typography
                          sx={{ color: "text.primary", fontSize: "inherit" }}
                        >
                          ₹{inc.totalAmount}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {approvedIncentives.length === 0 && (
        <Card sx={{ textAlign: "center", py: 6 }}>
          <Typography sx={{ fontSize: "3rem", mb: 2 }}>📋</Typography>
          <Typography variant="h3" sx={{ color: "text.primary", mb: 1 }}>
            No pending payouts
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Approve incentives first to generate payout reports
          </Typography>
        </Card>
      )}

      {/* Payout History */}
      {batches.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h3" sx={{ mb: 2, color: "text.primary" }}>
            Payout History
          </Typography>
          <Stack spacing={2}>
            {batches
              .slice()
              .reverse()
              .map((batch) => (
                <Card key={batch.id}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        ₹{batch.totalAmount.toLocaleString("en-IN")}
                      </Typography>
                      <Typography
                        sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                      >
                        {batch.agentCount} agents • {batch.incentiveIds.length}{" "}
                        incentives
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ color: "text.disabled", fontSize: "0.75rem" }}
                    >
                      {new Date(batch.generatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                </Card>
              ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
