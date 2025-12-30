import { Router } from 'express';
import {
  createExtraction,
  getExtractions,
  getExtraction,
  updateExtraction,
  deleteExtraction,
  submitExtraction,
} from '../controllers/extraction.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createExtractionSchema, updateExtractionSchema, submitExtractionSchema } from '../types/validation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createExtractionSchema), createExtraction);
router.post('/submit', validate(submitExtractionSchema), submitExtraction);
router.get('/', getExtractions);
router.get('/:id', getExtraction);
router.put('/:id', validate(updateExtractionSchema), updateExtraction);
router.delete('/:id', deleteExtraction);

export default router;
