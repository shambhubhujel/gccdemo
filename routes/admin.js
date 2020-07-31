import express from 'express';
import { advancedResults } from '../middleware/advancedResults';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/multerS3';
import User from '../models/User';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/admin';

const router = express.Router({ mergeParams: true });

router.use(protect);
// router.use(authorize('admin'));

router
  .route('/')
  .get(authorize('admin', 'supervisor'), advancedResults(User), getUsers)
  .post(authorize('admin'), upload.single('profilePic'), createUser);

router
  .route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

export default router;
