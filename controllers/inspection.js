import User from '../models/User';
import Inspection from '../models/Inspection';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';

// @desc Get All Inspecion
// @route GET /api/v1/inspection
// Private
// export const getAllInspection = asyncHandler(async (req, res, next) => {
//   const inspection = await Inspection.find();

//   res.status(200).json({
//     success: true,
//     data: inspection,
//   });
// });

// @desc Get Inspecion by ID
// @route GET /api/v1/inspection/:id
// Private
export const getInspection = asyncHandler(async (req, res, next) => {
  let inspection;
  // check if ID is 'Admin'
  const user = await User.findById(req.params.id);
  if (user.role == 'admin') {
    inspection = await Inspection.find();
  } else {
    inspection = await Inspection.find({ user: req.params.id });
  }

  res.status(200).json({
    success: true,
    data: inspection,
  });
});

// @desc post Inspecion
// @route POST /api/v1/inspection/
// Private
export const postInspection = asyncHandler(async (req, res, next) => {
  // check if file exists
  console.log(req.files);
  if (req.files) {
    const fileArray = req.files;
    const fileLocation = fileArray.map((file) => file.location);
    req.body.attachment = fileLocation;
  }

  req.body.user = req.user.id;

  // Add inspection
  const inspection = await Inspection.create(req.body);

  res.status(200).json({
    success: true,
    data: inspection,
  });
});

// @desc Update inspection
// @route PUT /api/v1/inspection/:id
// Private
export const updateInspection = asyncHandler(async (req, res, next) => {
  let inspection = await Inspection.findById(req.params.id);

  if (!inspection) {
    return next(
      new ErrorResponse(`No inspection with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure inspection to be updated belongs to the supervisor or admin
  if (inspection.user.toString() != req.user.id && req.user.role != 'admin') {
    return next(new ErrorResponse(`Not authorise to update inspection`), 401);
  }

  inspection = await Inspection.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: inspection,
  });
});

// @desc  Delete a inspection
// @route DELETE /api/v1/inspection/:id
// @access Private
export const deleteInspection = async (req, res, next) => {
  const inspection = await Inspection.findById(req.params.id);
  console.log(inspection);

  if (!inspection) {
    return next(
      new ErrorResponse(`No inspection with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure inspection to be updated belongs to the client or is admin
  if (inspection.user.toString() != req.user.id && req.user.role != 'admin') {
    return next(
      new ErrorResponse(`Not authorise to delete this inspection`),
      401
    );
  }
  inspection.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
};
