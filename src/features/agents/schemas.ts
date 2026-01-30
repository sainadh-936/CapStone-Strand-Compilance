import { z } from "zod";

// Agent creation/update schema
export const agentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number format"),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type AgentInput = z.infer<typeof agentSchema>;

// Validation helper
export function validateAgent(data: unknown) {
  return agentSchema.safeParse(data);
}
