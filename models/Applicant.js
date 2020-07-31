import mongoose from 'mongoose';

const ApplicantSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  gender: {
    type: String,
    required: [true, 'Please select a gender'],
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add a email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  qualification: {
    type: String,
    required: [true, 'Please add qualification'],
  },
  institution: {
    type: String,
    required: [true, 'Please add institution'],
  },
  dob: {
    type: Date,
    required: [true, 'Please add your DOB'],
  },
  nationality: {
    type: String,
    required: [true, 'Please add nationality'],
  },
  address1: {
    type: String,
    required: [true, 'Please add address-1'],
  },
  address2: {
    type: String,
  },
  country: {
    type: String,
    required: [true, 'Please add country'],
  },
  state: {
    type: String,
    required: [true, 'Please add state'],
  },
  city: {
    type: String,
    required: [true, 'Please add city'],
  },
  zipCode: {
    type: String,
    required: [true, 'Please add zip code'],
  },
  cv: {
    type: String,
    required: [true, 'Please add CV'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Applicant = mongoose.model('applicant', ApplicantSchema);
export default Applicant;
