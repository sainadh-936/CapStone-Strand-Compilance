import type { Session } from "@/types";

const STORAGE_KEY = "strand_sessions";

// Get all sessions from localStorage
export function getSessions(): Session[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// Update session status
export function updateSessionStatus(
  id: string,
  status: Session["status"],
): void {
  const session = getSession(id);
  if (session) {
    session.status = status;
    saveSession(session);
  }
}

// Delete a session
export function deleteSession(id: string): void {
  const sessions = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
