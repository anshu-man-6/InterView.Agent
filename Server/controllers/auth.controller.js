import genToken from "../config/token.js";
import User from "../models/userModel.js";

/**
 * Google Authentication Controller
 */
export const googleAuth = async (req, res) => {

  try {

    // Fetch name & email from frontend
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required"
      });
    }

    // Check existing user
    let user = await User.findOne({ email });

    // Create new user if not exists
    if (!user) {

      user = await User.create({
        name,
        email
      });

    }

    // Generate JWT Token
    const token = await genToken(user._id);

    // Store token in cookies
    res.cookie("token", token, {

      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000

    });

    // Send response
    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: `Google Auth Error: ${error.message}`
    });

  }
};

/**
 * Logout Controller
 */
export const logout = async (req, res) => {

  try {

    // Clear token cookie
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logout Successful"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: `Something went wrong: ${error.message}`
    });

  }
};