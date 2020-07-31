import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add you fullname'],
  },
  email: {
    type: String,
    required: [true, 'Please add a email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number less than 10 digit'],
    maxlength: 11,
  },
  subject: String,
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quote = mongoose.model('quote', QuoteSchema);
export default Quote;
