"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Button, Input, Card } from "@/components/ui";
import { agentSchema, type AgentInput } from "../schemas";
import type { Agent } from "@/types";

interface AgentFormProps {
  agent?: Agent | null;
  onSubmit: (data: AgentInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AgentForm({
  agent,
  onSubmit,
  onCancel,
  isLoading = false,
}: AgentFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Initialize form data from agent prop - use key prop on parent to reset when agent changes
  const [formData, setFormData] = useState<AgentInput>({
    name: agent?.name || "",
    phone: agent?.phone || "",
    status: agent?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = agentSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <Input
            label="Agent Name"
            placeholder="Enter agent's full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            error={errors.phone}
            required
          />

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              pt: 1,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              type="submit"
              isLoading={isLoading}
              sx={{ flex: { xs: 1, sm: "none" } }}
            >
              {agent ? "Update Agent" : "Create Agent"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              sx={{ flex: { xs: 1, sm: "none" } }}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </form>
    </Card>
  );
}
