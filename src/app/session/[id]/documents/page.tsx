"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import { Button, Card } from "@/components/ui";
import { getSession, saveSession } from "@/lib/storage";
import { DOCUMENT_TYPES } from "@/features/documents/documentTypes";
import type { Session, DocumentType } from "@/types";

export default function DocumentSelectionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const s = getSession(sessionId);
    if (!s) {
      router.push("/dashboard");
      return;
    }
    setSession(s);
    setSelectedDocs(s.requiredDocuments);
    setIsLoading(false);
  }, [sessionId, router]);

  const toggleDocument = (docType: DocumentType) => {
    setSelectedDocs((prev) =>
      prev.includes(docType)
        ? prev.filter((d) => d !== docType)
        : [...prev, docType],
    );
  };

  const handleContinue = () => {
    if (!session || selectedDocs.length === 0) return;

    const updatedSession: Session = {
      ...session,
      requiredDocuments: selectedDocs,
    };
    saveSession(updatedSession);

    // Navigate to form builder for first document
    router.push(`/session/${sessionId}/forms`);
  };

  if (isLoading) {
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

  return (
    <Box sx={{ maxWidth: "sm", mx: "auto", px: 3, py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Box
          sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 2 }}
        >
          <Chip label="Step 2 of 4" size="small" sx={{ bgcolor: "grey.800" }} />
          <Typography sx={{ color: "grey.400" }}>•</Typography>
          <Typography sx={{ color: "grey.400" }}>
            {session?.patientName}
          </Typography>
        </Box>
        <Typography variant="h1" sx={{ color: "common.white" }}>
          Select Required Documents
        </Typography>
        <Typography sx={{ color: "grey.400", mt: 2, fontSize: "1.125rem" }}>
          Choose which documents need to be collected for this session
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ mb: 5 }}>
        {DOCUMENT_TYPES.map((doc) => {
          const isSelected = selectedDocs.includes(doc.id);
          return (
            <Card
              key={doc.id}
              hover
              onClick={() => toggleDocument(doc.id)}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s ease",
                ...(isSelected && {
                  borderColor: "primary.main",
                  bgcolor: "rgba(59, 130, 246, 0.1)",
                }),
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    bgcolor: isSelected
                      ? "rgba(59, 130, 246, 0.2)"
                      : "grey.800",
                  }}
                >
                  {doc.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: "common.white" }}>
                    {doc.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "grey.400" }}>
                    {doc.description}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: 2,
                    borderColor: isSelected ? "primary.main" : "grey.600",
                    bgcolor: isSelected ? "primary.main" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isSelected && (
                    <CheckIcon sx={{ fontSize: 16, color: "common.white" }} />
                  )}
                </Box>
              </Box>
            </Card>
          );
        })}
      </Stack>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleContinue}
          disabled={selectedDocs.length === 0}
          sx={{ flex: 1 }}
        >
          Continue ({selectedDocs.length} selected)
        </Button>
      </Box>
    </Box>
  );
}
