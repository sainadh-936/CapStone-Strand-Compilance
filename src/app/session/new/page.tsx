"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Input, Card } from "@/components/ui";
import {
  createSessionSchema,
  type CreateSessionInput,
} from "@/features/sessions/schemas";
import { saveSession } from "@/lib/storage";
import type { Session } from "@/types";

export default function NewSessionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<CreateSessionInput>>({
    patientName: "",
    phoneNumber: "",
    gender: undefined,
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validate with Zod
    const result = createSessionSchema.safeParse({
      ...formData,
      age: formData.age ? Number(formData.age) : undefined,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    // Create new session
    const session: Session = {
      id: uuidv4(),
      patientName: result.data.patientName,
      phoneNumber: result.data.phoneNumber,
      age: result.data.age,
      gender: result.data.gender,
      city: result.data.city,
      status: "created",
      requiredDocuments: [],
      formSchemas: {},
      submissions: [],
      createdAt: new Date().toISOString(),
    };

    saveSession(session);

    // Navigate to document selection
    router.push(`/session/${session.id}/documents`);
  };

  return (
    <Box sx={{ maxWidth: "sm", mx: "auto", px: 3, py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h1"
          sx={{
            background: "linear-gradient(to right, #ffffff, #94a3b8)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create Collection Session
        </Typography>
        <Typography sx={{ color: "grey.400", mt: 2, fontSize: "1.125rem" }}>
          Enter patient details to start a new sample collection session
        </Typography>
      </Box>

      <Card>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Input
              label="Patient Name"
              placeholder="Enter patient's full name"
              required
              value={formData.patientName || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  patientName: e.target.value,
                }))
              }
              error={errors.patientName}
            />

            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              type="tel"
              required
              value={formData.phoneNumber || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
              error={errors.phoneNumber}
            />

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
            >
              <Input
                label="Age"
                placeholder="Optional"
                type="number"
                inputProps={{ min: 0, max: 150 }}
                value={formData.age || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    age: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                error={errors.age}
              />

              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender || ""}
                  label="Gender"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gender: e.target.value as
                        | "male"
                        | "female"
                        | "other"
                        | undefined,
                    }))
                  }
                  sx={{ minHeight: 48 }}
                >
                  <MenuItem value="">Select...</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Input
              label="City"
              placeholder="Optional"
              value={formData.city || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, city: e.target.value }))
              }
              error={errors.city}
            />

            <Box sx={{ pt: 3 }}>
              <Button
                type="submit"
                sx={{ width: "100%" }}
                size="lg"
                isLoading={isLoading}
              >
                Continue to Document Selection
              </Button>
            </Box>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}
