import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { PatientRepository, PatientWithEvaluator } from "../repositories/patient.repository";
import { PaginationQuery, PaginatedResponse } from "../types";

type CreatePatientDTO = {
  name: string;
  age: number;
  gender: "M" | "F";
  guardian: string;
  malocclusion: "CLASSE_I" | "CLASSE_II" | "CLASSE_III" | "NENHUMA";
  stabilometry: number;
  stabilometryLevel: "NORMAL" | "LEVE" | "MODERADO" | "SEVERO";
  images?: string[];
  evaluatedById: string;
};

export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async list(
    query: PaginationQuery & { search?: string }
  ): Promise<PaginatedResponse<PatientWithEvaluator>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PatientWhereInput = query.search
      ? { name: { contains: query.search, mode: "insensitive" } }
      : {};

    const [patients, total] = await this.patientRepository.findMany({ skip, take: limit, where });

    return {
      data: patients,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: string): Promise<PatientWithEvaluator> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) throw new AppError("Patient not found", 404);
    return patient;
  }

  async create(data: CreatePatientDTO): Promise<PatientWithEvaluator> {
    return this.patientRepository.create({
      name: data.name,
      age: data.age,
      gender: data.gender,
      guardian: data.guardian,
      malocclusion: data.malocclusion,
      stabilometry: data.stabilometry,
      stabilometryLevel: data.stabilometryLevel,
      images: data.images ?? [],
      evaluatedBy: { connect: { id: data.evaluatedById } },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<CreatePatientDTO, "evaluatedById">>
  ): Promise<PatientWithEvaluator> {
    await this.getById(id);
    return this.patientRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.patientRepository.delete(id);
  }
}
