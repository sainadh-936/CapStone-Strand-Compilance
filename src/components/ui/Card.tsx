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
        p: 3,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        ...(hover && {
          "&:hover": {
            borderColor: "grey.700",
            bgcolor: "rgba(15, 23, 42, 0.7)",
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
        <Typography variant="h4" sx={{ color: "common.white" }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: "grey.400", mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
