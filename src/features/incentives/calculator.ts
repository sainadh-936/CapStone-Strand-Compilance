import type { Session, Incentive, IncentiveBreakdown } from "@/types";
import { INCENTIVE_CONFIG } from "./config";

/**
 * Calculate incentive breakdown for a completed session
 * This is the core business logic for incentive calculation
 */
export function calculateIncentiveBreakdown(
  session: Session,
): IncentiveBreakdown {
  const breakdown: IncentiveBreakdown = {
    perSession: 0,
    onTime: 0,
    compliance: 0,
  };

  // Session must be submitted to be eligible for incentives
  if (session.status !== "submitted") {
    return breakdown;
  }

  // Session must have an assigned agent
  if (!session.agentId) {
    return breakdown;
  }

  // 1. Per Session Bonus - always awarded for completed sessions
  if (INCENTIVE_CONFIG.perSession.enabled) {
    breakdown.perSession = INCENTIVE_CONFIG.perSession.amount;
  }

  // 2. On-Time Bonus - awarded if submitted within the time window
  if (
    INCENTIVE_CONFIG.onTime.enabled &&
    session.linkGeneratedAt &&
    session.completedAt
  ) {
    const linkGeneratedTime = new Date(session.linkGeneratedAt).getTime();
    const completedTime = new Date(session.completedAt).getTime();
    const hoursDiff = (completedTime - linkGeneratedTime) / (1000 * 60 * 60);

    if (hoursDiff <= INCENTIVE_CONFIG.onTime.maxHours) {
      breakdown.onTime = INCENTIVE_CONFIG.onTime.amount;
    }
  }

  // 3. Compliance Bonus - awarded if all required documents are submitted
  if (INCENTIVE_CONFIG.compliance.enabled) {
    const requiredCount = session.requiredDocuments.length;
    const submittedCount = session.submissions.length;
    const completionPercent =
      requiredCount > 0 ? (submittedCount / requiredCount) * 100 : 0;

    if (completionPercent >= INCENTIVE_CONFIG.compliance.minCompletionPercent) {
      breakdown.compliance = INCENTIVE_CONFIG.compliance.amount;
    }
  }

  return breakdown;
}

/**
 * Calculate total amount from breakdown
 */
export function calculateTotalAmount(breakdown: IncentiveBreakdown): number {
  return breakdown.perSession + breakdown.onTime + breakdown.compliance;
}

/**
 * Generate a unique incentive ID
 */
function generateIncentiveId(): string {
  return `inc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create an incentive record for a session
 * Call this when a session is marked as submitted
 */
export function createIncentiveForSession(session: Session): Incentive | null {
  // Validate session eligibility
  if (session.status !== "submitted" || !session.agentId) {
    return null;
  }

  const breakdown = calculateIncentiveBreakdown(session);
  const totalAmount = calculateTotalAmount(breakdown);

  // Don't create incentive if total is 0
  if (totalAmount === 0) {
    return null;
  }

  const incentive: Incentive = {
    id: generateIncentiveId(),
    sessionId: session.id,
    agentId: session.agentId,
    breakdown,
    totalAmount,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  return incentive;
}

/**
 * Get a human-readable breakdown of incentive components
 */
export function getIncentiveBreakdownDescription(
  breakdown: IncentiveBreakdown,
): string[] {
  const descriptions: string[] = [];

  if (breakdown.perSession > 0) {
    descriptions.push(
      `${INCENTIVE_CONFIG.perSession.name}: ₹${breakdown.perSession}`,
    );
  }
  if (breakdown.onTime > 0) {
    descriptions.push(`${INCENTIVE_CONFIG.onTime.name}: ₹${breakdown.onTime}`);
  }
  if (breakdown.compliance > 0) {
    descriptions.push(
      `${INCENTIVE_CONFIG.compliance.name}: ₹${breakdown.compliance}`,
    );
  }

  return descriptions;
}
