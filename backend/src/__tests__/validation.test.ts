import { describe, it, expect } from 'vitest';
import {
  signupSchema,
  loginSchema,
  createExtractionSchema,
  updateExtractionSchema,
  submitExtractionSchema,
  annotationDataSchema,
  createAnnotationSchema,
  updateAnnotationSchema,
  createRecordSchema,
} from '../types/validation';

describe('signupSchema', () => {
  it('accepts valid signup data', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'securepass',
      name: 'Test User',
    });
    expect(result.success).toBe(true);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password longer than 72 characters', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'a'.repeat(73),
    });
    expect(result.success).toBe(false);
  });

  it('accepts password of exactly 72 characters', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'a'.repeat(72),
    });
    expect(result.success).toBe(true);
  });

  it('rejects email longer than 254 characters', () => {
    const result = signupSchema.safeParse({
      email: 'a'.repeat(250) + '@b.co',
      password: 'securepass',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = signupSchema.safeParse({
      email: 'not-an-email',
      password: 'securepass',
    });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 200 characters', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'securepass',
      name: 'a'.repeat(201),
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'anypassword',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password longer than 72', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'a'.repeat(73),
    });
    expect(result.success).toBe(false);
  });
});

describe('createExtractionSchema', () => {
  it('accepts valid extraction data with valid JSON', () => {
    const result = createExtractionSchema.safeParse({
      title: 'Test Extraction',
      schemaInput: '{"type": "object"}',
      outputJson: '{"results": []}',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-JSON schemaInput', () => {
    const result = createExtractionSchema.safeParse({
      schemaInput: 'not valid json',
      outputJson: '{"results": []}',
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-JSON outputJson', () => {
    const result = createExtractionSchema.safeParse({
      schemaInput: '{"type": "object"}',
      outputJson: '{broken json',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty schemaInput', () => {
    const result = createExtractionSchema.safeParse({
      schemaInput: '',
      outputJson: '{}',
    });
    expect(result.success).toBe(false);
  });

  it('rejects title longer than 500 characters', () => {
    const result = createExtractionSchema.safeParse({
      title: 'a'.repeat(501),
      schemaInput: '{}',
      outputJson: '{}',
    });
    expect(result.success).toBe(false);
  });

  it('rejects schemaInput exceeding 5MB', () => {
    const result = createExtractionSchema.safeParse({
      schemaInput: '{"x":"' + 'a'.repeat(5_000_001) + '"}',
      outputJson: '{}',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateExtractionSchema', () => {
  it('accepts partial update with valid JSON', () => {
    const result = updateExtractionSchema.safeParse({
      title: 'Updated',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-JSON schemaInput when provided', () => {
    const result = updateExtractionSchema.safeParse({
      schemaInput: 'not json',
    });
    expect(result.success).toBe(false);
  });

  it('accepts empty object', () => {
    const result = updateExtractionSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('annotationDataSchema', () => {
  it('accepts valid annotation data', () => {
    const result = annotationDataSchema.safeParse({
      fieldName: 'company_name',
      recordId: 'rec-1',
      status: 'correct',
      confidence: 0.95,
      category: 'extraction',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = annotationDataSchema.safeParse({
      fieldName: 'test',
      recordId: 'rec-1',
      status: 'maybe',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const result = annotationDataSchema.safeParse({
      fieldName: 'test',
      recordId: 'rec-1',
      status: 'correct',
      category: 'not-a-valid-category',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid categories', () => {
    const categories = ['hallucination', 'retrieval', 'extraction', 'formatting', 'other'];
    for (const category of categories) {
      const result = annotationDataSchema.safeParse({
        fieldName: 'test',
        recordId: 'rec-1',
        status: 'correct',
        category,
      });
      expect(result.success).toBe(true);
    }
  });

  it('rejects negative confidence', () => {
    const result = annotationDataSchema.safeParse({
      fieldName: 'test',
      recordId: 'rec-1',
      status: 'correct',
      confidence: -0.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects confidence greater than 1', () => {
    const result = annotationDataSchema.safeParse({
      fieldName: 'test',
      recordId: 'rec-1',
      status: 'correct',
      confidence: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('accepts confidence at boundaries (0 and 1)', () => {
    expect(annotationDataSchema.safeParse({
      fieldName: 'test', recordId: 'r', status: 'correct', confidence: 0,
    }).success).toBe(true);
    expect(annotationDataSchema.safeParse({
      fieldName: 'test', recordId: 'r', status: 'correct', confidence: 1,
    }).success).toBe(true);
  });

  it('rejects empty fieldName', () => {
    const result = annotationDataSchema.safeParse({
      fieldName: '',
      recordId: 'rec-1',
      status: 'correct',
    });
    expect(result.success).toBe(false);
  });

  it('rejects fieldName longer than 500', () => {
    const result = annotationDataSchema.safeParse({
      fieldName: 'a'.repeat(501),
      recordId: 'rec-1',
      status: 'correct',
    });
    expect(result.success).toBe(false);
  });

  it('rejects extractedValue longer than 50000', () => {
    const result = annotationDataSchema.safeParse({
      fieldName: 'test',
      recordId: 'rec-1',
      status: 'correct',
      extractedValue: 'a'.repeat(50001),
    });
    expect(result.success).toBe(false);
  });
});

describe('submitExtractionSchema', () => {
  it('accepts valid submission with annotations', () => {
    const result = submitExtractionSchema.safeParse({
      schemaInput: '{"type": "object"}',
      outputJson: '{"data": []}',
      annotations: [
        { fieldName: 'f1', recordId: 'r1', status: 'correct' },
        { fieldName: 'f2', recordId: 'r2', status: 'incorrect', category: 'hallucination' },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects more than 1000 annotations', () => {
    const annotations = Array.from({ length: 1001 }, (_, i) => ({
      fieldName: `field_${i}`,
      recordId: `rec_${i}`,
      status: 'correct' as const,
    }));
    const result = submitExtractionSchema.safeParse({
      schemaInput: '{}',
      outputJson: '{}',
      annotations,
    });
    expect(result.success).toBe(false);
  });

  it('accepts exactly 1000 annotations', () => {
    const annotations = Array.from({ length: 1000 }, (_, i) => ({
      fieldName: `field_${i}`,
      recordId: `rec_${i}`,
      status: 'correct' as const,
    }));
    const result = submitExtractionSchema.safeParse({
      schemaInput: '{}',
      outputJson: '{}',
      annotations,
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty annotations array', () => {
    const result = submitExtractionSchema.safeParse({
      schemaInput: '{}',
      outputJson: '{}',
      annotations: [],
    });
    expect(result.success).toBe(true);
  });
});

describe('createAnnotationSchema', () => {
  it('accepts valid create annotation data', () => {
    const result = createAnnotationSchema.safeParse({
      extractionId: 'ext-123',
      fieldName: 'company_name',
      recordId: 'rec-1',
      status: 'incorrect',
      category: 'hallucination',
      confidence: 0.3,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty extractionId', () => {
    const result = createAnnotationSchema.safeParse({
      extractionId: '',
      fieldName: 'test',
      recordId: 'rec-1',
      status: 'correct',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateAnnotationSchema', () => {
  it('accepts partial update', () => {
    const result = updateAnnotationSchema.safeParse({
      status: 'incorrect',
      category: 'retrieval',
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty object', () => {
    const result = updateAnnotationSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejects invalid confidence in update', () => {
    const result = updateAnnotationSchema.safeParse({
      confidence: 999,
    });
    expect(result.success).toBe(false);
  });
});

describe('createRecordSchema', () => {
  it('accepts valid record data', () => {
    const result = createRecordSchema.safeParse({
      extractionId: 'ext-1',
      recordId: 'rec-1',
      success: true,
      recordData: '{"key": "value"}',
    });
    expect(result.success).toBe(true);
  });

  it('rejects recordData exceeding 5MB', () => {
    const result = createRecordSchema.safeParse({
      extractionId: 'ext-1',
      recordId: 'rec-1',
      success: true,
      recordData: 'a'.repeat(5_000_001),
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty extractionId', () => {
    const result = createRecordSchema.safeParse({
      extractionId: '',
      recordId: 'rec-1',
      success: true,
      recordData: 'data',
    });
    expect(result.success).toBe(false);
  });
});
