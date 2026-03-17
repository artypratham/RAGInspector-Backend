import { z } from 'zod';

const jsonString = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`).max(5_000_000, `${fieldName} exceeds max size`).refine(
    (val) => { try { JSON.parse(val); return true; } catch { return false; } },
    { message: `${fieldName} must be valid JSON` }
  );

const annotationCategory = z.enum(['hallucination', 'retrieval', 'extraction', 'formatting', 'other']);

// Auth schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password must be at most 72 characters'),
  name: z.string().max(200).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
  password: z.string().min(1, 'Password is required').max(72),
});

// Extraction schemas
export const createExtractionSchema = z.object({
  title: z.string().max(500).optional(),
  schemaInput: jsonString('Schema input'),
  outputJson: jsonString('Output JSON'),
});

export const updateExtractionSchema = z.object({
  title: z.string().max(500).optional(),
  schemaInput: jsonString('Schema input').optional(),
  outputJson: jsonString('Output JSON').optional(),
});

// Annotation schemas
export const annotationDataSchema = z.object({
  fieldName: z.string().min(1).max(500),
  recordId: z.string().min(1).max(200),
  status: z.enum(['correct', 'incorrect']),
  extractedValue: z.string().max(50_000).optional(),
  expectedValue: z.string().max(50_000).optional(),
  category: annotationCategory.optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export const submitExtractionSchema = z.object({
  title: z.string().max(500).optional(),
  schemaInput: jsonString('Schema input'),
  outputJson: jsonString('Output JSON'),
  annotations: z.array(annotationDataSchema).max(1000),
});

export const createAnnotationSchema = z.object({
  extractionId: z.string().min(1).max(200),
  fieldName: z.string().min(1).max(500),
  recordId: z.string().min(1).max(200),
  status: z.enum(['correct', 'incorrect']),
  extractedValue: z.string().max(50_000).optional(),
  expectedValue: z.string().max(50_000).optional(),
  category: annotationCategory.optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export const updateAnnotationSchema = z.object({
  status: z.enum(['correct', 'incorrect']).optional(),
  extractedValue: z.string().max(50_000).optional(),
  expectedValue: z.string().max(50_000).optional(),
  category: annotationCategory.optional(),
  confidence: z.number().min(0).max(1).optional(),
});

// Record schema
export const createRecordSchema = z.object({
  extractionId: z.string().min(1).max(200),
  recordId: z.string().min(1).max(200),
  docId: z.string().max(200).optional(),
  success: z.boolean(),
  recordData: z.string().max(5_000_000),
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
