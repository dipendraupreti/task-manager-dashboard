import jwt from "jsonwebtoken";

import config from "../config";

export interface JwtPayload {
  userId: number;
}

export function signJwt(payload: JwtPayload) {
  return (jwt as any).sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

export function verifyJwt(token: string): JwtPayload {
  const decoded = (jwt as any).verify(token, config.JWT_SECRET);
  return decoded as JwtPayload;
}

export default { signJwt, verifyJwt };
