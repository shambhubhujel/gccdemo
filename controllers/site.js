import Site from '../models/Site';
import User from '../models/User';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import Work from '../models/Work';
import GeoCoder from '../utils/geocoder';

// @desc Get Sites
// @route GET /api/v1/site
// Private Admin
export const getAllSite = asyncHandler(async (req, res, next) => {
  // return all sites
  const site = await Site.find();

  res.status(200).json({
    success: true,
    data: site,
  });
});

// @desc Get Own Sites
// @route GET /api/v1/site/:id
// Private
export const getSites = asyncHandler(async (req, res, next) => {
  const site = await Site.find({ user: req.params.id });

  res.status(200).json({
    success: true,
    data: site,
  });
});

// @desc Get Cleaner's Own Sites
// @route GET /api/v1/site/cleaner/:id
// Private
export const getCleanerSites = asyncHandler(async (req, res, next) => {
  const site = await Site.find({ cleanerID: req.params.id });

  res.status(200).json({
    success: true,
    data: site,
  });
});

// @desc Post Site
// @route POST /api/v1/site
// Private
export const postSite = asyncHandler(async (req, res, next) => {
  const site = await Site.create(req.body);

  res.status(200).json({
    success: true,
    data: site,
  });
});

// @desc      Delete site
// @route     DELETE /api/v1/site/:id
// @access    Private
export const deleteSite = asyncHandler(async (req, res, next) => {
  const site = await Site.findById(req.params.id);

  if (!site) {
    return next(new ErrorResponse(`Site ${req.params.id} not found`, 404));
  }
  await site.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
