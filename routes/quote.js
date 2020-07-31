import express from 'express';
import { getQuote } from '../controllers/quote';

const router = express.Router();
router.route('/').post(getQuote);
export default router;
