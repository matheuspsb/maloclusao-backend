import { AuthService } from "../../src/services/auth.service";
import { UserRepository } from "../../src/repositories/user.repository";
import { AppError } from "../../src/utils/AppError";

jest.mock("../../src/repositories/user.repository");
jest.mock("../../src/config/env", () => ({
  env: { JWT_SECRET: "test_secret_32_chars_minimum_ok!", JWT_EXPIRES_IN: "7d" },
}));

const mockUserRepository = jest.mocked(UserRepository);

describe("AuthService", () => {
  let authService: AuthService;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepo = new UserRepository() as jest.Mocked<UserRepository>;
    authService = new AuthService(userRepo);
  });

  describe("register", () => {
    it("should throw if email is already in use", async () => {
      userRepo.findByEmail.mockResolvedValueOnce({ id: "1", email: "test@test.com" } as never);

      await expect(
        authService.register({ name: "Test", email: "test@test.com", password: "123456" })
      ).rejects.toThrow(new AppError("Email already in use", 409));
    });
  });

  describe("login", () => {
    it("should throw if user is not found", async () => {
      userRepo.findByEmail.mockResolvedValueOnce(null);

      await expect(authService.login("notfound@test.com", "123456")).rejects.toThrow(
        new AppError("Invalid credentials", 401)
      );
    });
  });
});

// suppress unused import warning
void mockUserRepository;
