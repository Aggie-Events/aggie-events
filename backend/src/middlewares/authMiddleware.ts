import { Request, Response, NextFunction } from "express";

/**
 * Middleware function to check if the user is authenticated.
 * If the user is not authenticated, it returns a 401 Unauthorized response.
 * If the user is authenticated, it calls the next middleware function.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if the user is authenticated
  if (!req.user) {
    console.error("Attempted to access protected route without authentication");
    return res.status(401).json({ message: "Unauthorized" });
  }

  // If the user is authenticated, continue to the next middleware
  next();
};
