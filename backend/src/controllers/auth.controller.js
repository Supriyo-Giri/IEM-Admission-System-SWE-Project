const User = require("../models/user.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    // Note: In production, do not allow public 'admin' registration.
    // Here we allow it for testing, or you can hardcode role to 'applicant'.
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "applicant",
    });

    const createdUser = await User.findById(user._id).select("-password");
    logger.info(`New user registered: ${email}`);

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const token = generateToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");
    logger.info(`User logged in: ${email}`);

    return res
      .status(200)
      .cookie("accessToken", token, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, token },
          "User logged in successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.user, "Current user fetched successfully"),
      );
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };
