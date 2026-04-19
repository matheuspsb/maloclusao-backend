import { Response, NextFunction } from "express";
import { z } from "zod";
import { PatientService } from "../services/patient.service";
import { PatientRepository } from "../repositories/patient.repository";
import { AuthRequest } from "../types";

const patientSchema = z.object({
  name: z.string().min(2),
  age: z.number().int().min(0).max(120),
  gender: z.enum(["M", "F"]),
  guardian: z.string().min(2),
  malocclusion: z.enum(["CLASSE_I", "CLASSE_II", "CLASSE_III", "NENHUMA"]),
  stabilometry: z.number().min(0),
  stabilometryLevel: z.enum(["NORMAL", "LEVE", "MODERADO", "SEVERO"]),
  images: z.array(z.string().url()).optional(),
});

const patientService = new PatientService(new PatientRepository());

export class PatientController {
  async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;
      const result = await patientService.list({ page, limit, search });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await patientService.getById(req.params.id);
      res.json({ data: patient });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = patientSchema.parse(req.body);
      const patient = await patientService.create({ ...body, evaluatedById: req.user!.sub });
      res.status(201).json({ data: patient });
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = patientSchema.partial().parse(req.body);
      const patient = await patientService.update(req.params.id, body);
      res.json({ data: patient });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await patientService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
