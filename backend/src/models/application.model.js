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
      tenthMarks: { type: Number, required: true, min: 0, max: 100 },
      twelfthMarks: { type: Number, required: true, min: 0, max: 100 },
      wbjeeRank: { type: Number, default: null }, // Optional
      jeeMainsRank: { type: Number, default: null }, // Optional
    },
    preferredStream: {
      type: String,
      required: true,
      enum: ["CSE", "CSE AI/ML", "CSE IOTCSBT", "CSE CyberSecurity"],
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
