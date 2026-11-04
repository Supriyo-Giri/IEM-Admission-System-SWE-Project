const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    personalDetails: {
      fullName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    academicDetails: {
      highSchoolMarks: { type: Number, required: true },
      entranceExamScore: { type: Number, required: true },
    },
    documents: [
      {
        docType: { type: String, required: true },
        fileUrl: { type: String, required: true },
        public_id: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    admissionStatus: {
      type: String,
      enum: ["Submitted", "Under Review", "Approved", "Rejected"],
      default: "Submitted",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
