import express from 'express';
import Site from '../models/Site';
import { protect, authorize } from '../middleware/auth';
import {
  getAllSite,
  getSites,
  postSite,
  deleteSite,
  getCleanerSites,
} from '../controllers/site';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getAllSite)
  .post(protect, authorize('admin'), postSite);
router
  .route('/:id')
  .get(protect, getSites)
  .delete(protect, authorize('admin'), deleteSite);
router.route('/cleaner/:id').get(protect, getCleanerSites);

export default router;
