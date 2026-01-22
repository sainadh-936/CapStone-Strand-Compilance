import { z } from 'zod';

// Session creation schema
export const createSessionSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s]+$/, 'Invalid phone number format'),
  age: z.number().min(0).max(150).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  city: z.string().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

// Form field schema
export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'number', 'dropdown', 'date']),
  label: z.string().min(1, 'Label is required'),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
});

export const formSchemaValidator = z.object({
  documentType: z.enum(['trf', 'prescription', 'histopathology', 'form_g']),
  fields: z.array(formFieldSchema),
});
