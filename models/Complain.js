import mongoose from 'mongoose';

const ComplainSchema = new mongoose.Schema({
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
  photo: {
    type: [String],
    default: 'https://via.placeholder.com/150',
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Complain = mongoose.model('complain', ComplainSchema);
export default Complain;
