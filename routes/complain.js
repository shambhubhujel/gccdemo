import express from 'express';
import Complain from '../models/Complain';
import { advancedResults } from '../middleware/advancedResults';
import { upload } from '../middleware/multerS3';
import {
  getComplains,
  postComplain,
  deleteComplain,
} from '../controllers/complain';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();
router
  .route('/')
  .get(protect, authorize('admin'), advancedResults(Complain), getComplains)
  .post(
    protect,
    authorize('client', 'admin'),
    upload.array('complain_image', process.env.MAX_FILE_COUNT),
    postComplain
  );
router.route('/:id').delete(protect, authorize('admin'), deleteComplain);

export default router;
