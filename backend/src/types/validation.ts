import { z } from 'zod';

// Auth schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Extraction schemas
export const createExtractionSchema = z.object({
  title: z.string().optional(),
  schemaInput: z.string().min(1, 'Schema input is required'),
  outputJson: z.string().min(1, 'Output JSON is required'),
});

export const updateExtractionSchema = z.object({
  title: z.string().optional(),
  schemaInput: z.string().optional(),
  outputJson: z.string().optional(),
});

// Annotation schemas
export const annotationDataSchema = z.object({
  fieldName: z.string(),
  recordId: z.string(),
  status: z.enum(['correct', 'incorrect']),
  extractedValue: z.string().optional(),
  expectedValue: z.string().optional(),
  category: z.string().optional(),
  confidence: z.number().optional(),
});

export const submitExtractionSchema = z.object({
  title: z.string().optional(),
  schemaInput: z.string().min(1, 'Schema input is required'),
  outputJson: z.string().min(1, 'Output JSON is required'),
  annotations: z.array(annotationDataSchema),
});

export const createAnnotationSchema = z.object({
  extractionId: z.string(),
  fieldName: z.string(),
  recordId: z.string(),
  status: z.enum(['correct', 'incorrect']),
  extractedValue: z.string().optional(),
  expectedValue: z.string().optional(),
  category: z.string().optional(),
  confidence: z.number().optional(),
});

export const updateAnnotationSchema = z.object({
  status: z.enum(['correct', 'incorrect']).optional(),
  extractedValue: z.string().optional(),
  expectedValue: z.string().optional(),
  category: z.string().optional(),
  confidence: z.number().optional(),
});

// Record schema
export const createRecordSchema = z.object({
  extractionId: z.string(),
  recordId: z.string(),
  docId: z.string().optional(),
  success: z.boolean(),
  recordData: z.string(),
});

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateExtractionInput = z.infer<typeof createExtractionSchema>;
export type UpdateExtractionInput = z.infer<typeof updateExtractionSchema>;
export type SubmitExtractionInput = z.infer<typeof submitExtractionSchema>;
export type AnnotationData = z.infer<typeof annotationDataSchema>;
export type CreateAnnotationInput = z.infer<typeof createAnnotationSchema>;
export type UpdateAnnotationInput = z.infer<typeof updateAnnotationSchema>;
export type CreateRecordInput = z.infer<typeof createRecordSchema>;
