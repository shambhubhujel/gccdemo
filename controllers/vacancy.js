import Vacancy from '../models/Vacancy';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';

// @desc Get Vacancy
// @route GET /api/v1/vacancy
// Public
export const getVacancies = asyncHandler(async (req, res, next) => {
  // Return all Vancacies
  res.status(200).json(res.advancedResults);
});

// @desc Get Single Vacancy
// @route GET /api/v1/vacancy/:id
// Public
export const getVacancy = asyncHandler(async (req, res, next) => {
  // Return Single Vacancy
  const vacancy = await Vacancy.findById(req.params.id);

  if (!vacancy) {
    return next(
      new ErrorResponse(`Vacancy with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {
      success: true,
      vacancy,
    },
  });
});

// @desc Post Vacancy
// @route POST /api/v1/vacancy
// Private
export const postVacancy = asyncHandler(async (req, res, next) => {
  // Add vacancy
  const vacancy = await Vacancy.create(req.body);

  res.status(200).json({
    success: true,
    data: {
      success: true,
      vacancy,
    },
  });
});

// @desc Update Vacancy
// @route PUT /api/v1/vacancys/:id
// Private
export const updateVacancy = asyncHandler(async (req, res, next) => {
  let vacancy = await Vacancy.findById(req.params.id);

  if (!vacancy) {
    return next(
      new ErrorResponse(`No vacancy with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure vacancy to be updated belongs to the admin
  if (req.user.role != 'admin') {
    return next(new ErrorResponse(`Not authorise to update vacancy`), 401);
  }

  vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: vacancy,
  });
});

// @desc      Delete Vacancy
// @route     DELETE /api/v1/vacancy/:id
// @access    Private
export const deleteVacancy = asyncHandler(async (req, res, next) => {
  console.log('ID:', req.params.id);
  const vacancy = await Vacancy.findById(req.params.id);

  if (!vacancy) {
    return next(new ErrorResponse(`Work ${req.params.id} not found`, 404));
  }

  // Make sure only admin can delete vacancy
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this work`,
        404
      )
    );
  }
  await vacancy.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
