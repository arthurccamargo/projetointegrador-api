-- AlterTable
ALTER TABLE "public"."OngProfile" ADD COLUMN     "averageRating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationId" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "ongId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_applicationId_key" ON "public"."Review"("applicationId");

-- CreateIndex
CREATE INDEX "Review_ongId_idx" ON "public"."Review"("ongId");

-- CreateIndex
CREATE INDEX "Review_volunteerId_idx" ON "public"."Review"("volunteerId");

-- CreateIndex
CREATE INDEX "Review_eventId_idx" ON "public"."Review"("eventId");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."EventApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "public"."VolunteerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "public"."OngProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
