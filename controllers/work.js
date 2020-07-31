import Work from '../models/Work';
import User from '../models/User';
import Site from '../models/Site';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import GeoCoder from '../utils/geocoder';

// @desc Get Work
// @route GET /api/v1/work
// Private
export const getWorks = asyncHandler(async (req, res, next) => {
  // Return all Works
  res.status(200).json(res.advancedResults);
});

// @desc Get Own Work or All if Admin
// @route GET /api/v1/work/:id
// Private
export const getOwnWorks = asyncHandler(async (req, res, next) => {
  let work;

  // check id if it belongs to admin
  const { role } = await User.findById(req.params.id);
  if (role == 'admin' || role == 'supervisor') {
    work = await Work.find();
  } else {
    work = await Work.find({ user: req.params.id });
  }

  res.status(200).json({
    success: true,
    data: work,
  });
});

// @desc Get Location
// @route GET /api/v1/work/:lat/:lon
// Private
export const getLocation = asyncHandler(async (req, res, next) => {
  const { lat, lon } = req.params;
  const loc = await GeoCoder.reverse({ lat, lon });

  res.status(200).json({
    success: true,
    data: loc,
  });
});

// @desc Post Work
// @route POST /api/v1/work
// Private
export const postWork = asyncHandler(async (req, res, next) => {
  // check if files exists
  if (req.files) {
    const fileArray = req.files;
    const fileLocation = fileArray.map((file) => file.location);
    req.body.photo = fileLocation;
  }
  req.body.user = req.user.id;
  req.body.name = req.user.name;

  // Add work
  const work = await Work.create(req.body);

  // Update site
  await Site.findByIdAndUpdate(
    req.body.id,
    { done: true },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: {
      success: true,
      work,
    },
  });
});

// @desc Update work
// @route PUT /api/v1/work/:id
// Private
export const updateWork = asyncHandler(async (req, res, next) => {
  // check if files exists
  if (req.files) {
    const fileArray = req.files;
    const fileLocation = fileArray.map((file) => file.location);
    req.body.photo = fileLocation;
  }
  let work = await Work.findById(req.params.id);

  if (!work) {
    return next(
      new ErrorResponse(`No work with the id of ${req.params.id}`),
      404
    );
  }

  work = await Work.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: work,
  });
});

// @desc      Delete work
// @route     DELETE /api/v1/work/:id
// @access    Private
export const deleteWork = asyncHandler(async (req, res, next) => {
  const work = await Work.findById(req.params.id);

  if (!work) {
    return next(new ErrorResponse(`Work ${req.params.id} not found`, 404));
  }

  // Make sure only admin or owner can delete work
  if (work.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this work`,
        404
      )
    );
  }

  await work.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
