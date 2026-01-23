"use client";

import { forwardRef, ReactNode } from "react";
import MUIButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { SxProps, Theme } from "@mui/material/styles";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  sx?: SxProps<Theme>;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      children,
      onClick,
      type = "button",
      sx,
      ...props
    },
    ref,
  ) => {
    const sizeMap = {
      sm: "small" as const,
      md: "medium" as const,
      lg: "large" as const,
    };

    const getVariantStyles = (): SxProps<Theme> => {
      switch (variant) {
        case "secondary":
          return {
            bgcolor: "grey.100",
            color: "text.primary",
            "&:hover": { bgcolor: "grey.200" },
          };
        case "outline":
          return {
            borderColor: "grey.300",
            borderWidth: 2,
            color: "text.secondary",
            "&:hover": {
              borderColor: "primary.main",
              color: "primary.main",
              bgcolor: "rgba(99, 102, 241, 0.05)",
              borderWidth: 2,
            },
          };
        case "ghost":
          return {
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
              bgcolor: "rgba(99, 102, 241, 0.08)",
            },
          };
        default:
          return {};
      }
    };

    const getMuiVariant = () => {
      switch (variant) {
        case "primary":
        case "secondary":
        case "danger":
          return "contained";
        case "outline":
          return "outlined";
        case "ghost":
          return "text";
        default:
          return "contained";
      }
    };

    const getMuiColor = () => {
      switch (variant) {
        case "primary":
          return "primary";
        case "danger":
          return "error";
        case "outline":
        case "ghost":
          return "inherit";
        default:
          return "primary";
      }
    };

    return (
      <MUIButton
        ref={ref}
        variant={getMuiVariant()}
        color={getMuiColor()}
        size={sizeMap[size]}
        disabled={disabled || isLoading}
        onClick={onClick}
        type={type}
        sx={[getVariantStyles(), ...(Array.isArray(sx) ? sx : [sx])]}
        {...props}
      >
        {isLoading && (
          <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
        )}
        {children}
      </MUIButton>
    );
  },
);

Button.displayName = "Button";

export { Button };
