import type { DocumentType } from '@/types';

export interface DocumentTypeInfo {
  id: DocumentType;
  name: string;
  description: string;
  icon: string;
}

export const DOCUMENT_TYPES: DocumentTypeInfo[] = [
  {
    id: 'trf',
    name: 'Test Request Form (TRF)',
    description: 'Standard test request form from the referring physician',
    icon: '📋',
  },
  {
    id: 'prescription',
    name: 'Doctor Prescription',
    description: 'Prescription document from the treating doctor',
    icon: '💊',
  },
  {
    id: 'histopathology',
    name: 'Histopathology / Tumor Report',
    description: 'Previous pathology or tumor evaluation reports',
    icon: '🔬',
  },
  {
    id: 'form_g',
    name: 'Form G',
    description: 'Required for NIPT and Rare Disease tests',
    icon: '📝',
  },
];

export function getDocumentTypeInfo(id: DocumentType): DocumentTypeInfo | undefined {
  return DOCUMENT_TYPES.find(d => d.id === id);
}
