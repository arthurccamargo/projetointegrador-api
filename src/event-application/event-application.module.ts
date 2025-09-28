import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { EventApplicationService } from "./event-application.service";
import { EventApplicationController } from "./event-application.controller";

@Module({
  imports: [PrismaModule],
  controllers: [EventApplicationController],
  providers: [EventApplicationService],
})
export class EventApplicationModule {}
