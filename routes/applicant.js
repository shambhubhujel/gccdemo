import express from 'express';
import Applicant from '../models/Applicant';
import { advancedResults } from '../middleware/advancedResults';
import { upload } from '../middleware/multerS3';
import {
  getApplicants,
  addApplicant,
  deleteApplicant,
} from '../controllers/applicant';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();
router
  .route('/')
  .get(protect, authorize('admin'), advancedResults(Applicant), getApplicants)
  .post(upload.single('cv_image', process.env.MAX_FILE_COUNT), addApplicant);
router.route('/:id').delete(protect, authorize('admin'), deleteApplicant);

export default router;
