"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import type { FormField } from "@/types";

interface SortableFieldProps {
  field: FormField;
  onDelete: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
}

export function SortableField({
  field,
  onDelete,
  onUpdate,
}: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fieldTypeLabels: Record<string, string> = {
    text: "Text Input",
    number: "Number",
    dropdown: "Dropdown",
    date: "Date",
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        bgcolor: "grey.50",
        border: 1,
        borderColor: isDragging ? "primary.main" : "grey.200",
        borderRadius: 3,
        p: 2,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        {/* Drag Handle */}
        <IconButton
          {...attributes}
          {...listeners}
          size="small"
          sx={{
            mt: 0.5,
            color: "grey.500",
            cursor: "grab",
            "&:active": { cursor: "grabbing" },
          }}
        >
          <DragIndicatorIcon />
        </IconButton>

        {/* Field Content */}
        <Box
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={fieldTypeLabels[field.type]}
              size="small"
              sx={{
                bgcolor: "grey.700",
                color: "grey.300",
                fontSize: "0.75rem",
              }}
            />
          </Box>

          <TextField
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Field label"
            size="small"
            fullWidth
          />

          <TextField
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="Placeholder text (optional)"
            size="small"
            fullWidth
          />

          {field.type === "dropdown" && (
            <TextField
              value={field.options?.join(", ") || ""}
              onChange={(e) =>
                onUpdate({
                  options: e.target.value
                    .split(",")
                    .map((o) => o.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Options (comma separated)"
              size="small"
              fullWidth
            />
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={field.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                size="small"
                sx={{
                  color: "grey.600",
                  "&.Mui-checked": { color: "primary.main" },
                }}
              />
            }
            label="Required field"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "0.875rem",
                color: "grey.400",
              },
            }}
          />
        </Box>

        {/* Delete Button */}
        <IconButton
          onClick={onDelete}
          size="small"
          sx={{ color: "grey.500", "&:hover": { color: "error.main" } }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
