import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 4,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number less than 10 digit'],
    maxlength: 11,
  },
  address: String,
  age: String,
  role: {
    type: String,
    enum: ['admin', 'supervisor', 'client', 'cleaner'],
    default: 'client',
    required: [true, 'Please select a role'],
  },
  office: String,
  position: String,
  photo: {
    type: String,
  },
  startDate: Date,
  subject: String,
  message: String,
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password with bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function getSignedJwtToken() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function matchPassword(
  enteredPassword
) {
  {
    return await bcrypt.compare(enteredPassword, this.password);
  }
};

// Generate and hash password token
UserSchema.methods.getResetPassworkdToken = function getResetPassworkdToken() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire to 10 mins
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('user', UserSchema);
export default User;
