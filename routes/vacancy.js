import express from 'express';
import Vacancy from '../models/Vacancy';
import { advancedResults } from '../middleware/advancedResults';
import {
  getVacancies,
  getVacancy,
  postVacancy,
  deleteVacancy,
  updateVacancy,
} from '../controllers/vacancy';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();
router
  .route('/')
  .get(advancedResults(Vacancy), getVacancies)
  .post(protect, authorize('admin'), postVacancy);
router
  .route('/:id')
  .get(getVacancy)
  .put(protect, authorize('admin'), updateVacancy)
  .delete(protect, authorize('admin'), deleteVacancy);

export default router;
