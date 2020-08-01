import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import colors from 'colors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Route files
import auth from './routes/auth';
import admin from './routes/admin';
import reviews from './routes/review';
import quote from './routes/quote';
import complain from './routes/complain';
import work from './routes/work';
import vacancy from './routes/vacancy';
import applicant from './routes/applicant';
import inspection from './routes/inspection';
import site from './routes/site';

import errorHandler from './middleware/error';
import ConnectDB from './db';
// Connect to database
ConnectDB();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.static('public'));
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// Morgan logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sanitize Data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Enable CORS //"test": "mocha --recursive tests --exit"
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 100, // 10 minutes
  max: 100, // limit each IP to 100 request per windowMS
});
app.use(limiter);

// Mount router
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin', admin);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/quote', quote);
app.use('/api/v1/complain', complain);
app.use('/api/v1/work', work);
app.use('/api/v1/vacancy', vacancy);
app.use('/api/v1/applicant', applicant);
app.use('/api/v1/inspection', inspection);
app.use('/api/v1/site', site);

// Error Handling
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `\tServer running in ${process.env.NODE_ENV} mode on port: ${PORT}`
      .brightGreen.underline
  )
);

// Handle rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.brightRed.underline);
  // Close server & exit process
  server.close(() => process.exit(1));
});

