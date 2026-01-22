"use client";

import { forwardRef } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";

interface InputProps extends Omit<TextFieldProps, "error"> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, ...props }, ref) => {
    return (
      <Box sx={{ width: "100%" }}>
        <TextField
          inputRef={ref}
          label={label}
          required={required}
          error={!!error}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiInputBase-root": {
              minHeight: 48,
            },
          }}
          {...props}
        />
        {error && (
          <FormHelperText error sx={{ mt: 0.5 }}>
            {error}
          </FormHelperText>
        )}
        {helperText && !error && (
          <FormHelperText sx={{ mt: 0.5, color: "grey.500" }}>
            {helperText}
          </FormHelperText>
        )}
      </Box>
    );
  },
);

Input.displayName = "Input";

export { Input };
