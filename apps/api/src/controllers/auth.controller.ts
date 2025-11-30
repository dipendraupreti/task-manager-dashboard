import bcrypt from "bcrypt";

import config from "../config";
import { SALT_ROUNDS } from "../constants";
import UserModel from "../models/user.model";
import { signJwt } from "../utils/jwt";
import { registerSchema, loginSchema } from "../validators/auth.validator";

import type { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  const parse = registerSchema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({ errors: parse.error.format() });
  }

  const { name, email, password } = parse.data;

  const existing = await UserModel.findByEmail(email);

  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await UserModel.create(name, email, hashed);

  // create jwt and set cookie so the user is logged-in immediately after registering
  const payload = { userId: user.id };
  const token = signJwt(payload);

  const isSecure =
    config.COOKIE_SECURE === "true" || config.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ user, token });
}

export async function login(req: Request, res: Response) {
  const parse = loginSchema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({ errors: parse.error.format() });
  }

  const { email, password } = parse.data;

  const user = await UserModel.findByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { userId: user.id };

  // Use runtime call to avoid type-system mismatches from @types/jsonwebtoken versions
  const token = signJwt(payload);

  const isSecure =
    config.COOKIE_SECURE === "true" || config.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: (() => {
      return 7 * 24 * 60 * 60 * 1000;
    })(),
  });

  res.json({ message: "Logged in", token });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}
