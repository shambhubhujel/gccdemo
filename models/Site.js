import mongoose from 'mongoose';

const SiteScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: String,
  workSite: {
    type: String,
    required: [true, 'Please add work site'],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  detail: {
    type: String,
    required: [true, 'Please details of worksite'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add user'],
  },
  time: {
    type: String,
    required: [true, 'Please add time'],
  },
  date: {
    type: Date,
    required: [true, 'Please add work date'],
  },
  cleanerName: {
    type: String,
    required: [true, `Please add cleaner's name`],
  },
  cleanerID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add cleaner'],
  },
  done: {
    type: Boolean,
    default: false,
  },
});

const Site = mongoose.model('site', SiteScheme);
export default Site;
