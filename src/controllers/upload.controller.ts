import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { UploadService } from "../services/upload.service";
import { AppError } from "../utils/AppError";

const uploadService = new UploadService();

export class UploadController {
  async uploadImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) throw new AppError("No file provided", 400);

      const url = await uploadService.uploadImage(req.file.buffer);

      res.status(201).json({ data: { url } });
    } catch (err) {
      next(err);
    }
  }
}
