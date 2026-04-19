import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { patientRoutes } from "./patient.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);

export { router };
