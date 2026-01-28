// Incentive configuration - easily adjustable for future changes
// Future: This config could be loaded from database/API for dynamic configuration

export const INCENTIVE_CONFIG = {
  perSession: {
    name: "Per Session Bonus",
    description: "Fixed bonus for each completed session",
    amount: 50, // ₹50 per session
    enabled: true,
  },
  onTime: {
    name: "On-Time Bonus",
    description: "Bonus for submitting within the time window",
    amount: 25, // ₹25 for on-time submission
    maxHours: 48, // Configurable: submission must be within 48 hours of link generation
    enabled: true,
  },
  compliance: {
    name: "Full Compliance Bonus",
    description: "Bonus for submitting all required documents",
    amount: 25, // ₹25 for 100% compliance
    minCompletionPercent: 100, // Configurable: could be 80%, 90%, etc.
    enabled: true,
  },
} as const;

// Calculate maximum possible incentive per session
export const MAX_INCENTIVE_PER_SESSION =
  INCENTIVE_CONFIG.perSession.amount +
  INCENTIVE_CONFIG.onTime.amount +
  INCENTIVE_CONFIG.compliance.amount;

// Helper to get all enabled rules
export function getEnabledRules() {
  return Object.entries(INCENTIVE_CONFIG)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => ({ key, ...config }));
}
