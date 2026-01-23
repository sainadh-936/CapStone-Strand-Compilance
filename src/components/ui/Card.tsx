"use client";

import { ReactNode } from "react";
import MUICard from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  sx?: object;
}

export function Card({ children, hover = false, onClick, sx }: CardProps) {
  return (
    <MUICard
      onClick={onClick}
      sx={{
        p: { xs: 2.5, sm: 3 },
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        borderRadius: 3,
        ...(hover && {
          "&:hover": {
            borderColor: "primary.main",
            transform: "translateY(-2px)",
            boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.2)",
          },
        }),
        ...sx,
      }}
    >
      {children}
    </MUICard>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
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
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
