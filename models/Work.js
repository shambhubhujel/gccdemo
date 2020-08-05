import mongoose from 'mongoose';

const WorkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  photo: {
    type: [String],
    default: 'https://via.placeholder.com/150',
  },
  workDate: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add user'],
  },
  phone: String,
  subject: String,
  message: String,
  finishedAt: Date,
  finishedAddress: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Work = mongoose.model('work', WorkSchema);
export default Work;
