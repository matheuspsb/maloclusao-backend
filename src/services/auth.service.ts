import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { UserRepository } from "../repositories/user.repository";

type RegisterResult = Awaited<ReturnType<UserRepository["create"]>>;

type LoginResult = {
  token: string;
  user: { id: string; name: string; email: string; role: string };
};

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: "PROFESSOR" | "STUDENT";
  }): Promise<RegisterResult> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new AppError("Email already in use", 409);

    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.userRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: data.role ?? "STUDENT",
    });
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 401);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new AppError("Invalid credentials", 401);

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as StringValue }
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}
