"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6", // blue-500
      light: "#60a5fa", // blue-400
      dark: "#2563eb", // blue-600
    },
    secondary: {
      main: "#64748b", // slate-500
      light: "#94a3b8", // slate-400
      dark: "#475569", // slate-600
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e0b",
    },
    success: {
      main: "#22c55e",
    },
    info: {
      main: "#3b82f6",
    },
    background: {
      default: "#0f172a", // slate-900
      paper: "#1e293b", // slate-800
    },
    text: {
      primary: "#f8fafc", // slate-50
      secondary: "#94a3b8", // slate-400
      disabled: "#64748b", // slate-500
    },
    divider: "#334155", // slate-700
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: "1.875rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.8125rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 6,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        sizeLarge: {
          minHeight: 44,
          padding: "10px 20px",
          fontSize: "0.9375rem",
        },
        sizeMedium: {
          minHeight: 36,
          padding: "8px 16px",
        },
        sizeSmall: {
          minHeight: 32,
          padding: "6px 12px",
          fontSize: "0.8125rem",
        },
        containedPrimary: {
          backgroundColor: "#3b82f6",
          "&:hover": {
            backgroundColor: "#2563eb",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          borderRadius: 8,
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
            backgroundColor: "#0f172a",
            "& fieldset": {
              borderColor: "#334155",
            },
            "&:hover fieldset": {
              borderColor: "#475569",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: "#0f172a",
          "& fieldset": {
            borderColor: "#334155",
          },
          "&:hover fieldset": {
            borderColor: "#475569",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#3b82f6",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          backgroundColor: "#334155",
        },
        bar: {
          borderRadius: 2,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b",
          borderBottom: "1px solid #334155",
          boxShadow: "none",
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
