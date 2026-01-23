import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Card, Badge } from "@/components/ui";
import { DocumentCard } from "./DocumentCard";
import type { Session } from "@/types";

interface SessionSummaryCardProps {
  session: Session;
  isLinkGenerated: boolean;
}

export function SessionSummaryCard({
  session,
  isLinkGenerated,
}: SessionSummaryCardProps) {
  return (
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
          <Typography variant="h4" sx={{ color: "text.primary" }}>
            {session.patientName}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            📱 {session.phoneNumber}
          </Typography>
        </Box>
        <Badge status={session.status} />
      </Box>

      <Divider sx={{ my: 3, borderColor: "divider" }} />

      <Box>
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "text.secondary",
            mb: 2,
          }}
        >
          Required Documents
        </Typography>
        <Stack spacing={2}>
          {session.requiredDocuments.map((docType) => {
            const schema = session.formSchemas[docType];
            const submission = session.submissions?.find(
              (s) => s.documentType === docType,
            );

            return (
              <DocumentCard
                key={docType}
                docType={docType}
                schema={schema}
                submission={submission}
                isLinkGenerated={isLinkGenerated}
              />
            );
          })}
        </Stack>
      </Box>
    </Card>
  );
}
