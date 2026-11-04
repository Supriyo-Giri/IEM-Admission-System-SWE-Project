const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./config/logger");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const {
  errorConverter,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/applications", require("./routes/application.routes")); 
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use((req, res, next) => {
  next(new (require("./utils/ApiError"))(404, "Route not found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
