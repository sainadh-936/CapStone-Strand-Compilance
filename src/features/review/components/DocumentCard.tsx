import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { getDocumentTypeInfo } from "@/features/documents/documentTypes";
import type { DocumentType, FormSchema, DocumentSubmission } from "@/types";

interface DocumentCardProps {
  docType: DocumentType;
  schema?: FormSchema;
  submission?: DocumentSubmission;
  isLinkGenerated: boolean;
}

export function DocumentCard({
  docType,
  schema,
  submission,
  isLinkGenerated,
}: DocumentCardProps) {
  const info = getDocumentTypeInfo(docType);
  const fieldCount = schema?.fields?.length || 0;
  const hasSubmission = !!submission;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: hasSubmission ? "rgba(34, 197, 94, 0.08)" : "grey.50",
        border: "1px solid",
        borderColor: hasSubmission ? "rgba(34, 197, 94, 0.3)" : "grey.200",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: hasSubmission ? 2 : 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>{info?.icon}</Typography>
          <Typography sx={{ color: "text.primary", fontSize: "0.875rem" }}>
            {info?.name}
          </Typography>
          {hasSubmission && (
            <Chip
              label="Submitted"
              size="small"
              sx={{
                bgcolor: "rgba(34, 197, 94, 0.15)",
                color: "success.main",
                fontSize: "0.7rem",
                height: 20,
              }}
            />
          )}
        </Box>
        <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
          {fieldCount > 0 ? `${fieldCount} fields` : "Image only"}
        </Typography>
      </Box>

      {/* Show submitted data */}
      {hasSubmission && (
        <Box sx={{ mt: 1 }}>
          {/* Show uploaded image */}
          {submission.imageUrl && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "grey.500",
                  }}
                >
                  📷 Uploaded Image
                </Typography>
                <Box
                  component="a"
                  href={submission.imageUrl}
                  download={`${docType}-document.png`}
                  sx={{
                    fontSize: "0.7rem",
                    color: "primary.main",
                    textDecoration: "none",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  ⬇️ Download
                </Box>
              </Box>
              <Box
                component="img"
                src={submission.imageUrl}
                alt={`${info?.name} document`}
                sx={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.700",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}

          {/* Show form data */}
          {submission.formData &&
            Object.keys(submission.formData).length > 0 && (
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "grey.500",
                    mb: 1,
                  }}
                >
                  📝 Form Data
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 1,
                  }}
                >
                  {schema?.fields?.map((field) => {
                    const value = submission.formData?.[field.id];
                    if (value === undefined || value === "") return null;
                    return (
                      <Box
                        key={field.id}
                        sx={{
                          p: 1,
                          bgcolor: "rgba(0, 0, 0, 0.2)",
                          borderRadius: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.65rem",
                            color: "grey.500",
                            textTransform: "uppercase",
                          }}
                        >
                          {field.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            color: "common.white",
                            wordBreak: "break-word",
                          }}
                        >
                          {String(value)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

          {/* Show submission time */}
          {submission.submittedAt && (
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "grey.600",
                mt: 1,
                textAlign: "right",
              }}
            >
              Submitted: {new Date(submission.submittedAt).toLocaleString()}
            </Typography>
          )}
        </Box>
      )}

      {/* Show pending state */}
      {!hasSubmission && isLinkGenerated && (
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "warning.main",
            mt: 1,
          }}
        >
          ⏳ Awaiting submission
        </Typography>
      )}
    </Box>
  );
}
