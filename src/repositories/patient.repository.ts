import { Patient, Prisma } from "@prisma/client";
import { prisma } from "../config/database";

const evaluatorSelect = { evaluatedBy: { select: { id: true, name: true } } } as const;

export type PatientWithEvaluator = Prisma.PatientGetPayload<{
  include: typeof evaluatorSelect;
}>;

export class PatientRepository {
  findMany(params: {
    skip: number;
    take: number;
    where?: Prisma.PatientWhereInput;
  }): Promise<[PatientWithEvaluator[], number]> {
    return Promise.all([
      prisma.patient.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        include: evaluatorSelect,
        orderBy: { createdAt: "desc" },
      }),
      prisma.patient.count({ where: params.where }),
    ]);
  }

  findById(id: string): Promise<PatientWithEvaluator | null> {
    return prisma.patient.findUnique({
      where: { id },
      include: evaluatorSelect,
    });
  }

  create(data: Prisma.PatientCreateInput): Promise<PatientWithEvaluator> {
    return prisma.patient.create({
      data,
      include: evaluatorSelect,
    });
  }

  update(id: string, data: Prisma.PatientUpdateInput): Promise<PatientWithEvaluator> {
    return prisma.patient.update({
      where: { id },
      data,
      include: evaluatorSelect,
    });
  }

  delete(id: string): Promise<Patient> {
    return prisma.patient.delete({ where: { id } });
  }
}
