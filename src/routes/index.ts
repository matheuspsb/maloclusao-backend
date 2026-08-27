import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { patientRoutes } from "./patient.routes";
import { uploadRoutes } from "./upload.routes";
import { postureAnalysisRoutes } from "./posture-analysis.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/patients/:patientId/posture-analyses", postureAnalysisRoutes);
router.use("/patients", patientRoutes);
router.use("/upload", uploadRoutes);

export { router };
