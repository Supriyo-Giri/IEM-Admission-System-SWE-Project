const express = require("express");
const {
  submitApplication,
  getMyApplication,
  uploadDocuments,
} = require("../controllers/application.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Applicant admission form and document uploads
 */

router.use(verifyJWT);

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit admission application form
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - personalDetails
 *               - academicDetails
 *             properties:
 *               personalDetails:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *               academicDetails:
 *                 type: object
 *                 properties:
 *                   highSchoolMarks:
 *                     type: number
 *                   entranceExamScore:
 *                     type: number
 *     responses:
 *       201:
 *         description: Application submitted
 */
router.post("/", submitApplication);

/**
 * @swagger
 * /api/applications/my-application:
 *   get:
 *     summary: Get logged-in applicant's application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application data fetched
 *       404:
 *         description: Application not found
 */
router.get("/my-application", getMyApplication);

/**
 * @swagger
 * /api/applications/upload:
 *   post:
 *     summary: Upload a document to Cloudinary
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: docType
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of document (e.g., ID Proof)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/upload",
  upload.fields([
    { name: "docType", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  uploadDocuments,
);

module.exports = router;
