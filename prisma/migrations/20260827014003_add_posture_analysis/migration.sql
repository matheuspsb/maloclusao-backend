-- CreateEnum
CREATE TYPE "PostureView" AS ENUM ('ANTERIOR');

-- CreateTable
CREATE TABLE "posture_analyses" (
    "id" TEXT NOT NULL,
    "view" "PostureView" NOT NULL DEFAULT 'ANTERIOR',
    "image_url" TEXT NOT NULL,
    "shoulder_tilt_deg" DOUBLE PRECISION NOT NULL,
    "hip_tilt_deg" DOUBLE PRECISION NOT NULL,
    "shoulder_offset_x" DOUBLE PRECISION NOT NULL,
    "hip_offset_x" DOUBLE PRECISION NOT NULL,
    "landmarks" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patient_id" TEXT NOT NULL,

    CONSTRAINT "posture_analyses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posture_analyses" ADD CONSTRAINT "posture_analyses_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
