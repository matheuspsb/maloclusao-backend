import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { patientRoutes } from "./patient.routes";
import { uploadRoutes } from "./upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/upload", uploadRoutes);

export { router };
