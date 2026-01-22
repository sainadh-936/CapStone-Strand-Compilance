"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@/components/ui";
import { getSession, saveSession } from "@/lib/storage";
import { SessionSummaryCard, ShareLinkCard } from "@/features/review";
import type { Session } from "@/types";

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function setReviewPage() {
      const s = getSession(sessionId);
      if (!s) {
        router.push("/dashboard");
        return;
      }
      setSession(s);
      setIsLoading(false);
    }
    setReviewPage();
  }, [sessionId, router]);

  const generateLink = () => {
    if (!session) return;

    const updatedSession: Session = {
      ...session,
      status: "link_generated",
      linkGeneratedAt: new Date().toISOString(),
    };
    saveSession(updatedSession);
    setSession(updatedSession);
  };

  const getSubmissionUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/submit/${sessionId}`;
  };

  if (isLoading || !session) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const isLinkGenerated = session.status !== "created";

  return (
    <Box sx={{ maxWidth: "sm", mx: "auto", px: 3, py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Box
          sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 2 }}
        >
          <Chip label="Step 4 of 4" size="small" sx={{ bgcolor: "grey.800" }} />
          <Typography sx={{ color: "grey.400" }}>•</Typography>
          <Typography sx={{ color: "grey.400" }}>
            {session.patientName}
          </Typography>
        </Box>
        <Typography variant="h1" sx={{ color: "common.white" }}>
          {isLinkGenerated
            ? "Collection Link Ready"
            : "Generate Collection Link"}
        </Typography>
        <Typography sx={{ color: "grey.400", mt: 2, fontSize: "1.125rem" }}>
          {isLinkGenerated
            ? "Share this link with the patient or phlebotomist"
            : "Review the session details and generate a shareable link"}
        </Typography>
      </Box>

      <SessionSummaryCard session={session} isLinkGenerated={isLinkGenerated} />

      {!isLinkGenerated ? (
        <Button onClick={generateLink} sx={{ width: "100%" }} size="lg">
          🔗 Generate Shareable Link
        </Button>
      ) : (
        <ShareLinkCard submissionUrl={getSubmissionUrl()} />
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        {!isLinkGenerated && (
          <Button
            variant="outline"
            onClick={() => router.push(`/session/${sessionId}/forms`)}
            sx={{ flex: 1 }}
          >
            ← Edit Forms
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          sx={{ flex: 1 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
}
