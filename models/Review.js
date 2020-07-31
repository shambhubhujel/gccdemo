import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add you fullname'],
  },
  email: {
    type: String,
    required: [true, 'Please add a email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  company: String,
  photo: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  publish: {
    type: Boolean,
    default: false,
  },
});

const Review = mongoose.model('review', ReviewSchema);
export default Review;
