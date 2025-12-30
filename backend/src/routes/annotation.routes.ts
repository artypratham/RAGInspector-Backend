import { Router } from 'express';
import {
  createAnnotation,
  getAnnotations,
  updateAnnotation,
  deleteAnnotation,
} from '../controllers/annotation.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createAnnotationSchema, updateAnnotationSchema } from '../types/validation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createAnnotationSchema), createAnnotation);
router.get('/', getAnnotations);
router.put('/:id', validate(updateAnnotationSchema), updateAnnotation);
router.delete('/:id', deleteAnnotation);

export default router;
