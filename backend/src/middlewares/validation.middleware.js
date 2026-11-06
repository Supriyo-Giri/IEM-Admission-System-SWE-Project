const { body, validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(new ApiError(400, errorMessages));
  }
  next();
};

const validateApplication = [
  body("personalDetails.fullName")
    .notEmpty()
    .withMessage("Full name is required"),
  body("personalDetails.phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must be 10 digits"),
  body("academicDetails.tenthMarks")
    .isFloat({ min: 0, max: 100 })
    .withMessage("10th marks must be between 0 and 100"),
  body("academicDetails.twelfthMarks")
    .isFloat({ min: 0, max: 100 })
    .withMessage("12th marks must be between 0 and 100"),
  body("preferredStream")
    .isIn(["CSE", "CSE AI/ML", "CSE IOTCSBT", "CSE CyberSecurity"])
    .withMessage("Invalid stream selection"),
  validate,
];

module.exports = { validateApplication };
