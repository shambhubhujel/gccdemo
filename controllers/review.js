import Review from '../models/Review';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';

// @desc Get Reviews
// @route GET /api/v1/reviews
// Public
export const getReviews = asyncHandler(async (req, res, next) => {
  // Return review if publish is true
  const review = await Review.find({ publish: true });

  res.status(200).json({
    success: true,
    data: review,
  });
});
// @desc Get All Reviews
// @route GET /api/v1/allreviews
// Private
export const getAllReviews = asyncHandler(async (req, res, next) => {
  // Return all review if publish is true or false
  res.status(200).json(res.advancedResults);
});

// @desc Add Review
// @route POST /api/v1/reviews
// Private
export const addReview = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  req.body.user = req.user.id;
  req.body.photo = req.file.location;
  const review = await Review.create(req.body);
  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc Update Review
// @route PUT /api/v1/reviews/:id
// Private
export const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure review to be updated belongs to the client or is admin
  if (review.user.toString() != req.user.id && req.user.role != 'admin') {
    return next(new ErrorResponse(`Not authorise to update review`), 401);
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc  Delete a review
// @route DELETE /api/v1/reviews/:id
// @access Private
export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure review to be updated belongs to the client or is admin
  if (review.user.toString() != req.user.id && req.user.role != 'admin') {
    return next(new ErrorResponse(`Not authorise to delete this review`), 401);
  }
  review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
