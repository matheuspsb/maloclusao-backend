import { PostureAnalysis, Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class PostureAnalysisRepository {
  findByPatient(patientId: string, imageUrl?: string): Promise<PostureAnalysis[]> {
    return prisma.postureAnalysis.findMany({
      where: { patientId, ...(imageUrl && { imageUrl }) },
      orderBy: { createdAt: "desc" },
    });
  }

  create(data: Prisma.PostureAnalysisCreateInput): Promise<PostureAnalysis> {
    return prisma.postureAnalysis.create({ data });
  }

  findById(id: string): Promise<PostureAnalysis | null> {
    return prisma.postureAnalysis.findUnique({ where: { id } });
  }

  delete(id: string): Promise<PostureAnalysis> {
    return prisma.postureAnalysis.delete({ where: { id } });
  }
}
