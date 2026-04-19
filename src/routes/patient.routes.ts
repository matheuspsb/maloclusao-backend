import { Router } from "express";
import { PatientController } from "../controllers/patient.controller";
import { authenticate } from "../middlewares/authenticate";

const router = Router();
const patientController = new PatientController();

router.use(authenticate);

router.get("/", patientController.list.bind(patientController));
router.get("/:id", patientController.getById.bind(patientController));
router.post("/", patientController.create.bind(patientController));
router.patch("/:id", patientController.update.bind(patientController));
router.delete("/:id", patientController.delete.bind(patientController));

export { router as patientRoutes };
