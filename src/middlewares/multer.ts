import multer from "multer";
import { AppError } from "../utils/AppError";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      cb(new AppError("Only JPG, PNG and WebP images are allowed", 422));
      return;
    }
    cb(null, true);
  },
});
