import User from "../models/userModel";

/**
 * Controller: getCurrentUser
 * ---------------------------------------
 * Fetches the currently logged-in user's data
 * using userId attached by authentication middleware.
 */
export const getCurrentUser = async (req, res) => {
  try {
    // Get userId from request (set by isAuth middleware)
    const userId = req.userId;

    // Find user in database (exclude password for security)
    const user = await User.findById(userId).select("-password");

    // If user not found → return 404
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // If user exists → send user data
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user
    });

  } catch (error) {
    // Handle server/database errors
    return res.status(500).json({
      success: false,
      message: `Error fetching user: ${error.message}`
    });
  }
};

