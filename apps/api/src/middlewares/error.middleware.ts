import type { Request, Response, NextFunction } from "express";

export default (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);

  const status = err?.status || 500;

  const message = err?.message || "Server Error";

  res.status(status).json({ message });
};
