"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const navItems = [
  { href: "/dashboard", label: "Sessions" },
  { href: "/agents", label: "Agents" },
  { href: "/incentives", label: "Incentives" },
];

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
          width: "100%",
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: { xs: 52, sm: 56, md: 70 },
          pt: "env(safe-area-inset-top)",
          justifyContent: "flex-start",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Box
            sx={{
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              borderRadius: 1.5,
              background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "common.white",
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.125rem" },
            }}
          >
            🔬
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "common.white",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              letterSpacing: "-0.01em",
              display: { xs: "none", sm: "block" },
            }}
          >
            Strand Logistics
          </Typography>
        </Link>

        {/* Navigation Links */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 2 },
            ml: "auto",
          }}
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  sx={{
                    color: isActive ? "common.white" : "rgba(255,255,255,0.7)",
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    fontWeight: isActive ? 600 : 400,
                    px: { xs: 1, sm: 1.5 },
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: isActive
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "common.white",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {item.label}
                </Typography>
              </Link>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
