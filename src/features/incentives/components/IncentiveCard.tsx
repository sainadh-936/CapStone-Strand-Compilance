"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Card, Button } from "@/components/ui";
import type { Incentive, Agent, Session } from "@/types";
import { getIncentiveBreakdownDescription } from "../calculator";

interface IncentiveCardProps {
  incentive: Incentive;
  agent: Agent | null;
  session: Session | null;
  onApprove?: () => void;
  onReject?: () => void;
}

const statusColors: Record<
  Incentive["status"],
  "default" | "warning" | "success" | "error" | "info"
> = {
  pending: "warning",
  approved: "info",
  rejected: "error",
  paid: "success",
};

const statusLabels: Record<Incentive["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Paid",
};

export function IncentiveCard({
  incentive,
  agent,
  session,
  onApprove,
  onReject,
}: IncentiveCardProps) {
  const breakdownDescriptions = getIncentiveBreakdownDescription(
    incentive.breakdown,
  );

  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "flex-start" },
          justifyContent: "space-between",
          gap: 2,
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
              }}
            >
              {agent?.name || "Unknown Agent"}
            </Typography>
            <Chip
              label={statusLabels[incentive.status]}
              color={statusColors[incentive.status]}
              size="small"
            />
            <Typography
              sx={{
                fontWeight: 600,
                color: "primary.main",
                fontSize: "1rem",
              }}
            >
              ₹{incentive.totalAmount}
            </Typography>
          </Box>

          <Typography
            sx={{ color: "text.secondary", fontSize: "0.875rem", mb: 1 }}
          >
            Patient: {session?.patientName || "Unknown"}
            {session?.phoneNumber && ` • ${session.phoneNumber}`}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
            {breakdownDescriptions.map((desc, idx) => (
              <Chip
                key={idx}
                label={desc}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem" }}
              />
            ))}
          </Box>

          <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
            Created{" "}
            {new Date(incentive.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {incentive.approvedAt &&
              ` • Approved ${new Date(incentive.approvedAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                },
              )}`}
          </Typography>
        </Box>

        {incentive.status === "pending" && (onApprove || onReject) && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              ml: { xs: 0, sm: 2 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {onApprove && (
              <Button size="sm" onClick={onApprove}>
                ✓ Approve
              </Button>
            )}
            {onReject && (
              <Button size="sm" variant="ghost" onClick={onReject}>
                ✗ Reject
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
}
