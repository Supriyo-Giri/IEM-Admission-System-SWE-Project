const Application = require("../models/application.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const logger = require("../config/logger");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// 1. Fill Admission Form
const submitApplication = async (req, res, next) => {
  try {
    const { personalDetails, academicDetails } = req.body;
    const applicantId = req.user._id;

    const existingApplication = await Application.findOne({
      applicant: applicantId,
    });
    if (existingApplication) {
      throw new ApiError(400, "You have already submitted an application.");
    }

    // Generate the Application ID here
    const count = await Application.countDocuments();
    const year = new Date().getFullYear();
    const applicationId = `IEM-${year}-${1001 + count}`;

    const application = await Application.create({
      applicationId, // Pass it here!
      applicant: applicantId,
      personalDetails,
      academicDetails,
    });

    logger.info(
      `Application submitted by User ID: ${applicantId} with ID: ${applicationId}`,
    );
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          application,
          "Application submitted successfully.",
        ),
      );
  } catch (error) {
    next(error);
  }
};

// 2. Get My Application
const getMyApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ applicant: req.user._id });
    if (!application) {
      throw new ApiError(404, "No application found for this user.");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, application, "Application fetched successfully"),
      );
  } catch (error) {
    next(error);
  }
};

// 3. Upload Documents to Cloudinary
const uploadDocuments = async (req, res, next) => {
  try {
    // Check if file exists in req.files
    if (!req.files || !req.files.document || req.files.document.length === 0) {
      throw new ApiError(400, "Please upload a file");
    }

    const file = req.files.document[0];

    // 🚨 READ FROM REQ.QUERY INSTEAD OF REQ.BODY 🚨
    const docType = req.query.docType;

    if (!docType) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new ApiError(
        400,
        "Please provide the document type in the URL. Example: ?docType=ID%20Proof",
      );
    }

    const application = await Application.findOne({ applicant: req.user._id });
    if (!application) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new ApiError(
        404,
        "Please submit the application form before uploading documents.",
      );
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "iem_admission_documents",
      resource_type: "auto",
    });

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    // Save to Database
    application.documents.push({
      docType,
      fileUrl: result.secure_url,
      public_id: result.public_id,
    });

    await application.save();
    logger.info(
      `Document (${docType}) uploaded to Cloudinary for Application ID: ${application.applicationId}`,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          application.documents,
          "Document uploaded successfully",
        ),
      );
  } catch (error) {
    if (req.files && req.files.document && req.files.document[0]) {
      const filePath = req.files.document[0].path;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    next(error);
  }
};
module.exports = {
  submitApplication,
  getMyApplication,
  uploadDocuments,
};
