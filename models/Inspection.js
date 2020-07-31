import mongoose from 'mongoose';

const InspectionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add a email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  attachment: {
    type: [String],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Inspection = mongoose.model('inspection', InspectionSchema);
export default Inspection;
