import { Response, NextFunction } from "express";
import { z } from "zod";
import { PostureAnalysisService } from "../services/posture-analysis.service";
import { PostureAnalysisRepository } from "../repositories/posture-analysis.repository";
import { PatientRepository } from "../repositories/patient.repository";
import { AuthRequest } from "../types";

const landmarkSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
  visibility: z.number().optional(),
});

const postureAnalysisSchema = z.object({
  view: z.enum(["ANTERIOR"]).default("ANTERIOR"),
  imageUrl: z.string().url(),
  shoulderTiltDeg: z.number(),
  hipTiltDeg: z.number(),
  shoulderOffsetX: z.number(),
  hipOffsetX: z.number(),
  landmarks: z.array(landmarkSchema).min(1),
});

const postureAnalysisService = new PostureAnalysisService(
  new PostureAnalysisRepository(),
  new PatientRepository()
);

export class PostureAnalysisController {
  async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const imageUrl = req.query.imageUrl as string | undefined;
      const data = await postureAnalysisService.list(req.params.patientId, imageUrl);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = postureAnalysisSchema.parse(req.body);
      const data = await postureAnalysisService.create(req.params.patientId, body);
      res.status(201).json({ data });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await postureAnalysisService.delete(req.params.patientId, req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
