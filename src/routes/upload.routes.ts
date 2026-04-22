import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/multer";

const router = Router();
const uploadController = new UploadController();

router.post(
  "/image",
  authenticate,
  upload.single("file"),
  uploadController.uploadImage.bind(uploadController)
);

export { router as uploadRoutes };
