import express from 'express';
import rateLimit from 'express-rate-limit';
import Work from '../models/Work';
import { advancedResults } from '../middleware/advancedResults';
import { upload } from '../middleware/multerS3';
import {
  getWorks,
  getLocation,
  postWork,
  updateWork,
  deleteWork,
  getOwnWorks,
} from '../controllers/work';
import { protect, authorize } from '../middleware/auth';

const windowMs = 1 * 60 * 1000; // Every min 5 request max
const max = 5;
const message = {
  success: false,
  message: `Please try again after ${windowMs / 60000} min.`,
};

const apiLimiter = rateLimit({
  windowMs,
  max,
  message,
});

const router = express.Router();
router
  .route('/')
  .get(protect, advancedResults(Work), getWorks)
  .post(
    protect,
    authorize('cleaner', 'admin'),
    upload.array('work_image', process.env.MAX_FILE_COUNT),
    postWork
  );
router
  .route('/:id')
  .get(protect, getOwnWorks)
  .put(
    protect,
    authorize('cleaner', 'admin'),
    upload.array('work_image'),
    updateWork
  )
  .delete(protect, deleteWork);
router.route('/:lat/:lon').get(protect, apiLimiter, getLocation);

export default router;
