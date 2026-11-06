const Application = require("../models/application.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const logger = require("../config/logger");

// 1. Get all applications (with basic applicant info)
const getAllApplications = async (req, res, next) => {
  try {
    const { status, stream, search, page = 1, limit = 10 } = req.query;

    // Build the query object
    let query = {};
    if (status) query.admissionStatus = status;
    if (stream) query.preferredStream = stream;

    // Search by Application ID (e.g., IEM-2026-1001)
    if (search) {
      query.applicationId = { $regex: search, $options: "i" };
    }

    // Execute query with pagination
    const applications = await Application.find(query)
      .populate("applicant", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          applications,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          totalApplications: total,
        },
        "Applications fetched successfully",
      ),
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
const getDashboardStats = async (req, res, next) => {
  try {
    const totalApplications = await Application.countDocuments();
    const approved = await Application.countDocuments({
      admissionStatus: "Approved",
    });
    const rejected = await Application.countDocuments({
      admissionStatus: "Rejected",
    });
    const pending = await Application.countDocuments({
      admissionStatus: "Submitted",
    });

    // Stream-wise breakdown using MongoDB Aggregation
    const streamStats = await Application.aggregate([
      { $group: { _id: "$preferredStream", count: { $sum: 1 } } },
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalApplications,
          approved,
          rejected,
          pending,
          streamStats,
        },
        "Dashboard stats fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getDashboardStats,
};
