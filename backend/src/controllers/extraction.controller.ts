import { Response } from 'express';
import prisma from '../config/database';
import { CreateExtractionInput, UpdateExtractionInput, SubmitExtractionInput } from '../types/validation';
import { AuthRequest } from '../middleware/auth';

export async function createExtraction(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { title, schemaInput, outputJson } = req.body as CreateExtractionInput;

    const extraction = await prisma.extraction.create({
      data: {
        userId,
        title: title || `Extraction ${new Date().toLocaleDateString()}`,
        schemaInput,
        outputJson,
      },
      include: {
        annotations: true,
        records: true,
      },
    });

    res.status(201).json({
      message: 'Extraction created successfully',
      extraction,
    });
  } catch (error) {
    console.error('Create extraction error:', error);
    res.status(500).json({ error: 'Failed to create extraction' });
  }
}

export async function getExtractions(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { limit = '20', offset = '0' } = req.query;

    const extractions = await prisma.extraction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      include: {
        annotations: {
          select: {
            id: true,
            fieldName: true,
            createdAt: true,
          },
        },
        records: {
          select: {
            id: true,
            recordId: true,
            success: true,
          },
        },
      },
    });

    const total = await prisma.extraction.count({ where: { userId } });

    res.status(200).json({
      extractions,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('Get extractions error:', error);
    res.status(500).json({ error: 'Failed to fetch extractions' });
  }
}

export async function getExtraction(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const extraction = await prisma.extraction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        annotations: {
          orderBy: { createdAt: 'desc' },
        },
        records: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!extraction) {
      res.status(404).json({ error: 'Extraction not found' });
      return;
    }

    res.status(200).json({ extraction });
  } catch (error) {
    console.error('Get extraction error:', error);
    res.status(500).json({ error: 'Failed to fetch extraction' });
  }
}

export async function updateExtraction(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updateData = req.body as UpdateExtractionInput;

    const existing = await prisma.extraction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Extraction not found' });
      return;
    }

    const extraction = await prisma.extraction.update({
      where: { id },
      data: updateData,
      include: {
        annotations: true,
        records: true,
      },
    });

    res.status(200).json({
      message: 'Extraction updated successfully',
      extraction,
    });
  } catch (error) {
    console.error('Update extraction error:', error);
    res.status(500).json({ error: 'Failed to update extraction' });
  }
}

export async function deleteExtraction(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const existing = await prisma.extraction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Extraction not found' });
      return;
    }

    await prisma.extraction.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Extraction deleted successfully' });
  } catch (error) {
    console.error('Delete extraction error:', error);
    res.status(500).json({ error: 'Failed to delete extraction' });
  }
}

export async function submitExtraction(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { title, schemaInput, outputJson, annotations } = req.body as SubmitExtractionInput;

    // Create extraction with submitted timestamp and annotations in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const extraction = await tx.extraction.create({
        data: {
          userId,
          title: title || `Extraction ${new Date().toLocaleDateString()}`,
          schemaInput,
          outputJson,
          submittedAt: new Date(),
        },
      });

      // Create all annotations
      if (annotations && annotations.length > 0) {
        await tx.annotation.createMany({
          data: annotations.map(ann => ({
            extractionId: extraction.id,
            fieldName: ann.fieldName,
            recordId: ann.recordId,
            status: ann.status,
            extractedValue: ann.extractedValue,
            expectedValue: ann.expectedValue,
            category: ann.category,
            confidence: ann.confidence,
          })),
        });
      }

      // Return extraction with annotations
      return await tx.extraction.findUnique({
        where: { id: extraction.id },
        include: {
          annotations: true,
        },
      });
    });

    res.status(201).json({
      message: 'Extraction submitted successfully',
      extraction: result,
    });
  } catch (error) {
    console.error('Submit extraction error:', error);
    res.status(500).json({ error: 'Failed to submit extraction' });
  }
}
