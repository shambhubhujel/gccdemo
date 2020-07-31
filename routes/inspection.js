import express from 'express';
import Inspection from '../models/Inspection';
import { upload } from '../middleware/multerS3';
import {
  getInspection,
  postInspection,
  updateInspection,
  deleteInspection,
} from '../controllers/inspection';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();
router
  .route('/')
  .post(
    protect,
    authorize('admin', 'supervisor'),
    upload.array('inspection_image', process.env.MAX_FILE_COUNT * 2),
    postInspection
  );

router
  .route('/:id')
  .get(protect, authorize('admin', 'supervisor'), getInspection)
  .put(protect, authorize('admin', 'supervisor'), updateInspection)
  .delete(protect, authorize('admin', 'supervisor'), deleteInspection);

export default router;
