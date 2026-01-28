"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import { Card, Button } from "@/components/ui";
import {
  IncentiveCard,
  MAX_INCENTIVE_PER_SESSION,
} from "@/features/incentives";
import {
  getIncentives,
  getAgents,
  getSessions,
  updateIncentiveStatus,
} from "@/lib/storage";
import type { Incentive, Agent, Session } from "@/types";

type TabValue = "all" | "pending" | "approved" | "paid" | "rejected";

export default function IncentivesPage() {
  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>("pending");

  useEffect(() => {
    async function loadData() {
      setIncentives(getIncentives());
      setAgents(getAgents());
      setSessions(getSessions());
      setIsLoading(false);
    }
    loadData();
  }, []);

  const refreshData = () => {
    setIncentives(getIncentives());
  };

  const handleApprove = (id: string) => {
    updateIncentiveStatus(id, "approved", "Admin");
    refreshData();
  };

  const handleReject = (id: string) => {
    if (confirm("Are you sure you want to reject this incentive?")) {
      updateIncentiveStatus(id, "rejected");
      refreshData();
    }
  };

  // Filter incentives based on active tab
  const filteredIncentives = useMemo(() => {
    if (activeTab === "all") return incentives;
    return incentives.filter((i) => i.status === activeTab);
  }, [incentives, activeTab]);

  // Summary stats
  const stats = useMemo(() => {
    const pending = incentives.filter((i) => i.status === "pending");
    const approved = incentives.filter((i) => i.status === "approved");
    const paid = incentives.filter((i) => i.status === "paid");

    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((sum, i) => sum + i.totalAmount, 0),
      approvedCount: approved.length,
      approvedAmount: approved.reduce((sum, i) => sum + i.totalAmount, 0),
      paidCount: paid.length,
      paidAmount: paid.reduce((sum, i) => sum + i.totalAmount, 0),
      totalCount: incentives.length,
      totalAmount: incentives.reduce((sum, i) => sum + i.totalAmount, 0),
    };
  }, [incentives]);

  // Helper to find agent by id
  const findAgent = (agentId: string) =>
    agents.find((a) => a.id === agentId) || null;

  // Helper to find session by id
  const findSession = (sessionId: string) =>
    sessions.find((s) => s.id === sessionId) || null;

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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: { xs: 3, sm: 5 },
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              color: "text.primary",
              fontSize: { xs: "1.5rem", sm: "1.875rem" },
            }}
          >
            Incentive Management
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              mt: { xs: 1, sm: 2 },
              fontSize: { xs: "1rem", sm: "1.125rem" },
            }}
          >
            Approve and track agent incentives (Max ₹{MAX_INCENTIVE_PER_SESSION}{" "}
            per session)
          </Typography>
        </Box>
        <Link href="/incentives/reports">
          <Button variant="outline">📊 Payout Reports</Button>
        </Link>
      </Box>

      {/* Summary Cards */}
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
        <Card
          sx={{ textAlign: "center", cursor: "pointer" }}
          onClick={() => setActiveTab("pending")}
        >
          <Typography
            sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}
          >
            ⏳ Pending
          </Typography>
          <Typography
            sx={{ fontSize: "1.25rem", fontWeight: 700, color: "warning.main" }}
          >
            {stats.pendingCount}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
            ₹{stats.pendingAmount.toLocaleString("en-IN")}
          </Typography>
        </Card>

        <Card
          sx={{ textAlign: "center", cursor: "pointer" }}
          onClick={() => setActiveTab("approved")}
        >
          <Typography
            sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}
          >
            ✓ Approved
          </Typography>
          <Typography
            sx={{ fontSize: "1.25rem", fontWeight: 700, color: "info.main" }}
          >
            {stats.approvedCount}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
            ₹{stats.approvedAmount.toLocaleString("en-IN")}
          </Typography>
        </Card>

        <Card
          sx={{ textAlign: "center", cursor: "pointer" }}
          onClick={() => setActiveTab("paid")}
        >
          <Typography
            sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}
          >
            💰 Paid
          </Typography>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "success.main",
            }}
          >
            {stats.paidCount}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
            ₹{stats.paidAmount.toLocaleString("en-IN")}
          </Typography>
        </Card>

        <Card
          sx={{ textAlign: "center", cursor: "pointer" }}
          onClick={() => setActiveTab("all")}
        >
          <Typography
            sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}
          >
            📊 Total
          </Typography>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            {stats.totalCount}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
            ₹{stats.totalAmount.toLocaleString("en-IN")}
          </Typography>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value as TabValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="pending" label={`Pending (${stats.pendingCount})`} />
          <Tab value="approved" label={`Approved (${stats.approvedCount})`} />
          <Tab value="paid" label={`Paid (${stats.paidCount})`} />
          <Tab value="rejected" label="Rejected" />
          <Tab value="all" label="All" />
        </Tabs>
      </Box>

      {/* Incentive List */}
      {filteredIncentives.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 6 }}>
          <Typography sx={{ fontSize: "3rem", mb: 2 }}>💸</Typography>
          <Typography variant="h3" sx={{ color: "text.primary", mb: 1 }}>
            No incentives found
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {activeTab === "pending"
              ? "No pending incentives to approve"
              : activeTab === "all"
                ? "Incentives will appear here when sessions are completed"
                : `No ${activeTab} incentives`}
          </Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {filteredIncentives.map((incentive) => (
            <IncentiveCard
              key={incentive.id}
              incentive={incentive}
              agent={findAgent(incentive.agentId)}
              session={findSession(incentive.sessionId)}
              onApprove={
                incentive.status === "pending"
                  ? () => handleApprove(incentive.id)
                  : undefined
              }
              onReject={
                incentive.status === "pending"
                  ? () => handleReject(incentive.id)
                  : undefined
              }
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
