import { Response } from 'express';
import prisma from '../config/database';
import { CreateAnnotationInput, UpdateAnnotationInput } from '../types/validation';
import { AuthRequest } from '../middleware/auth';

export async function createAnnotation(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const annotationData = req.body as CreateAnnotationInput;

    const extraction = await prisma.extraction.findFirst({
      where: {
        id: annotationData.extractionId,
        userId,
      },
    });

    if (!extraction) {
      res.status(404).json({ error: 'Extraction not found' });
      return;
    }

    const annotation = await prisma.annotation.create({
      data: annotationData,
    });

    res.status(201).json({
      message: 'Annotation created successfully',
      annotation,
    });
  } catch (error) {
    console.error('Create annotation error:', error);
    res.status(500).json({ error: 'Failed to create annotation' });
  }
}

export async function getAnnotations(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { extractionId } = req.query;

    if (!extractionId) {
      res.status(400).json({ error: 'extractionId is required' });
      return;
    }

    const extraction = await prisma.extraction.findFirst({
      where: {
        id: extractionId as string,
        userId,
      },
    });

    if (!extraction) {
      res.status(404).json({ error: 'Extraction not found' });
      return;
    }

    const annotations = await prisma.annotation.findMany({
      where: { extractionId: extractionId as string },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ annotations });
  } catch (error) {
    console.error('Get annotations error:', error);
    res.status(500).json({ error: 'Failed to fetch annotations' });
  }
}

export async function updateAnnotation(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updateData = req.body as UpdateAnnotationInput;

    const existing = await prisma.annotation.findFirst({
      where: { id },
      include: { extraction: true },
    });

    if (!existing || existing.extraction.userId !== userId) {
      res.status(404).json({ error: 'Annotation not found' });
      return;
    }

    const annotation = await prisma.annotation.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      message: 'Annotation updated successfully',
      annotation,
    });
  } catch (error) {
    console.error('Update annotation error:', error);
    res.status(500).json({ error: 'Failed to update annotation' });
  }
}

export async function deleteAnnotation(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const existing = await prisma.annotation.findFirst({
      where: { id },
      include: { extraction: true },
    });

    if (!existing || existing.extraction.userId !== userId) {
      res.status(404).json({ error: 'Annotation not found' });
      return;
    }

    await prisma.annotation.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Annotation deleted successfully' });
  } catch (error) {
    console.error('Delete annotation error:', error);
    res.status(500).json({ error: 'Failed to delete annotation' });
  }
}
