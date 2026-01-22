"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b5cf6", // violet-500
      light: "#a78bfa", // violet-400
      dark: "#7c3aed", // violet-600
    },
    secondary: {
      main: "#6366f1", // indigo-500
      light: "#818cf8", // indigo-400
      dark: "#4f46e5", // indigo-600
    },
    error: {
      main: "#ef4444", // red-500
    },
    warning: {
      main: "#f59e0b", // amber-500
    },
    success: {
      main: "#10b981", // emerald-500
    },
    info: {
      main: "#3b82f6", // blue-500
    },
    background: {
      default: "#0a0a0a", // Very dark background
      paper: "rgba(15, 23, 42, 0.5)", // slate-900/50
    },
    text: {
      primary: "#fafafa", // slate-50
      secondary: "#94a3b8", // slate-400
      disabled: "#64748b", // slate-500
    },
    divider: "rgba(51, 65, 85, 0.8)", // slate-700
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: "2.25rem", // 4xl
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.5rem", // 2xl
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.25rem", // xl
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.125rem", // lg
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 12,
        },
        sizeLarge: {
          minHeight: 52,
          padding: "12px 24px",
          fontSize: "1.125rem",
        },
        sizeMedium: {
          minHeight: 44,
          padding: "10px 16px",
        },
        sizeSmall: {
          minHeight: 36,
          padding: "6px 12px",
          fontSize: "0.875rem",
        },
        containedPrimary: {
          background: "linear-gradient(to right, #7c3aed, #4f46e5)",
          boxShadow: "0 10px 15px -3px rgba(139, 92, 246, 0.25)",
          "&:hover": {
            background: "linear-gradient(to right, #6d28d9, #4338ca)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(15, 23, 42, 0.5)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(51, 65, 85, 0.8)",
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "rgba(30, 41, 59, 0.5)",
            "& fieldset": {
              borderColor: "rgba(51, 65, 85, 0.8)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(71, 85, 105, 1)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8b5cf6",
            },
          },
          "& .MuiInputBase-input": {
            minHeight: 24,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "rgba(30, 41, 59, 0.5)",
          "& fieldset": {
            borderColor: "rgba(51, 65, 85, 0.8)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(71, 85, 105, 1)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#8b5cf6",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "rgba(30, 41, 59, 1)",
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0f172a",
          borderBottom: "1px solid rgba(51, 65, 85, 0.8)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
