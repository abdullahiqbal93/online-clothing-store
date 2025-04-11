
import { User } from "@/api/user/schema/model";
import { logNames } from "@/lib/logger/helper";
import { mainLogger } from "@/lib/logger/winston";
import { createErrorResponse } from "@/lib/services/error";
import { createSuccessResponse } from "@/lib/services/success";
import { handleError } from "@/lib/utils/error-handle";
import { StatusCodes } from "http-status-codes";
import { compareUserPassword, generateToken, hashUserPassword } from "@/lib/utils/auth";
import { sendPasswordResetEmail } from '@/lib/utils/email';
import crypto from 'crypto';
import { env } from "@/lib/config";


export const createUser = async (req, res) => {
  try {

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return createErrorResponse(res, null, StatusCodes.CONFLICT, "User already exists");
    }

    const newUser = await User.create({
      ...req.body,
      role: req.body.role ? req.body.role : "user",
    });

    const token = await generateToken({ id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name });

    createSuccessResponse(res, { newUser, token }, StatusCodes.CREATED);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      ...req.body,
    }, {new: true}).select(["-password"]);

    createSuccessResponse(res, user, StatusCodes.CREATED);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    createSuccessResponse(res, user, StatusCodes.NO_CONTENT, "User Deleted");
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getUser = async (req, res) => {
  try {
    const users = await User.find(req.query).select(["-password"]);
    createSuccessResponse(res, users, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(["-password"]);
    createSuccessResponse(res, user, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};


export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    return createSuccessResponse(res, null, StatusCodes.OK, "Logout successful");
  } catch (e) {
    return createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return createErrorResponse(res, null, StatusCodes.UNAUTHORIZED, "User doesn't exist");
    }

    const isPasswordValid = await compareUserPassword(password, existingUser.password);
    if (!isPasswordValid) {
      return createErrorResponse(res, null, StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    if (!existingUser.isActive) {
      return createErrorResponse(res, null, StatusCodes.FORBIDDEN, "Account is inactive");
    }

    const token = await generateToken({ id: existingUser._id, email: existingUser.email, role: existingUser.role, name: existingUser.name });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,    
    });

    return createSuccessResponse(res, { id: existingUser._id, name: existingUser.name, role: existingUser.role, phoneNumber: existingUser.phoneNumber, email: existingUser.email, token: token }, StatusCodes.OK, "Login successful");
  } catch (e) {
    return createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR, "Login failed");
  }
};


export const authenticatedUser = async (req, res) => {
  try {
    const user = req.user.payload;
    return createSuccessResponse(res, user, StatusCodes.OK, "Authenticated user!");
  } catch (e) {
    return createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
}



export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.payload.id;

    const user = await User.findById(userId);
    if (!user) {
      return createErrorResponse(res, null, StatusCodes.NOT_FOUND, "User not found");
    }

    const isMatch = await compareUserPassword(currentPassword, user.password);
    if (!isMatch) {
      return createErrorResponse(res, null, StatusCodes.UNAUTHORIZED, "Current password is incorrect");
    }

    const isSameAsOldPassword = await compareUserPassword(newPassword, user.password);
    if (isSameAsOldPassword) {
      return createErrorResponse(res, null, StatusCodes.BAD_REQUEST, "New password cannot be the same as the current password");
    }

    const hashedPassword = await hashUserPassword(newPassword);

    user.password = hashedPassword;

    await user.save();

    createSuccessResponse(res, null, StatusCodes.OK, "Password updated successfully");

  } catch (error) {
    createErrorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return createSuccessResponse(res, null, StatusCodes.OK, "If your email is registered, you will receive password reset instructions.");
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
      return createSuccessResponse(res, null, StatusCodes.OK, "Password reset email sent successfully.");
    } catch (emailError) {
      mainLogger.error('Error sending password reset email:', emailError);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      return createErrorResponse(res, null, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to send password reset email. Please try again later.");
    }
  } catch (error) {
    mainLogger.error('Password reset request error:', error);
    return createErrorResponse(res,null,StatusCodes.INTERNAL_SERVER_ERROR,"An error occurred while processing your request.");
  }
};

export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return createErrorResponse(res,null,StatusCodes.BAD_REQUEST,"Password reset token is invalid or has expired.");
    }

    return createSuccessResponse(res,{ valid: true, email: user.email },StatusCodes.OK,"Token is valid.");
  } catch (error) {
    mainLogger.error('Token validation error:', error);
    return createErrorResponse(res,null,StatusCodes.INTERNAL_SERVER_ERROR,"An error occurred while validating the token.");
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return createErrorResponse(res,null,StatusCodes.BAD_REQUEST,"Password reset token is invalid or has expired.");
    }
    
    const hashedPassword = await hashUserPassword(password);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return createSuccessResponse(res,null,StatusCodes.OK,"Password has been reset successfully.");
  } catch (error) {
    mainLogger.error('Password reset error:', error);
    return createErrorResponse(res,null,StatusCodes.INTERNAL_SERVER_ERROR,"An error occurred while resetting your password.");
  }
};