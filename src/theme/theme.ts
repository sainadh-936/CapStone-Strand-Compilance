"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1", // indigo-500
      light: "#818cf8", // indigo-400
      dark: "#4f46e5", // indigo-600
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
      main: "#6366f1",
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
      "@media (max-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
      "@media (max-width:600px)": {
        fontSize: "1.25rem",
      },
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
      "@media (max-width:600px)": {
        fontSize: "1.125rem",
      },
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 600,
      "@media (max-width:600px)": {
        fontSize: "0.9375rem",
      },
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
          minHeight: 48,
          padding: "12px 24px",
          fontSize: "0.9375rem",
        },
        sizeMedium: {
          minHeight: 40,
          padding: "10px 18px",
        },
        sizeSmall: {
          minHeight: 36,
          padding: "8px 14px",
          fontSize: "0.8125rem",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
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
          "@media (max-width:600px)": {
            borderRadius: 10,
          },
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
              borderColor: "#6366f1",
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
            borderColor: "#6366f1",
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
          backgroundColor: "#312e81", // indigo-900
          borderBottom: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
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
