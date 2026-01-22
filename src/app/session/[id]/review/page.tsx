"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Card, Badge } from "@/components/ui";
import { getSession, saveSession } from "@/lib/storage";
import { getDocumentTypeInfo } from "@/features/documents/documentTypes";
import type { Session } from "@/types";

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const s = getSession(sessionId);
    if (!s) {
      router.push("/dashboard");
      return;
    }
    setSession(s);
    setIsLoading(false);
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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getSubmissionUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareWhatsApp = () => {
    const text = `Please submit the required documents for your sample collection:\n${getSubmissionUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
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
        <Typography
          variant="h1"
          sx={{
            background: "linear-gradient(to right, #ffffff, #94a3b8)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
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

      {/* Session Summary */}
      <Card sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: "common.white" }}>
              {session.patientName}
            </Typography>
            <Typography sx={{ color: "grey.400" }}>
              📱 {session.phoneNumber}
            </Typography>
          </Box>
          <Badge status={session.status} />
        </Box>

        <Divider sx={{ my: 3, borderColor: "grey.800" }} />

        <Box>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "grey.400",
              mb: 2,
            }}
          >
            Required Documents
          </Typography>
          <Stack spacing={1.5}>
            {session.requiredDocuments.map((docType) => {
              const info = getDocumentTypeInfo(docType);
              const schema = session.formSchemas[docType];
              const fieldCount = schema?.fields?.length || 0;
              return (
                <Box
                  key={docType}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>{info?.icon}</Typography>
                    <Typography
                      sx={{ color: "common.white", fontSize: "0.875rem" }}
                    >
                      {info?.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "0.75rem", color: "grey.500" }}>
                    {fieldCount > 0 ? `${fieldCount} fields` : "Image only"}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Card>

      {/* Link Generation / Share */}
      {!isLinkGenerated ? (
        <Button onClick={generateLink} sx={{ width: "100%" }} size="lg">
          🔗 Generate Shareable Link
        </Button>
      ) : (
        <Card
          sx={{
            background:
              "linear-gradient(to bottom right, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.15))",
            borderColor: "rgba(139, 92, 246, 0.3)",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: "0.875rem", color: "grey.400", mb: 1 }}>
              Submission Link
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                value={getSubmissionUrl()}
                slotProps={{ input: { readOnly: true } }}
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(15, 23, 42, 0.5)",
                    fontSize: "0.875rem",
                  },
                }}
              />
              <Button onClick={copyLink} variant="secondary">
                {copied ? "✓ Copied" : "📋 Copy"}
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button onClick={shareWhatsApp} variant="outline" sx={{ flex: 1 }}>
              💬 Share via WhatsApp
            </Button>
            <Button
              onClick={() => window.open(getSubmissionUrl(), "_blank")}
              variant="ghost"
              sx={{ flex: 1 }}
            >
              👁️ Preview
            </Button>
          </Box>
        </Card>
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button
          variant="outline"
          onClick={() => router.push(`/session/${sessionId}/forms`)}
          sx={{ flex: 1 }}
        >
          ← Edit Forms
        </Button>
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
