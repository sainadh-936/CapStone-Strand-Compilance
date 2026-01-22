"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function Header() {
  const pathname = usePathname();

  // Hide header on public submission pages
  if (pathname?.startsWith("/submit/")) {
    return null;
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar
        sx={{
          maxWidth: "lg",
          width: "100%",
          mx: "auto",
          px: { xs: 1.5, sm: 2 },
          minHeight: { xs: 52, sm: 56 },
          pt: "env(safe-area-inset-top)",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Box
            sx={{
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              borderRadius: 1,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "common.white",
              fontWeight: 600,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            S
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "grey.100",
              fontSize: { xs: "1.125rem", sm: "1.5rem" },
            }}
          >
            Strand Logistics
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
