/*
  Warnings:

  - You are about to drop the column `status` on the `OngProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "checkInCode" TEXT,
ADD COLUMN     "checkInCodeGeneratedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."EventApplication" ADD COLUMN     "checkInAt" TIMESTAMP(3),
ADD COLUMN     "checkedIn" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'ACCEPTED';

-- AlterTable
ALTER TABLE "public"."OngProfile" DROP COLUMN "status";
