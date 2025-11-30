import { verifyJwt } from "../utils/jwt";

import type { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenFromCookie = req.cookies?.token as string | undefined;

    const authHeader = req.header("Authorization") || "";

    const tokenFromHeader = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

    const token = tokenFromCookie ?? tokenFromHeader;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = verifyJwt(token);

    req.user = { id: decoded.userId };

    next();
  } catch (err) {
    // log the error to help debugging token verification failures

    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
