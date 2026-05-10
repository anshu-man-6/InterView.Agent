import pkg from 'jsonwebtoken';
const { verify } = pkg;

/**
 * Middleware: isAuth
 * ---------------------------------------
 * Protects routes by verifying JWT token from cookies.
 * If valid → attaches userId to request.
 * If invalid/missing → returns Unauthorized.
 */
const isAuth = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided"
      });
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET);

    // Attach userId to request object
    req.userId = decoded.userId;

    // Continue to next middleware/controller
    next();

  } catch (error) {
    // Handle invalid or expired token
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token"
    });
  }
};

export default isAuth;