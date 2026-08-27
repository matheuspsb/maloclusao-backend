import { PostureAnalysis } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { PatientRepository, PatientWithEvaluator } from "../repositories/patient.repository";
import { PostureAnalysisRepository } from "../repositories/posture-analysis.repository";

type CreatePostureAnalysisDTO = {
  view: "ANTERIOR";
  imageUrl: string;
  shoulderTiltDeg: number;
  hipTiltDeg: number;
  shoulderOffsetX: number;
  hipOffsetX: number;
  landmarks: unknown;
};

export class PostureAnalysisService {
  constructor(
    private readonly postureAnalysisRepository: PostureAnalysisRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async list(patientId: string, imageUrl?: string): Promise<PostureAnalysis[]> {
    await this.ensurePatientExists(patientId);
    return this.postureAnalysisRepository.findByPatient(patientId, imageUrl);
  }

  async create(patientId: string, data: CreatePostureAnalysisDTO): Promise<PostureAnalysis> {
    const patient = await this.ensurePatientExists(patientId);

    if (!patient.images.includes(data.imageUrl)) {
      throw new AppError("Image does not belong to this patient", 400);
    }

    return this.postureAnalysisRepository.create({
      view: data.view,
      imageUrl: data.imageUrl,
      shoulderTiltDeg: data.shoulderTiltDeg,
      hipTiltDeg: data.hipTiltDeg,
      shoulderOffsetX: data.shoulderOffsetX,
      hipOffsetX: data.hipOffsetX,
      landmarks: data.landmarks as never,
      patient: { connect: { id: patientId } },
    });
  }

  async delete(patientId: string, id: string): Promise<void> {
    await this.ensurePatientExists(patientId);
    const analysis = await this.postureAnalysisRepository.findById(id);
    if (!analysis || analysis.patientId !== patientId) {
      throw new AppError("Posture analysis not found", 404);
    }
    await this.postureAnalysisRepository.delete(id);
  }

  private async ensurePatientExists(patientId: string): Promise<PatientWithEvaluator> {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new AppError("Patient not found", 404);
    return patient;
  }
}
