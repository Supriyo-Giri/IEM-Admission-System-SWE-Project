const express = require("express");
const {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getDashboardStats,
} = require("../controllers/admin.controller");

const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints for managing applications
 */

router.use(verifyJWT, authorizeRoles("admin"));

/**
 * @swagger
 * /api/admin/applications:
 *   get:
 *     summary: Get all applications (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (e.g., Submitted, Approved)
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get("/applications", getAllApplications);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/stats", getDashboardStats);

/**
 * @swagger
 * /api/admin/applications/{id}:
 *   get:
 *     summary: Get a specific application by Application ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The custom Application ID (e.g., IEM-2026-1001)
 *     responses:
 *       200:
 *         description: Application data
 *       404:
 *         description: Application not found
 */
router.get("/applications/:id", getApplicationById);

/**
 * @swagger
 * /api/admin/applications/{id}/status:
 *   put:
 *     summary: Approve or reject an application (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The custom Application ID (e.g., IEM-2026-1001)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Submitted, Under Review, Approved, Rejected]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Application not found
 */
router.put("/applications/:id/status", updateApplicationStatus);

module.exports = router;
