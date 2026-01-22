"use client";

import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on public submission pages
  if (pathname?.startsWith("/submit/")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        pt: 4,
        pb: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Divider sx={{ mb: 3, borderColor: "divider" }} />
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1,
              background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "common.white",
              fontWeight: 700,
              fontSize: "0.75rem",
            }}
          >
            S
          </Box>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "text.secondary",
            }}
          >
            Strand Life Sciences
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "text.disabled",
            textAlign: { xs: "center", sm: "right" },
          }}
        >
          © {currentYear} Strand Life Sciences. Logistics Command Center.
        </Typography>
      </Box>

      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: { xs: 2, sm: 3 },
        }}
      >
        {["Privacy Policy", "Terms of Service", "Support"].map((link) => (
          <Typography
            key={link}
            component="a"
            href="#"
            sx={{
              fontSize: "0.75rem",
              color: "text.disabled",
              textDecoration: "none",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "primary.light",
              },
            }}
          >
            {link}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
