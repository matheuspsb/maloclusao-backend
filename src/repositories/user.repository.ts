import { User, Prisma } from "@prisma/client";
import { prisma } from "../config/database";

type UserSummary = Prisma.UserGetPayload<{
  select: { id: true; name: true; email: true; role: true; createdAt: true };
}>;

export class UserRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<UserSummary | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  create(data: Prisma.UserCreateInput): Promise<UserSummary> {
    return prisma.user.create({
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }
}
