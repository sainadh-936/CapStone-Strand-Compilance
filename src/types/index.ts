// Core type definitions for the Strand Logistics system

export type SessionStatus =
  | "created"
  | "link_generated"
  | "in_progress"
  | "submitted"
  | "incomplete";

export type DocumentType = "trf" | "prescription" | "histopathology" | "form_g";

export type FieldType = "text" | "number" | "dropdown" | "date";

// Agent status
export type AgentStatus = "active" | "inactive";

// Incentive status
export type IncentiveStatus = "pending" | "approved" | "rejected" | "paid";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[]; // For dropdown fields
}

export interface FormSchema {
  documentType: DocumentType;
  fields: FormField[];
}

export interface DocumentSubmission {
  documentType: DocumentType;
  imageUrl?: string; // Base64 or blob URL
  formData?: Record<string, string | number>;
  submittedAt?: string;
}

export interface Session {
  id: string;
  patientName: string;
  phoneNumber: string;
  age?: number;
  gender?: "male" | "female" | "other";
  city?: string;
  status: SessionStatus;
  requiredDocuments: DocumentType[];
  formSchemas: Partial<Record<DocumentType, FormSchema>>;
  submissions: DocumentSubmission[];
  createdAt: string;
  linkGeneratedAt?: string;
  // Agent assignment
  agentId?: string;
  // Completion tracking for incentive calculation
  completedAt?: string;
}

// Agent - Phlebotomist who collects samples
export interface Agent {
  id: string;
  name: string;
  phone: string;
  status: AgentStatus;
  createdAt: string;
}

// Incentive breakdown per session
export interface IncentiveBreakdown {
  perSession: number;
  onTime: number;
  compliance: number;
}

// Incentive calculated for a session
export interface Incentive {
  id: string;
  sessionId: string;
  agentId: string;
  breakdown: IncentiveBreakdown;
  totalAmount: number;
  status: IncentiveStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

// Payout batch for export
export interface PayoutBatch {
  id: string;
  generatedAt: string;
  incentiveIds: string[];
  totalAmount: number;
  agentCount: number;
}
