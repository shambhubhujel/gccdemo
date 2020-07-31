import Applicant from '../models/Applicant';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import sendEmail from '../utils/sendEmail';

// @desc Get Applicant
// @route GET /api/v1/applicant
// Public
export const getApplicants = asyncHandler(async (req, res, next) => {
  // Return all Vancacies
  res.status(200).json(res.advancedResults);
});

// @desc Post Applicant
// @route POST /api/v1/applicant
// Private
export const addApplicant = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse(`Please upload your CV`, 400));
  }

  req.body.cv = req.file.location;
  const applicant = await Applicant.create(req.body);

  // Automatic message reply
  const message = `Hi ${req.body.name}, We have received your application and will get back to you soon.

  We wish you luck 👍
  `;
  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Job Application',
      message,
    });

    res.status(201).json({
      success: true,
      data: applicant,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc      Delete Applicant
// @route     DELETE /api/v1/applicant/:id
// @access    Private
export const deleteApplicant = asyncHandler(async (req, res, next) => {
  console.log('ID:', req.params.id);
  const applicant = await Applicant.findById(req.params.id);

  if (!applicant) {
    return next(new ErrorResponse(`Work ${req.params.id} not found`, 404));
  }

  // Make sure only admin can delete Applicant
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this work`,
        404
      )
    );
  }
  await applicant.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
