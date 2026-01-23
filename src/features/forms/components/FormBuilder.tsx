"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Button } from "@/components/ui";
import { SortableField } from "./SortableField";
import type { FormField, FieldType, FormSchema, DocumentType } from "@/types";
import { getDocumentTypeInfo } from "@/features/documents/documentTypes";

interface FormBuilderProps {
  documentType: DocumentType;
  initialSchema?: FormSchema;
  onSave: (schema: FormSchema) => void;
  onBack: () => void;
}

export function FormBuilder({
  documentType,
  initialSchema,
  onSave,
  onBack,
}: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(
    initialSchema?.fields || [],
  );
  const docInfo = getDocumentTypeInfo(documentType);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: "",
      required: false,
      placeholder: "",
      options: type === "dropdown" ? [] : undefined,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    onSave({
      documentType,
      fields,
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Typography sx={{ fontSize: "1.875rem" }}>{docInfo?.icon}</Typography>
          <Typography variant="h3" sx={{ color: "text.primary" }}>
            {docInfo?.name}
          </Typography>
        </Box>
        <Typography sx={{ color: "text.secondary" }}>
          Build a digital form for this document (optional)
        </Typography>
      </Box>

      {/* Add Field Buttons */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        <Button size="sm" variant="outline" onClick={() => addField("text")}>
          + Text
        </Button>
        <Button size="sm" variant="outline" onClick={() => addField("number")}>
          + Number
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => addField("dropdown")}
        >
          + Dropdown
        </Button>
        <Button size="sm" variant="outline" onClick={() => addField("date")}>
          + Date
        </Button>
      </Box>

      {/* Form Fields */}
      {fields.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            bgcolor: "grey.50",
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <Typography sx={{ color: "text.secondary", mb: 1 }}>
            No fields added yet
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "text.disabled" }}>
            Add fields above, or skip to use image upload only
          </Typography>
        </Box>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  onDelete={() => deleteField(field.id)}
                  onUpdate={(updates) => updateField(field.id, updates)}
                />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      )}

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 1.5, mt: 4 }}>
        <Button variant="outline" onClick={onBack} sx={{ flex: 1 }}>
          Back
        </Button>
        <Button onClick={handleSave} sx={{ flex: 1 }}>
          {fields.length > 0
            ? `Save Form (${fields.length} fields)`
            : "Skip Form →"}
        </Button>
      </Box>
    </Box>
  );
}
