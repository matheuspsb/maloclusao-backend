import { Router } from "express";
import { PostureAnalysisController } from "../controllers/posture-analysis.controller";
import { authenticate } from "../middlewares/authenticate";

const router = Router({ mergeParams: true });
const postureAnalysisController = new PostureAnalysisController();

router.use(authenticate);

router.get("/", postureAnalysisController.list.bind(postureAnalysisController));
router.post("/", postureAnalysisController.create.bind(postureAnalysisController));
router.delete("/:id", postureAnalysisController.delete.bind(postureAnalysisController));

export { router as postureAnalysisRoutes };
