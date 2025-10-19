import { Module } from "@nestjs/common";
import { EventApplicationService } from "./event-application.service";
import { EventApplicationController } from "./event-application.controller";
import { PrismaModule } from "../../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [EventApplicationController],
  providers: [EventApplicationService],
})
export class EventApplicationModule {}
