const Application = require("../models/application.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const logger = require("../config/logger");

// 1. Get all applications (with basic applicant info)
const getAllApplications = async (req, res, next) => {
  try {
    // Optional filter by status (e.g., ?status=Submitted)
    const filter = {};
    if (req.query.status) {
      filter.admissionStatus = req.query.status;
    }

    const applications = await Application.find(filter)
      .populate("applicant", "firstName lastName email") // Only fetch specific user fields
      .sort({ createdAt: -1 }); // Newest first

    return res
      .status(200)
      .json(
        new ApiResponse(200, applications, "Applications fetched successfully"),
      );
  } catch (error) {
    next(error);
  }
};

// 2. Get a single application by Custom Application ID
const getApplicationById = async (req, res, next) => {
  try {
    // Search using the custom applicationId field
    const application = await Application.findOne({ applicationId: req.params.id })
      .populate('applicant', 'firstName lastName email');

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    return res.status(200).json(
      new ApiResponse(200, application, 'Application fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

// 3. Update Admission Status (Approve/Reject)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Submitted', 'Under Review', 'Approved', 'Rejected'];

    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Search using the custom applicationId field
    const application = await Application.findOne({ applicationId: req.params.id });
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    application.admissionStatus = status;
    await application.save();

    logger.info(`Admin (${req.user.email}) updated Application ${application.applicationId} to ${status}`);

    return res.status(200).json(
      new ApiResponse(200, application, `Application status updated to ${status}`)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
};
