"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { Card } from "@/components/ui";
import { FormBuilder } from "@/features/forms";
import { getSession, saveSession } from "@/lib/storage";
import { getDocumentTypeInfo } from "@/features/documents/documentTypes";
import type { Session, FormSchema } from "@/types";

export default function FormBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const s = getSession(sessionId);
    if (!s || s.requiredDocuments.length === 0) {
      router.push("/dashboard");
      return;
    }
    setSession(s);
    setIsLoading(false);
  }, [sessionId, router]);

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

  const currentDocType = session.requiredDocuments[currentDocIndex];
  const totalDocs = session.requiredDocuments.length;
  const isLastDoc = currentDocIndex === totalDocs - 1;

  const handleSaveForm = (schema: FormSchema) => {
    const updatedSession: Session = {
      ...session,
      formSchemas: {
        ...session.formSchemas,
        [schema.documentType]: schema,
      },
    };
    saveSession(updatedSession);
    setSession(updatedSession);

    if (isLastDoc) {
      // All forms done, go to review
      router.push(`/session/${sessionId}/review`);
    } else {
      // Move to next document
      setCurrentDocIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentDocIndex === 0) {
      router.push(`/session/${sessionId}/documents`);
    } else {
      setCurrentDocIndex((prev) => prev - 1);
    }
  };

  return (
    <Box sx={{ maxWidth: "sm", mx: "auto", px: 3, py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Box
          sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 2 }}
        >
          <Chip label="Step 3 of 4" size="small" sx={{ bgcolor: "grey.800" }} />
          <Typography sx={{ color: "grey.400" }}>•</Typography>
          <Typography sx={{ color: "grey.400" }}>
            {session.patientName}
          </Typography>
        </Box>
        <Typography variant="h1" sx={{ color: "common.white" }}>
          Build Digital Forms
        </Typography>
        <Typography sx={{ color: "grey.400", mt: 2, fontSize: "1.125rem" }}>
          Create custom forms for each document (optional)
        </Typography>
      </Box>

      {/* Progress Indicator */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 5 }}>
        {session.requiredDocuments.map((doc, idx) => {
          const info = getDocumentTypeInfo(doc);
          return (
            <Box
              key={doc}
              sx={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                transition: "background-color 0.2s ease",
                bgcolor:
                  idx < currentDocIndex
                    ? "success.main"
                    : idx === currentDocIndex
                      ? "primary.main"
                      : "grey.700",
              }}
              title={info?.name}
            />
          );
        })}
      </Box>

      <Card sx={{ mb: 4 }}>
        <FormBuilder
          key={currentDocType} // Force remount on doc change
          documentType={currentDocType}
          initialSchema={session.formSchemas[currentDocType]}
          onSave={handleSaveForm}
          onBack={handleBack}
        />
      </Card>

      <Typography
        sx={{
          textAlign: "center",
          fontSize: "0.875rem",
          color: "grey.500",
          mt: 3,
        }}
      >
        Document {currentDocIndex + 1} of {totalDocs}
      </Typography>
    </Box>
  );
}
