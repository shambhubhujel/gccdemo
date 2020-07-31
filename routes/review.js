import express from 'express';
import { advancedResults } from '../middleware/advancedResults';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/multerS3';
import Review from '../models/Review';
import {
  getReviews,
  getAllReviews,
  addReview,
  updateReview,
  deleteReview,
} from '../controllers/review';

const router = express.Router({ mergeParams: true });
router
  .route('/')

  .get(advancedResults(Review), getReviews)

  .post(
    protect,
    authorize('client', 'admin'),
    upload.single('photo'),
    addReview
  );
router
  .route('/allreviews')
  .get(protect, authorize('admin'), advancedResults(Review), getAllReviews);
router
  .route('/:id')
  .patch(protect, authorize('client', 'admin'), updateReview)
  .delete(protect, authorize('client', 'admin'), deleteReview);

export default router;
