import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";

// Create a new router instance
const userRouter = express.Router();

/**
 * Route: GET /api/user/current-user
 * ---------------------------------------
 * Description:
 * Returns details of the currently logged-in user.
 *
 * Middleware:
 * - isAuth → verifies JWT token and attaches userId to req
 *
 * Controller:
 * - getCurrentUser → fetches user data from database
 */
userRouter.get("/current-user", isAuth, getCurrentUser);

// Export router to use in main server file
export default userRouter;