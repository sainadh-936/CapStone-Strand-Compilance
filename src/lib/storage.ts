import type { Session, Agent, Incentive, PayoutBatch } from "@/types";

const STORAGE_KEYS = {
  sessions: "strand_sessions",
  agents: "strand_agents",
  incentives: "strand_incentives",
  payoutBatches: "strand_payout_batches",
} as const;

// ============================================
// SESSION STORAGE
// ============================================

// Get all sessions from localStorage
export function getSessions(): Session[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.sessions);
  return data ? JSON.parse(data) : [];
}

// Get a single session by ID
export function getSession(id: string): Session | null {
  const sessions = getSessions();
  return sessions.find((s) => s.id === id) || null;
}

// Save a new session
export function saveSession(session: Session): void {
  const sessions = getSessions();
  const existingIndex = sessions.findIndex((s) => s.id === session.id);

  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }

  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
}

// Update session status
export function updateSessionStatus(
  id: string,
  status: Session["status"],
): void {
  const session = getSession(id);
  if (session) {
    session.status = status;
    if (status === "submitted") {
      session.completedAt = new Date().toISOString();
    }
    saveSession(session);
  }
}

// Delete a session
export function deleteSession(id: string): void {
  const sessions = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
}

// Get sessions by agent ID
export function getSessionsByAgent(agentId: string): Session[] {
  return getSessions().filter((s) => s.agentId === agentId);
}

// ============================================
// AGENT STORAGE
// ============================================

// Get all agents from localStorage
export function getAgents(): Agent[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.agents);
  return data ? JSON.parse(data) : [];
}

// Get active agents only
export function getActiveAgents(): Agent[] {
  return getAgents().filter((a) => a.status === "active");
}

// Get a single agent by ID
export function getAgent(id: string): Agent | null {
  const agents = getAgents();
  return agents.find((a) => a.id === id) || null;
}

// Save an agent (create or update)
export function saveAgent(agent: Agent): void {
  const agents = getAgents();
  const existingIndex = agents.findIndex((a) => a.id === agent.id);

  if (existingIndex >= 0) {
    agents[existingIndex] = agent;
  } else {
    agents.push(agent);
  }

  localStorage.setItem(STORAGE_KEYS.agents, JSON.stringify(agents));
}

// Delete an agent
export function deleteAgent(id: string): void {
  const agents = getAgents().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.agents, JSON.stringify(agents));
}

// ============================================
// INCENTIVE STORAGE
// ============================================

// Get all incentives from localStorage
export function getIncentives(): Incentive[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.incentives);
  return data ? JSON.parse(data) : [];
}

// Get a single incentive by ID
export function getIncentive(id: string): Incentive | null {
  const incentives = getIncentives();
  return incentives.find((i) => i.id === id) || null;
}

// Get incentive by session ID
export function getIncentiveBySession(sessionId: string): Incentive | null {
  const incentives = getIncentives();
  return incentives.find((i) => i.sessionId === sessionId) || null;
}

// Get incentives by agent ID
export function getIncentivesByAgent(agentId: string): Incentive[] {
  return getIncentives().filter((i) => i.agentId === agentId);
}

// Get incentives by status
export function getIncentivesByStatus(
  status: Incentive["status"],
): Incentive[] {
  return getIncentives().filter((i) => i.status === status);
}

// Save an incentive (create or update)
export function saveIncentive(incentive: Incentive): void {
  const incentives = getIncentives();
  const existingIndex = incentives.findIndex((i) => i.id === incentive.id);

  if (existingIndex >= 0) {
    incentives[existingIndex] = incentive;
  } else {
    incentives.push(incentive);
  }

  localStorage.setItem(STORAGE_KEYS.incentives, JSON.stringify(incentives));
}

// Update incentive status
export function updateIncentiveStatus(
  id: string,
  status: Incentive["status"],
  approvedBy?: string,
): void {
  const incentive = getIncentive(id);
  if (incentive) {
    incentive.status = status;
    if (status === "approved" && approvedBy) {
      incentive.approvedBy = approvedBy;
      incentive.approvedAt = new Date().toISOString();
    }
    saveIncentive(incentive);
  }
}

// Bulk update incentives to paid status
export function markIncentivesAsPaid(ids: string[]): void {
  const incentives = getIncentives();
  const updatedIncentives = incentives.map((i) => {
    if (ids.includes(i.id)) {
      return { ...i, status: "paid" as const };
    }
    return i;
  });
  localStorage.setItem(
    STORAGE_KEYS.incentives,
    JSON.stringify(updatedIncentives),
  );
}

// ============================================
// PAYOUT BATCH STORAGE
// ============================================

// Get all payout batches
export function getPayoutBatches(): PayoutBatch[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.payoutBatches);
  return data ? JSON.parse(data) : [];
}

// Save a payout batch
export function savePayoutBatch(batch: PayoutBatch): void {
  const batches = getPayoutBatches();
  batches.push(batch);
  localStorage.setItem(STORAGE_KEYS.payoutBatches, JSON.stringify(batches));
}
