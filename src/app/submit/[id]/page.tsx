"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Card } from "@/components/ui";
import { getSession, saveSession, saveIncentive } from "@/lib/storage";
import { createIncentiveForSession } from "@/features/incentives";
import { getDocumentTypeInfo } from "@/features/documents/documentTypes";
import type {
  Session,
  DocumentType,
  DocumentSubmission,
  FormField,
} from "@/types";

export default function PublicSubmissionPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [submissions, setSubmissions] = useState<
    Record<DocumentType, DocumentSubmission>
  >({} as Record<DocumentType, DocumentSubmission>);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    async function setPublicSubmissionPage() {
      const s = getSession(sessionId);
      if (!s) {
        setIsLoading(false);
        return;
      }
      setSession(s);

      // Check if already submitted
      if (s.status === "submitted") {
        setIsComplete(true);
      } else if (s.status === "link_generated") {
        // Update status to in_progress
        const updated = { ...s, status: "in_progress" as const };
        saveSession(updated);
        setSession(updated);
      }

      setIsLoading(false);
    }
    setPublicSubmissionPage();
  }, [sessionId]);

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

  if (!session) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Card sx={{ textAlign: "center", maxWidth: 320 }}>
          <Typography sx={{ fontSize: "3rem", mb: 2 }}>🔗</Typography>
          <Typography variant="h3" sx={{ color: "text.primary", mb: 1 }}>
            Link Not Found
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            This submission link is invalid or has expired.
          </Typography>
        </Card>
      </Box>
    );
  }

  if (isComplete) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Card sx={{ textAlign: "center", maxWidth: 320 }}>
          <Typography sx={{ fontSize: "3rem", mb: 2 }}>✅</Typography>
          <Typography variant="h3" sx={{ color: "text.primary", mb: 1 }}>
            Submission Complete
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Thank you! Your documents have been submitted successfully.
          </Typography>
        </Card>
      </Box>
    );
  }

  const currentDocType = session.requiredDocuments[currentDocIndex];
  const currentDocInfo = getDocumentTypeInfo(currentDocType);
  const currentSchema = session.formSchemas[currentDocType];
  const totalDocs = session.requiredDocuments.length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSubmissions((prev) => ({
        ...prev,
        [currentDocType]: {
          ...prev[currentDocType],
          documentType: currentDocType,
          imageUrl: event.target?.result as string,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFormChange = (fieldId: string, value: string | number) => {
    setSubmissions((prev) => ({
      ...prev,
      [currentDocType]: {
        ...prev[currentDocType],
        documentType: currentDocType,
        formData: {
          ...prev[currentDocType]?.formData,
          [fieldId]: value,
        },
      },
    }));
  };

  const isDocumentComplete = () => {
    const sub = submissions[currentDocType];
    if (!sub) return false;

    // Must have either image or form data
    const hasImage = !!sub.imageUrl;

    // If has form, check required fields
    if (currentSchema?.fields?.length) {
      const requiredFields = currentSchema.fields.filter((f) => f.required);
      const allRequiredFilled = requiredFields.every(
        (f) => sub.formData?.[f.id] !== undefined && sub.formData[f.id] !== "",
      );
      return hasImage || allRequiredFilled;
    }

    return hasImage;
  };

  const handleNext = () => {
    if (currentDocIndex < totalDocs - 1) {
      setCurrentDocIndex((prev) => prev + 1);
    }
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);

    // Save all submissions
    const allSubmissions: DocumentSubmission[] = session.requiredDocuments.map(
      (docType) => ({
        ...submissions[docType],
        documentType: docType,
        submittedAt: new Date().toISOString(),
      }),
    );

    const updatedSession: Session = {
      ...session,
      status: "submitted",
      submissions: allSubmissions,
      completedAt: new Date().toISOString(),
    };

    saveSession(updatedSession);

    // Calculate and save incentive if agent assigned
    const incentive = createIncentiveForSession(updatedSession);
    if (incentive) {
      saveIncentive(incentive);
    }

    setSession(updatedSession);
    setIsComplete(true);
    setIsSubmitting(false);
  };

  const isLastDoc = currentDocIndex === totalDocs - 1;
  const canProceed = isDocumentComplete();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 2, sm: 3 },
        px: { xs: 1.5, sm: 2 },
        pt: "calc(env(safe-area-inset-top) + 16px)",
        pb: "calc(env(safe-area-inset-bottom) + 16px)",
      }}
    >
      <Box sx={{ maxWidth: "sm", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: "linear-gradient(to bottom right, #8b5cf6, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "common.white",
              fontWeight: 700,
              fontSize: "1.25rem",
              mx: "auto",
              mb: 1.5,
            }}
          >
            S
          </Box>
          <Typography variant="h3" sx={{ color: "text.primary" }}>
            {session.patientName}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            Document Submission
          </Typography>
        </Box>

        {/* Progress */}
        <Box sx={{ display: "flex", gap: 0.5, mb: 3 }}>
          {session.requiredDocuments.map((_, idx) => (
            <Box
              key={idx}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                transition: "background-color 0.2s ease",
                bgcolor:
                  idx < currentDocIndex
                    ? "success.main"
                    : idx === currentDocIndex
                      ? "primary.main"
                      : "grey.200",
              }}
            />
          ))}
        </Box>

        {/* Current Document */}
        <Card>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>
              {currentDocInfo?.icon}
            </Typography>
            <Typography variant="h4" sx={{ color: "text.primary" }}>
              {currentDocInfo?.name}
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
              Document {currentDocIndex + 1} of {totalDocs}
            </Typography>
          </Box>

          {/* Image Upload */}
          <Box sx={{ mb: 3 }}>
            <ImageUploader
              currentImage={submissions[currentDocType]?.imageUrl}
              onUpload={handleImageUpload}
            />
          </Box>

          {/* Digital Form Fields */}
          {currentSchema?.fields && currentSchema.fields.length > 0 && (
            <>
              <Divider sx={{ my: 3, borderColor: "divider" }} />
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "text.secondary",
                  mb: 2,
                }}
              >
                Or fill the digital form
              </Typography>
              <Stack spacing={2}>
                {currentSchema.fields.map((field) => (
                  <FormFieldInput
                    key={field.id}
                    field={field}
                    value={
                      submissions[currentDocType]?.formData?.[field.id] || ""
                    }
                    onChange={(value) => handleFormChange(field.id, value)}
                  />
                ))}
              </Stack>
            </>
          )}

          {/* Actions */}
          <Divider sx={{ my: 3, borderColor: "divider" }} />
          {isLastDoc ? (
            <Button
              onClick={handleSubmitAll}
              sx={{ width: "100%" }}
              size="lg"
              disabled={!canProceed}
              isLoading={isSubmitting}
            >
              Submit All Documents ✓
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              sx={{ width: "100%" }}
              size="lg"
              disabled={!canProceed}
            >
              Next Document →
            </Button>
          )}
        </Card>
      </Box>
    </Box>
  );
}

// Image Upload Component
function ImageUploader({
  currentImage,
  onUpload,
}: {
  currentImage?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onUpload}
        style={{ display: "none" }}
      />

      {currentImage ? (
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={currentImage}
            alt="Uploaded document"
            sx={{
              width: "100%",
              height: 192,
              objectFit: "cover",
              borderRadius: 3,
            }}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            size="sm"
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
            }}
          >
            📷 Retake
          </Button>
        </Box>
      ) : (
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            width: "100%",
            height: 192,
            border: "2px dashed",
            borderColor: "grey.300",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            cursor: "pointer",
            transition: "all 0.2s ease",
            bgcolor: "grey.50",
            "&:hover": {
              borderColor: "primary.main",
              color: "primary.main",
              bgcolor: "rgba(99, 102, 241, 0.05)",
            },
          }}
        >
          <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>📷</Typography>
          <Typography sx={{ fontWeight: 500 }}>Take Photo or Upload</Typography>
          <Typography sx={{ fontSize: "0.875rem" }}>
            Tap to capture document
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// Form Field Input Component
function FormFieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string | number;
  onChange: (value: string | number) => void;
}) {
  if (field.type === "dropdown") {
    return (
      <FormControl fullWidth>
        <InputLabel>
          {field.label}
          {field.required && " *"}
        </InputLabel>
        <Select
          value={value as string}
          label={field.label + (field.required ? " *" : "")}
          onChange={(e) => onChange(e.target.value)}
          sx={{ minHeight: 48 }}
        >
          <MenuItem value="">Select...</MenuItem>
          {field.options?.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      label={field.label}
      required={field.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      type={
        field.type === "number"
          ? "number"
          : field.type === "date"
            ? "date"
            : "text"
      }
      fullWidth
      slotProps={{
        inputLabel: field.type === "date" ? { shrink: true } : undefined,
      }}
      sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
    />
  );
}
