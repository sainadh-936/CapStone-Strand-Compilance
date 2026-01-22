"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { Button, Card, Badge } from "@/components/ui";
import { getSessions, deleteSession } from "@/lib/storage";
import type { Session } from "@/types";
import { CircularProgress } from "@mui/material";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      setSessions(getSessions());
      setIsLoading(false);
    }
    fetchSessions();
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
              color: "common.white",
              fontSize: { xs: "1.5rem", sm: "1.875rem" },
            }}
          >
            Active Collection Sessions
          </Typography>
          <Typography
            sx={{
              color: "grey.400",
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

      {sessions.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 8 }}>
          <Typography sx={{ fontSize: "3.75rem", mb: 2 }}>📋</Typography>
          <Typography variant="h3" sx={{ color: "common.white", mb: 1 }}>
            No sessions yet
          </Typography>
          <Typography sx={{ color: "grey.400", mb: 3 }}>
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
              onDelete={() => handleDelete(session.id)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

function SessionCard({
  session,
  onDelete,
}: {
  session: Session;
  onDelete: () => void;
}) {
  const completedDocs = session.submissions.length;
  const totalDocs = session.requiredDocuments.length;
  const completionPercent =
    totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

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
                color: "common.white",
                fontSize: { xs: "0.9375rem", sm: "1rem" },
                wordBreak: "break-word",
              }}
            >
              {session.patientName}
            </Typography>
            <Badge status={session.status} />
          </Box>
          <Typography sx={{ color: "grey.400", fontSize: "0.875rem", mb: 1.5 }}>
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
                <Typography sx={{ color: "grey.400", fontSize: "0.875rem" }}>
                  Documentation
                </Typography>
                <Typography sx={{ color: "grey.300", fontSize: "0.875rem" }}>
                  {completedDocs}/{totalDocs} complete
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionPercent}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "grey.800",
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(to right, #8b5cf6, #6366f1)",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          )}

          <Typography sx={{ fontSize: "0.75rem", color: "grey.500" }}>
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
            <Button size="sm" sx={{ width: { xs: "100%", sm: "auto" } }}>
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
