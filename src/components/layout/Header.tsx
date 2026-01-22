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
        sx={{ maxWidth: "lg", width: "100%", mx: "auto", px: 2, minHeight: 56 }}
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
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "common.white",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            S
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "grey.100",
              fontSize: "1.5rem",
            }}
          >
            Strand Logistics
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
