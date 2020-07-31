import mongoose from 'mongoose';

const VacancySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  jobType: {
    type: String,
    required: [true, 'Please select job type'],
  },
  date: {
    type: Date,
    required: [true, 'Please add date'],
  },
  description: {
    type: String,
    required: [true, 'Please add descriptions'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Vacancy = mongoose.model('vacancy', VacancySchema);
export default Vacancy;
