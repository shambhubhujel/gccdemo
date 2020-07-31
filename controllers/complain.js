import Complain from '../models/Complain';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import sendEmail from '../utils/sendEmail';

// @desc Get Complain
// @route GET /api/v1/complain
// Private
export const getComplains = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Post Complain
// @route POST /api/v1/complain
// Public
export const postComplain = asyncHandler(async (req, res, next) => {
  // check if files exists
  if (!req.files) {
    return next(new ErrorResponse('Please provide an image of proof', 400));
  }

  const fileArray = req.files;
  const fileLocation = fileArray.map((file) => file.location);

  req.body.user = req.user.id;
  req.body.photo = fileLocation;

  // Add complain
  const complain = await Complain.create(req.body);

  // Complain email message
  const message = `Hi ${req.body.name}, your complain has been recieved, we will get back to you soon .
Thank you.`;

  // Send email to client
  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Complain',
      message,
    });

    res.status(200).json({
      success: true,
      data: {
        success: true,
        complain,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc Delete Complain
// @route DELETE /api/v1/complain/:id
// Private
export const deleteComplain = asyncHandler(async (req, res, next) => {
  console.log('ID:', req.params.id);
  const complain = await Complain.findById(req.params.id);

  if (!complain) {
    return next(new ErrorResponse(`Complain ${req.params.id} not found`, 404));
  }

  // Make sure only admin can delete complains
  if (req.user.role != 'admin') {
    return next(
      new ErrorResponse(`User not authorized to delete this complain`, 404)
    );
  }

  await complain.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
