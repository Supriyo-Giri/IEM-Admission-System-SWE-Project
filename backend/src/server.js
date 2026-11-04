require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! Shutting down...");
  logger.error(err.name, err.message);
  process.exit(1);
});

// Connect to Database & Start Server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    logger.info(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });

  // Handle unhandled rejections (e.g., database connection fails after server starts)
  process.on("unhandledRejection", (err) => {
    logger.error("UNHANDLED REJECTION!  Shutting down...");
    logger.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
});
