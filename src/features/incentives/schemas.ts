import { z } from "zod";

// Incentive status update schema
export const updateIncentiveStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "paid"]),
  approvedBy: z.string().optional(),
});

export type UpdateIncentiveStatusInput = z.infer<
  typeof updateIncentiveStatusSchema
>;

// Payout batch schema
export const payoutBatchSchema = z.object({
  incentiveIds: z.array(z.string()).min(1, "At least one incentive required"),
});

export type PayoutBatchInput = z.infer<typeof payoutBatchSchema>;
