/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `OngProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `VolunteerProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OngProfile_cnpj_key" ON "public"."OngProfile"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerProfile_cpf_key" ON "public"."VolunteerProfile"("cpf");
