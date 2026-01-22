import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button, Card } from "@/components/ui";

interface ShareLinkCardProps {
  submissionUrl: string;
}

export function ShareLinkCard({ submissionUrl }: ShareLinkCardProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(submissionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareWhatsApp = () => {
    const text = `Please submit the required documents for your sample collection:\n${submissionUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const openPreview = () => {
    window.open(submissionUrl, "_blank");
  };

  return (
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
            value={submissionUrl}
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

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
        }}
      >
        <Button onClick={shareWhatsApp} variant="outline" sx={{ flex: 1 }}>
          💬 Share via WhatsApp
        </Button>
        <Button onClick={openPreview} variant="ghost" sx={{ flex: 1 }}>
          👁️ Preview
        </Button>
      </Box>
    </Card>
  );
}
