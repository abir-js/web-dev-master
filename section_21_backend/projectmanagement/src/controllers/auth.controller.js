import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.finfById(userId);
    const accessToken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existingUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "Username already exists", []);
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailverificationToken = hashedToken;
  user.emailverificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Email Verification",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await user
    .finfById(user._id)
    .select(
      "-password -refreshtoken -emailverificationToken -emailverificationExpiry",
    );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user", []);
  }

  return res.status(201).json(
    new ApiResponse(201, {
      message: "User registered successfully and verification email sent",
      data: createdUser,
    }),
  )

});

export { registerUser };
