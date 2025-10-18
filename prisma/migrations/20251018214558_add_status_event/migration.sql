-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "status" "public"."EventStatus" NOT NULL DEFAULT 'SCHEDULED';
