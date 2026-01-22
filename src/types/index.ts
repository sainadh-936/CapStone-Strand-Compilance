// Core type definitions for the Strand Logistics system

export type SessionStatus = 
  | 'created' 
  | 'link_generated' 
  | 'in_progress' 
  | 'submitted' 
  | 'incomplete';

export type DocumentType = 
  | 'trf' 
  | 'prescription' 
  | 'histopathology' 
  | 'form_g';

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'dropdown' 
  | 'date';

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
  gender?: 'male' | 'female' | 'other';
  city?: string;
  status: SessionStatus;
  requiredDocuments: DocumentType[];
  formSchemas: Partial<Record<DocumentType, FormSchema>>;
  submissions: DocumentSubmission[];
  createdAt: string;
  linkGeneratedAt?: string;
}
