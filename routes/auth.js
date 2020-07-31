import express from 'express';
import {
  login,
  register,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/auth';

import { protect } from '../middleware/auth';
import { upload } from '../middleware/multerS3';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put(
  '/updatedetails',
  protect,
  upload.single('profilePic'),
  updateDetails
);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
